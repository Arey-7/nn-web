"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SLATS = 7;

// The route this component last ran for. It survives the remount it gets on
// every navigation, so a cold load can be told apart from a route change
// without reading window during render — doing that server/client branch in
// state is a hydration mismatch. Storing the path rather than a flag matters:
// StrictMode runs the effect twice on the very first mount, and a boolean
// would read that second pass as a navigation and play the entrance on a cold
// load, when the preloader already owns the screen.
let lastPath: string | null = null;

/**
 * Wipes a set of slats away as each new route paints. The slats render
 * collapsed, identical on server and client, and only open when a navigation
 * actually happens; on a cold load the preloader owns the screen instead.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const first = lastPath === null || lastPath === pathname;
    lastPath = pathname;
    if (first) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slats = cover.current?.children;
    if (!slats?.length || !body.current) return;

    const ctx = gsap.context(() => {
      gsap.set(slats, { scaleY: 1, transformOrigin: "bottom" });
      gsap.to(slats, {
        scaleY: 0,
        duration: 0.75,
        stagger: 0.05,
        ease: "expo.inOut",
      });
      // clearProps is not cosmetic here. GSAP leaves an identity matrix behind
      // when a transform tween ends, and *any* transform — identity included —
      // makes this wrapper the containing block for every position:fixed
      // descendant. Every pinned section on the page is one of those, so a
      // leftover matrix drags them off screen for the whole of their pin.
      // Refreshing afterwards re-measures the pins, which were set up while
      // the lift was still applied.
      gsap.from(body.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.25,
        ease: "expo.out",
        clearProps: "transform,opacity",
        onComplete: () => ScrollTrigger.refresh(),
      });
    }, root);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={root}>
      <div
        ref={cover}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-110 flex"
      >
        {Array.from({ length: SLATS }).map((_, i) => (
          <div key={i} className="h-full flex-1 scale-y-0 bg-paper-sunk" />
        ))}
      </div>
      <div ref={body}>{children}</div>
    </div>
  );
}

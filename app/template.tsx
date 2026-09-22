"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const SLATS = 7;

// Survives the remount this component gets on every navigation, so the cold
// load can be told apart from a route change without reading window during
// render — doing that server/client branch in state is a hydration mismatch.
let navigated = false;

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
    const first = !navigated;
    navigated = true;
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
      gsap.from(body.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.25,
        ease: "expo.out",
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

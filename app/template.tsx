"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const SLATS = 7;

/**
 * Re-mounts on every navigation, so the cover can wipe away as the new route
 * paints. On a cold load the preloader owns the screen instead, and this
 * stands down to avoid two curtains at once.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [covering] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem("nn-intro") === "seen" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useLayoutEffect(() => {
    if (!covering) return;
    const slats = cover.current?.children;
    if (!slats?.length || !body.current) return;

    const ctx = gsap.context(() => {
      gsap.set(slats, { scaleY: 1, transformOrigin: "bottom" });
      gsap.to(slats, {
        scaleY: 0,
        duration: 0.75,
        stagger: 0.05,
        ease: "expo.inOut",
        onComplete: () => cover.current?.remove(),
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
  }, [covering, pathname]);

  return (
    <div ref={root}>
      {covering && (
        <div
          ref={cover}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[110] flex"
        >
          {Array.from({ length: SLATS }).map((_, i) => (
            <div key={i} className="h-full flex-1 bg-paper-sunk" />
          ))}
        </div>
      )}
      <div ref={body}>{children}</div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CLIENTS } from "../content/work";
import { scrollState } from "../lib/smooth-scroll";

export default function ClientMarquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    let skew = 0;
    const half = () => el.scrollWidth / 2;

    const tick = gsap.ticker.add(() => {
      const v = scrollState.velocity || 0;

      // Baseline drift, plus a push in whichever direction you're scrolling.
      offset -= 0.9 + v * 0.22;
      const w = half();
      if (w > 0) {
        if (offset <= -w) offset += w;
        if (offset > 0) offset -= w;
      }

      skew += (gsap.utils.clamp(-14, 14, v * 0.7) - skew) * 0.08;
      gsap.set(el, { x: offset, skewX: skew });
    });

    return () => gsap.ticker.remove(tick as unknown as () => void);
  }, []);

  return (
    <section
      aria-labelledby="clients-heading"
      className="border-y border-line bg-paper py-16 md:py-24"
    >
      <h2 id="clients-heading" className="sr-only">
        Clients
      </h2>

      <div className="edge-fade-x overflow-hidden">
        <div
          ref={track}
          className="flex w-max gap-14 pr-14 will-change-transform md:gap-24 md:pr-24"
        >
          {/* Doubled so the wrap has something to reveal. */}
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <span
              key={`${client}-${i}`}
              aria-hidden={i >= CLIENTS.length}
              className="text-display shrink-0 text-[clamp(1.8rem,4.4vw,4rem)] text-ink-faint"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

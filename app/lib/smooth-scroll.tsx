"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scroll position and velocity, read by the WebGL layer and the cursor. */
export const scrollState = { velocity: 0, progress: 0 };

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Native momentum on touch is better than anything we'd fake.
      syncTouch: false,
    });

    lenis.on("scroll", (e: { velocity: number; progress: number }) => {
      scrollState.velocity = e.velocity;
      scrollState.progress = e.progress;
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      scrollState.velocity = 0;
    };
  }, []);

  return null;
}

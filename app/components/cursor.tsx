"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Ring-and-dot cursor. Sits in difference blend mode so it inverts against
 * whatever is under it, and swells with a label over anything carrying a
 * data-cursor attribute. Pointer devices only.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...pos };

    const setRingX = gsap.quickSetter(ring.current, "x", "px");
    const setRingY = gsap.quickSetter(ring.current, "y", "px");
    const setDotX = gsap.quickSetter(dot.current, "x", "px");
    const setDotY = gsap.quickSetter(dot.current, "y", "px");

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setDotX(e.clientX);
      setDotY(e.clientY);
    };

    const tick = gsap.ticker.add(() => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      setRingX(pos.x);
      setRingY(pos.y);
    });

    const enter = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      if (!el) return;
      const text = el.getAttribute("data-cursor") || "";
      if (label.current) label.current.textContent = text === "true" ? "" : text;
      gsap.to(ring.current, {
        scale: text && text !== "true" ? 2.6 : 1.8,
        borderColor: "rgba(255,255,255,0)",
        backgroundColor: "rgba(255,255,255,1)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(label.current, { opacity: 1, duration: 0.3 });
      gsap.to(dot.current, { opacity: 0, duration: 0.2 });
    };

    const leave = (e: Event) => {
      if (!(e.target as HTMLElement)?.closest?.("[data-cursor]")) return;
      gsap.to(ring.current, {
        scale: 1,
        borderColor: "rgba(255,255,255,0.65)",
        backgroundColor: "rgba(255,255,255,0)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(label.current, { opacity: 0, duration: 0.2 });
      gsap.to(dot.current, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", enter, true);
    document.addEventListener("pointerout", leave, true);

    return () => {
      gsap.ticker.remove(tick as unknown as () => void);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", enter, true);
      document.removeEventListener("pointerout", leave, true);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100 mix-blend-difference"
    >
      <div
        ref={ring}
        className="absolute -left-5 -top-5 grid h-10 w-10 place-items-center rounded-full border border-white/65"
      >
        <span
          ref={label}
          className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black opacity-0"
        />
      </div>
      <div
        ref={dot}
        className="absolute -left-0.75 -top-0.75 h-1.5 w-1.5 rounded-full bg-white"
      />
    </div>
  );
}

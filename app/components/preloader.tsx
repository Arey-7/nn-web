"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CLIENTS } from "../content/work";
import { SITE } from "../content/site";

const SLATS = 7;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [client, setClient] = useState(CLIENTS[0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Once per session — nobody wants the overture on every navigation.
    if (sessionStorage.getItem("rr-intro") === "seen") {
      setDone(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem("rr-intro", "seen");
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const counter = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("rr-intro", "seen");
        document.body.style.overflow = "";
        setDone(true);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.v);
        setCount(v);
        setClient(CLIENTS[Math.floor((v / 100) * (CLIENTS.length - 1))]);
      },
    })
      .to(".intro-line", {
        yPercent: -110,
        duration: 0.7,
        stagger: 0.05,
        ease: "expo.inOut",
      })
      .to(
        ".intro-slat",
        {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.9,
          stagger: 0.055,
          ease: "expo.inOut",
        },
        "-=0.35"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[120] overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLATS }).map((_, i) => (
          <div key={i} className="intro-slat h-full flex-1 bg-paper-sunk" />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
        <div className="overflow-hidden">
          <p className="intro-line text-label text-ink-faint">
            {SITE.name} &mdash; {SITE.address.split(",")[0]}
          </p>
        </div>

        <div className="overflow-hidden">
          <p className="intro-line text-label truncate text-ink-muted">
            {client}
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="overflow-hidden">
            <p className="intro-line text-display text-[clamp(3.5rem,14vw,11rem)] leading-none text-ink tabular-nums">
              {String(count).padStart(3, "0")}
            </p>
          </div>
          <div className="overflow-hidden">
            <p className="intro-line text-label pb-4 text-ink-faint">
              Loading the archive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

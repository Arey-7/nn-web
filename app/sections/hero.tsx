"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ALL_PRINT } from "../content/work";

gsap.registerPlugin(ScrollTrigger);

// Five columns of work drifting at different rates. The base drift is a pure
// CSS animation so it runs on the compositor; GSAP only touches the
// scroll-linked layer underneath the type.
const COLUMNS = 5;
const SPEEDS = [78, 62, 90, 70, 84];

function buildColumns() {
  const cols: (typeof ALL_PRINT)[] = Array.from({ length: COLUMNS }, () => []);
  ALL_PRINT.forEach((piece, i) => cols[i % COLUMNS].push(piece));
  return cols;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const columns = buildColumns();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .to(".hero-type", { yPercent: -18, opacity: 0, ease: "none" }, 0)
        .to(".hero-wall", { yPercent: 12, opacity: 0.5, ease: "none" }, 0);

      gsap.from(".hero-line", {
        yPercent: 115,
        duration: 1.2,
        stagger: 0.09,
        ease: "expo.out",
        delay: 0.15,
      });

      gsap.from(".hero-meta", {
        opacity: 0,
        duration: 1,
        delay: 0.9,
        ease: "power2.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-paper-sunk"
    >
      <div
        className="hero-wall pointer-events-none absolute inset-0 -z-10 grid grid-cols-3 gap-3 opacity-[0.22] edge-fade-y md:grid-cols-5 md:gap-4"
        aria-hidden="true"
      >
        {columns.map((col, i) => (
          <div
            key={i}
            className={`flex flex-col gap-3 md:gap-4 ${
              i >= 3 ? "hidden md:flex" : ""
            } ${i % 2 ? "mt-[-8%]" : ""}`}
            style={{
              animation: `drift ${SPEEDS[i]}s linear infinite`,
              animationDirection: i % 2 ? "reverse" : "normal",
            }}
          >
            {[...col, ...col].map((piece, j) => (
              <Image
                key={`${piece.src}-${j}`}
                src={piece.tile}
                alt=""
                width={360}
                height={Math.round((360 * piece.height) / piece.width)}
                sizes="(min-width: 768px) 20vw, 33vw"
                className="w-full grayscale"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-paper-sunk via-transparent to-paper-sunk" />

      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        <h1 className="hero-type text-display text-[clamp(2.9rem,10.5vw,10.5rem)] text-ink">
          {["We link brands", "and causes", "to the people."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span className="hero-line block">
                {i === 1 ? (
                  <>
                    and <span className="italic text-accent">causes</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-meta mt-10 flex flex-wrap items-end gap-x-10 gap-y-5">
          <p className="max-w-md text-lg leading-relaxed text-ink-muted">
            An advertising agency in Nairobi. Thirty years of press, film and
            radio for the brands and the causes that had something worth
            saying.
          </p>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-label text-ink"
          >
            <span className="h-px w-10 bg-ink transition-all duration-500 ease-(--ease-out-expo) group-hover:w-16 group-hover:bg-accent" />
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}

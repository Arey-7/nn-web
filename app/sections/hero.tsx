"use client";

import { useRef, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ALL_PRINT } from "../content/work";

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

const LINES = ["We link brands", "and causes", "to the people."];
const COLUMNS = 5;
const SPEEDS = [78, 62, 90, 70, 84];

function buildColumns() {
  const cols: (typeof ALL_PRINT)[] = Array.from({ length: COLUMNS }, () => []);
  ALL_PRINT.forEach((piece, i) => cols[i % COLUMNS].push(piece));
  return cols;
}

/** Splits a line into per-character spans so the reveal can stagger. */
function Line({ text, accent }: { text: string; accent?: string }) {
  const render = (str: string, italic = false) =>
    str.split("").map((ch, i) => (
      <span
        key={`${ch}-${i}`}
        className={`hero-char inline-block ${italic ? "italic text-accent" : ""}`}
      >
        {ch === " " ? " " : ch}
      </span>
    ));

  if (!accent) return <>{render(text)}</>;

  const [before, after] = text.split(accent);
  return (
    <>
      {render(before)}
      {render(accent, true)}
      {render(after)}
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [webgl, setWebgl] = useState<"pending" | "ok" | "no">("pending");
  const columns = buildColumns();

  const onUnsupported = useCallback(() => setWebgl("no"), []);
  const onReady = useCallback(() => setWebgl("ok"), []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        gsap.set(".hero-char, .hero-meta", { opacity: 1, yPercent: 0 });
        return;
      }

      gsap.from(".hero-char", {
        yPercent: 108,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: { each: 0.018, from: "start" },
        delay: 0.25,
      });

      gsap.from(".hero-meta", {
        opacity: 0,
        y: 18,
        duration: 1,
        delay: 1.15,
        ease: "power2.out",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .to(".hero-type", { yPercent: -22, opacity: 0, ease: "none" }, 0)
        .to(".hero-wall", { yPercent: 12, opacity: 0.4, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-paper-sunk"
    >
      <HeroCanvas onReady={onReady} onUnsupported={onUnsupported} />

      {webgl !== "ok" && (
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
      )}

      {/* Holds the middle of the frame back so the headline stays readable
          while the archive streams past it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 75% at 32% 48%, var(--paper-sunk) 0%, color-mix(in srgb, var(--paper-sunk) 78%, transparent) 38%, transparent 68%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-paper-sunk to-transparent" />

      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        <h1 className="hero-type text-display text-[clamp(2.9rem,10.5vw,10.5rem)] text-ink mix-blend-difference">
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden py-[0.02em]">
              <span className="block">
                <Line
                  text={line}
                  accent={line === "and causes" ? "causes" : undefined}
                />
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
            data-cursor="view"
            className="group inline-flex items-center gap-3 text-label text-ink"
          >
            <span className="h-px w-10 bg-ink transition-all duration-500 ease-out-expo group-hover:w-16 group-hover:bg-accent" />
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}

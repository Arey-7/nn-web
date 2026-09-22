"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lightbox from "../components/lightbox";
import {
  FILMS,
  accentVars,
  type Campaign,
  type FilmPiece,
} from "../content/work";

gsap.registerPlugin(ScrollTrigger);

type Entry = FilmPiece & { campaign: Campaign };

const ENTRIES: Entry[] = FILMS.flatMap((c) =>
  (c.films ?? []).map((film) => ({ ...film, campaign: c }))
);

const RAIL_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const runtime = (s: number) =>
  s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `0:${s}`;

function FilmCard({
  entry,
  index,
  onOpen,
}: {
  entry: Entry;
  index: number;
  onOpen: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);

  const start = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setPreviewing(true);
    video.current?.play().catch(() => setPreviewing(false));
  };
  const stop = () => {
    setPreviewing(false);
    video.current?.pause();
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      data-cursor="play"
      className="group block w-full text-left"
      aria-label={`Play ${entry.campaign.client} — ${entry.title}`}
    >
      <div className="relative overflow-hidden border border-line bg-black shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] transition-colors duration-500 group-hover:border-line-strong">
        <div className="relative aspect-video">
          <Image
            src={entry.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 46vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-all duration-700 ${
              previewing ? "opacity-0" : "opacity-100 grayscale group-hover:grayscale-0"
            }`}
          />
          <video
            ref={video}
            src={entry.loop}
            poster={entry.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              previewing ? "opacity-100" : "opacity-0"
            }`}
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <span className="pointer-events-none absolute left-5 top-4 text-display text-[3.5rem] leading-none text-white/25 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white/90">
            {runtime(entry.seconds)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label truncate text-ink-faint">
            {entry.campaign.client}
          </p>
          <p className="mt-1.5 truncate text-xl text-ink transition-colors group-hover:text-accent">
            {entry.title}
          </p>
        </div>
        <span
          className="text-label ca-text shrink-0"
          style={accentVars(entry.campaign)}
        >
          {entry.campaign.discipline}
        </span>
      </div>
    </button>
  );
}

export default function FilmRoom() {
  const [active, setActive] = useState<Entry | null>(null);
  const [rail, setRail] = useState(false);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(RAIL_QUERY);
    const sync = () => setRail(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!rail) return;
    const ctx = gsap.context(() => {
      const el = track.current;
      if (!el) return;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 80);

      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, [rail]);

  return (
    <section
      ref={section}
      aria-labelledby="film-heading"
      className={`relative overflow-hidden bg-paper-sunk ${
        rail ? "flex h-svh flex-col" : "py-24"
      }`}
    >
      <div
        className={`mx-auto w-full max-w-[1600px] shrink-0 px-6 md:px-10 ${
          rail ? "pt-28" : ""
        }`}
      >
        <div className="flex items-baseline justify-between border-b border-line pb-6">
          <h2 id="film-heading" className="text-label text-ink-faint">
            The film room
          </h2>
          <p className="text-label text-ink-faint">
            {String(ENTRIES.length).padStart(2, "0")} films
          </p>
        </div>

        <p
          className={`max-w-3xl text-display text-ink ${
            rail
              ? "mt-7 text-[clamp(1.5rem,2.6vw,2.4rem)]"
              : "mt-10 text-[clamp(1.9rem,4.6vw,4rem)]"
          }`}
        >
          Television, as it went out &mdash; straight off the broadcast
          masters.
        </p>
      </div>

      <div className={rail ? "flex flex-1 items-center overflow-hidden" : ""}>
        <ul
          ref={track}
          className={
            rail
              ? "flex w-max gap-10 px-6 will-change-transform md:px-10"
              : "mx-auto mt-16 grid max-w-[1600px] gap-x-8 gap-y-14 px-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3"
          }
        >
          {ENTRIES.map((entry, i) => (
            <li
              key={entry.id}
              className={rail ? "w-[34vw] shrink-0" : ""}
              // Staggered baselines give the rail a horizon rather than a row.
              style={rail ? { marginTop: `${(i % 3) * 2.2}rem` } : undefined}
            >
              <FilmCard
                entry={entry}
                index={i}
                onOpen={() => setActive(entry)}
              />
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.title ?? ""}
        client={active?.campaign.client ?? ""}
        src={active?.film ?? ""}
        poster={active?.poster ?? ""}
      />
    </section>
  );
}

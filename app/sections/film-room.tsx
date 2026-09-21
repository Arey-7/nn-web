"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Lightbox from "../components/lightbox";
import { FILMS, accentVars, type Campaign, type FilmPiece } from "../content/work";

type Entry = FilmPiece & { campaign: Campaign };

const ENTRIES: Entry[] = FILMS.flatMap((c) =>
  (c.films ?? []).map((film) => ({ ...film, campaign: c }))
);

const runtime = (s: number) =>
  s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `0:${s}`;

function FilmCard({ entry, onOpen }: { entry: Entry; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);

  // The loops are muted, six seconds and only ever fetched on intent — the
  // poster carries the card until someone actually reaches for it.
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
      className="group block w-full text-left"
      aria-label={`Play ${entry.campaign.client} — ${entry.title}`}
    >
      {/* Broadcast monitor: these are SD masters, so they are framed rather
          than blown up, and the frame is part of the art direction. */}
      <div className="relative overflow-hidden rounded-[3px] border border-line bg-black shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] transition-colors duration-500 group-hover:border-line-strong">
        <div className="relative aspect-video">
          <Image
            src={entry.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-500 ${
              previewing ? "opacity-0" : "opacity-100"
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

          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white/90">
            {runtime(entry.seconds)}
          </span>

          <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-500 ease-(--ease-out-expo) group-hover:scale-110 group-hover:opacity-100">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-label text-ink-faint">{entry.campaign.client}</p>
          <p className="mt-1.5 text-lg text-ink transition-colors group-hover:text-accent">
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

  return (
    <section aria-labelledby="film-heading" className="bg-paper-sunk py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-6">
          <h2 id="film-heading" className="text-label text-ink-faint">
            The film room
          </h2>
          <p className="text-label text-ink-faint">
            {String(ENTRIES.length).padStart(2, "0")} films
          </p>
        </div>

        <p className="mt-10 max-w-2xl text-display text-[clamp(1.7rem,3.6vw,3.2rem)] text-ink">
          Television, as it went out &mdash; straight off the broadcast masters.
        </p>

        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.map((entry) => (
            <li key={entry.id}>
              <FilmCard entry={entry} onOpen={() => setActive(entry)} />
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

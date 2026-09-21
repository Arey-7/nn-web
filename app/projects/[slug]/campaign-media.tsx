"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "../../components/lightbox";
import type { Campaign, FilmPiece } from "../../content/work";

const clock = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function CampaignMedia({ campaign }: { campaign: Campaign }) {
  const [playing, setPlaying] = useState<FilmPiece | null>(null);

  const films = campaign.films ?? [];
  const radio = campaign.radio ?? [];

  return (
    <>
      {films.length > 0 && (
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {films.map((film) => (
            <li key={film.id}>
              <button
                type="button"
                onClick={() => setPlaying(film)}
                className="group block w-full text-left"
                aria-label={`Play ${film.title}`}
              >
                <div className="relative aspect-video overflow-hidden border border-line bg-black">
                  <Image
                    src={film.poster}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <p className="text-lg text-ink transition-colors group-hover:text-accent">
                    {film.title}
                  </p>
                  <span className="text-label shrink-0 tabular-nums text-ink-faint">
                    {clock(film.seconds)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {radio.length > 0 && (
        <ul className="divide-y divide-line border-y border-line">
          {radio.map((spot) => (
            <li
              key={spot.id}
              className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg text-ink">{spot.title}</p>
                <p className="text-label mt-1 text-ink-faint">
                  {clock(spot.seconds)}
                </p>
              </div>
              <audio
                controls
                preload="none"
                src={spot.audio}
                className="w-full sm:w-80"
              >
                <a href={spot.audio}>Download {spot.title}</a>
              </audio>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={playing !== null}
        onClose={() => setPlaying(null)}
        title={playing?.title ?? ""}
        client={campaign.client}
        src={playing?.film ?? ""}
        poster={playing?.poster ?? ""}
      />
    </>
  );
}

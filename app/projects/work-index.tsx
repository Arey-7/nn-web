"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CAMPAIGNS,
  coverOf,
  pieceCount,
  type Campaign,
  type Medium,
} from "../content/work";

type Filter = Medium | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "print", label: "Press" },
  { id: "film", label: "Film" },
  { id: "radio", label: "Radio" },
];

const countFor = (id: Filter) =>
  id === "all"
    ? CAMPAIGNS.length
    : CAMPAIGNS.filter((c) => c.medium === id).length;

function Card({ campaign }: { campaign: Campaign }) {
  const cover = coverOf(campaign);
  const n = pieceCount(campaign);

  return (
    <Link href={`/projects/${campaign.slug}`} className="group block">
      <div className="relative overflow-hidden border border-line bg-paper-sunk">
        {cover ? (
          <div
            className={`relative ${
              campaign.medium === "film" ? "aspect-video" : "aspect-4/5"
            }`}
          >
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04] ${
                // Press work is never cropped — a headline cut in half is a
                // worse sin here than a little letterboxing.
                campaign.medium === "film"
                  ? "object-cover"
                  : "object-contain p-5"
              }`}
            />
          </div>
        ) : (
          // Radio: nothing to show, so the headline becomes the artwork.
          <div className="flex aspect-4/5 items-center p-8">
            <p
              className="text-display text-[clamp(1.4rem,2.4vw,2.2rem)]"
              style={{ color: campaign.accent }}
            >
              {campaign.headline}
            </p>
          </div>
        )}

        <span
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
          style={{ backgroundColor: campaign.accent }}
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label truncate text-ink-faint">
            {campaign.client}
          </p>
          <p className="mt-1.5 truncate text-lg text-ink transition-colors group-hover:text-accent">
            {campaign.title}
          </p>
        </div>
        <span className="text-label shrink-0 text-ink-faint">
          {n} {n === 1 ? "piece" : "pieces"}
        </span>
      </div>
    </Link>
  );
}

export default function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("all");

  const shown =
    filter === "all"
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.medium === filter);

  return (
    <>
      <div className="mt-12 flex flex-wrap gap-2 border-b border-line pb-6">
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`text-label rounded-full border px-5 py-2.5 transition-colors duration-300 ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}{" "}
              <span className={active ? "text-paper/60" : "text-ink-faint"}>
                {countFor(f.id)}
              </span>
            </button>
          );
        })}
      </div>

      <ul
        key={filter}
        className="mt-14 grid animate-[fade-up_0.6s_var(--ease-out-expo)_both] gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((campaign) => (
          <li key={campaign.slug}>
            <Card campaign={campaign} />
          </li>
        ))}
      </ul>
    </>
  );
}

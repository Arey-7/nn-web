"use client";

import Image from "next/image";
import { useOverlay } from "../lib/use-overlay";
import type { Campaign } from "../content/work";

type Props = {
  campaign: Campaign | null;
  onClose: () => void;
};

export default function CampaignGallery({ campaign, onClose }: Props) {
  const open = campaign !== null;
  const container = useOverlay(open, onClose);

  if (!campaign) return null;

  const pieces = campaign.print ?? [];

  return (
    <div
      ref={container}
      role="dialog"
      aria-modal="true"
      aria-label={`${campaign.client} — ${campaign.title}`}
      className="fixed inset-0 z-70 overflow-y-auto overscroll-contain bg-paper-sunk"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-sunk/90 px-6 py-5 backdrop-blur-md md:px-10">
        <div className="min-w-0">
          <p className="text-label truncate" style={{ color: campaign.accent }}>
            {campaign.client}
          </p>
          <p className="mt-1 truncate text-lg text-ink">
            {campaign.title}
            {campaign.year ? ` · ${campaign.year}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full border border-line-strong p-3 text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 5 19 19M19 5 5 19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10">
        <blockquote className="text-display text-[clamp(1.8rem,4.4vw,3.6rem)] text-ink">
          {campaign.headline}
        </blockquote>
        <p className="mt-7 max-w-2xl leading-relaxed text-ink-muted">
          {campaign.blurb}
        </p>

        <ul className="mt-16 space-y-20">
          {pieces.map((piece, i) => (
            <li key={piece.src}>
              <Image
                src={piece.src}
                alt={piece.alt}
                width={piece.width}
                height={piece.height}
                sizes="(min-width: 1200px) 1200px, 100vw"
                className="h-auto w-full"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {piece.line && (
                <p className="mt-5 max-w-3xl text-lg italic text-ink-muted">
                  &ldquo;{piece.line}&rdquo;
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="text-label mt-20 border-t border-line pt-8 text-ink-faint">
          {pieces.length} {pieces.length === 1 ? "execution" : "executions"} ·{" "}
          {campaign.discipline}
        </p>
      </div>
    </div>
  );
}

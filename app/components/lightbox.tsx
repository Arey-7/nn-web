"use client";

import { useOverlay } from "../lib/use-overlay";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  client: string;
  src: string;
  poster: string;
};

export default function Lightbox({
  open,
  onClose,
  title,
  client,
  src,
  poster,
}: Props) {
  const container = useOverlay(open, onClose);

  if (!open) return null;

  return (
    <div
      ref={container}
      role="dialog"
      aria-modal="true"
      aria-label={`${client} — ${title}`}
      className="fixed inset-0 z-70 flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <div>
          <p className="text-label text-white/50">{client}</p>
          <p className="mt-1 text-lg text-white">{title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-white/25 p-3 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
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

      <div className="flex flex-1 items-center justify-center px-4 pb-10 md:px-10">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="max-h-full w-auto max-w-full border border-white/10 bg-black shadow-2xl"
        />
      </div>
    </div>
  );
}

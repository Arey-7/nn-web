"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CampaignGallery from "../components/campaign-gallery";
import { FEATURED, type Campaign } from "../content/work";

gsap.registerPlugin(ScrollTrigger);

const hero = (c: Campaign) => c.print![0];

// Pinning is only used on a wide viewport when motion is welcome. The same
// condition picks the layout, because the pinned view depends on the scrub to
// reach campaigns 2..6 — rendering it without the pin would strand the reader
// on the first one.
const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export default function FeaturedWork() {
  const root = useRef<HTMLDivElement>(null);
  const pinned = useRef<HTMLDivElement>(null);
  const [canPin, setCanPin] = useState(false);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState<Campaign | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => setCanPin(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!canPin) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${FEATURED.length * window.innerHeight}`,
        pin: pinned.current,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(
            FEATURED.length - 1,
            Math.floor(self.progress * FEATURED.length)
          );
          setIndex((prev) => (prev === next ? prev : next));
        },
      });
    }, root);
    return () => ctx.revert();
  }, [canPin]);

  return (
    <section aria-labelledby="work-heading" className="bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 pt-28 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-6">
          <h2 id="work-heading" className="text-label text-ink-faint">
            Selected work
          </h2>
          <p className="text-label text-ink-faint">
            {String(FEATURED.length).padStart(2, "0")} campaigns
          </p>
        </div>
      </div>

      {canPin ? (
        <div ref={root}>
          <div
            ref={pinned}
            className="flex min-h-svh items-center overflow-hidden"
          >
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-12 items-center gap-12 px-10">
              <div className="relative col-span-5">
                {FEATURED.map((c, i) => (
                  <div
                    key={c.slug}
                    aria-hidden={i !== index}
                    className={`transition-all duration-700 ease-out-expo ${
                      i === index
                        ? "relative opacity-100 blur-0"
                        : "pointer-events-none absolute inset-0 opacity-0 blur-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-label" style={{ color: c.accent }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-12 bg-line-strong" />
                      <span className="text-label text-ink-faint">
                        {c.discipline}
                        {c.year ? ` · ${c.year}` : ""}
                      </span>
                    </div>

                    <p className="mt-6 text-label text-ink-muted">{c.client}</p>

                    <blockquote className="mt-3 text-display text-[clamp(1.9rem,3.4vw,3.5rem)] text-ink">
                      {c.headline}
                    </blockquote>

                    <p className="mt-7 max-w-lg leading-relaxed text-ink-muted">
                      {c.blurb}
                    </p>

                    <button
                      type="button"
                      onClick={() => setOpened(c)}
                      tabIndex={i === index ? 0 : -1}
                      className="group mt-9 inline-flex items-center gap-3 text-label text-ink"
                    >
                      <span
                        className="h-px w-10 transition-all duration-500 ease-out-expo group-hover:w-16"
                        style={{ backgroundColor: c.accent }}
                      />
                      See all {c.print!.length} executions
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative col-span-7 aspect-4/3">
                {FEATURED.map((c, i) => {
                  const piece = hero(c);
                  return (
                    <div
                      key={c.slug}
                      aria-hidden={i !== index}
                      className="absolute inset-0 transition-[clip-path,opacity] duration-900 ease-in-out-quint"
                      style={{
                        clipPath:
                          i === index
                            ? "inset(0% 0% 0% 0%)"
                            : i < index
                              ? "inset(0% 0% 100% 0%)"
                              : "inset(100% 0% 0% 0%)",
                        opacity: i === index ? 1 : 0.4,
                      }}
                    >
                      <Image
                        src={piece.src}
                        alt={piece.alt}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="object-contain object-center"
                        priority={i === 0}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ul className="mx-auto max-w-[1600px] divide-y divide-line px-6 md:px-10">
          {FEATURED.map((c, i) => {
            const piece = hero(c);
            return (
              <li key={c.slug} className="py-14">
                <div className="flex items-center gap-4">
                  <span className="text-label" style={{ color: c.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-label text-ink-faint">
                    {c.discipline}
                    {c.year ? ` · ${c.year}` : ""}
                  </span>
                </div>

                <p className="mt-5 text-label text-ink-muted">{c.client}</p>
                <blockquote className="mt-3 text-display text-[clamp(1.75rem,7vw,3rem)]">
                  {c.headline}
                </blockquote>

                <button
                  type="button"
                  onClick={() => setOpened(c)}
                  className="mt-8 block w-full"
                  aria-label={`See all ${c.print!.length} executions of ${c.title}`}
                >
                  <Image
                    src={piece.thumb}
                    alt={piece.alt}
                    width={piece.width}
                    height={piece.height}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="h-auto w-full"
                  />
                </button>

                <p className="mt-6 leading-relaxed text-ink-muted">{c.blurb}</p>
              </li>
            );
          })}
        </ul>
      )}

      <CampaignGallery campaign={opened} onClose={() => setOpened(null)} />
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { RADIO, accentVars, type Campaign, type RadioPiece } from "../content/work";

type Spot = RadioPiece & { campaign: Campaign };

const SPOTS: Spot[] = RADIO.flatMap((c) =>
  (c.radio ?? []).map((spot) => ({ ...spot, campaign: c }))
);

const clock = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function RadioRoom() {
  const audio = useRef<HTMLAudioElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const context = useRef<AudioContext | null>(null);
  const frame = useRef<number>(0);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const active = SPOTS.find((s) => s.id === activeId) ?? null;

  // The graph is built once, on the first play, because createMediaElementSource
  // can only ever be called once for a given <audio> element.
  const ensureGraph = () => {
    if (context.current || !audio.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const source = ctx.createMediaElementSource(audio.current);
    const node = ctx.createAnalyser();
    node.fftSize = 2048;
    source.connect(node);
    node.connect(ctx.destination);
    context.current = ctx;
    analyser.current = node;
  };

  const draw = () => {
    const node = analyser.current;
    const el = canvas.current;
    if (!node || !el) return;

    const ctx2d = el.getContext("2d");
    if (!ctx2d) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = el.getBoundingClientRect();
    if (el.width !== width * dpr) {
      el.width = width * dpr;
      el.height = height * dpr;
    }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.clearRect(0, 0, width, height);

    const data = new Uint8Array(node.frequencyBinCount);
    node.getByteTimeDomainData(data);

    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#4a84d8";

    ctx2d.lineWidth = 1.5;
    ctx2d.strokeStyle = accent;
    ctx2d.beginPath();

    const step = width / data.length;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128 - 1;
      const y = height / 2 + v * (height / 2) * 0.9;
      i === 0 ? ctx2d.moveTo(0, y) : ctx2d.lineTo(i * step, y);
    }
    ctx2d.stroke();

    frame.current = requestAnimationFrame(draw);
  };

  const toggle = async (spot: Spot) => {
    const el = audio.current;
    if (!el) return;

    if (activeId === spot.id) {
      el.pause();
      setActiveId(null);
      return;
    }

    ensureGraph();
    await context.current?.resume();
    el.src = spot.audio;
    setActiveId(spot.id);
    try {
      await el.play();
    } catch {
      setActiveId(null);
    }
  };

  useEffect(() => {
    if (activeId) frame.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => () => void context.current?.close(), []);

  return (
    <section aria-labelledby="radio-heading" className="bg-paper py-28">
      <div className="mx-auto max-w-400 px-6 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-6">
          <h2 id="radio-heading" className="text-label text-ink-faint">
            Radio
          </h2>
          <p className="text-label text-ink-faint">
            {String(SPOTS.length).padStart(2, "0")} spots
          </p>
        </div>

        <div className="grid gap-14 pt-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="text-display text-[clamp(1.7rem,3.6vw,3.2rem)] text-ink">
              The medium with no pictures, where the writing has nowhere to
              hide.
            </p>

            <div className="relative mt-10 h-32 border-y border-line">
              <canvas
                ref={canvas}
                className="h-full w-full"
                aria-hidden="true"
              />
              {!active && (
                <p className="text-label absolute inset-0 grid place-items-center text-ink-faint">
                  Press play
                </p>
              )}
            </div>

            {active && (
              <div className="mt-4 flex items-center justify-between text-label text-ink-muted">
                <span>
                  {active.campaign.client} &mdash; {active.title}
                </span>
                <span className="tabular-nums">
                  {clock(progress)} / {clock(active.seconds)}
                </span>
              </div>
            )}
          </div>

          <ul className="divide-y divide-line lg:col-span-7">
            {SPOTS.map((spot) => {
              const isActive = spot.id === activeId;
              return (
                <li key={spot.id}>
                  <button
                    type="button"
                    onClick={() => toggle(spot)}
                    aria-pressed={isActive}
                    className="group flex w-full items-center gap-6 py-6 text-left"
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        isActive
                          ? "ca-text ca-border"
                          : "border-line-strong text-ink"
                      }`}
                      style={accentVars(spot.campaign)}
                    >
                      {isActive ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M7 5h4v14H7zM13 5h4v14h-4z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="text-label block text-ink-faint">
                        {spot.campaign.client}
                      </span>
                      <span className="mt-1 block truncate text-xl text-ink transition-colors group-hover:text-accent">
                        {spot.title}
                      </span>
                    </span>

                    <span className="text-label shrink-0 tabular-nums text-ink-faint">
                      {clock(spot.seconds)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <audio
        ref={audio}
        crossOrigin="anonymous"
        preload="none"
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onEnded={() => setActiveId(null)}
      />
    </section>
  );
}

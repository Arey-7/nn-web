"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { SITE } from "../content/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const overlay = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.to(overlay.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      }).from(
        ".nav-item",
        {
          yPercent: 120,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "expo.out",
        },
        "-=0.4"
      );
      timeline.current = tl;
    }, overlay);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open]);

  // Close on navigation, so the overlay never survives a route change.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open
            ? "border-b border-line bg-paper/80 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" aria-label={`${SITE.name} — home`} className="relative z-50">
            <Image
              src="/nn_logo.svg"
              alt={SITE.legalName}
              width={148}
              height={26}
              priority
              className="h-5.5 w-auto brightness-0 dark:invert"
            />
          </Link>

          <button
            type="button"
            className="menu-button relative z-50 text-ink"
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="hamburger"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 100 100"
              width="44"
              aria-hidden="true"
            >
              <path
                className="line"
                d="m 20 40 h 60 a 1 1 0 0 1 0 20 h -60 a 1 1 0 0 0 0 20 h 60 a 1 1 0 0 1 0 20 h -30 v -70"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </header>

      <div
        id="primary-navigation"
        ref={overlay}
        aria-hidden={!open}
        className="fixed inset-0 z-40 bg-paper-sunk [clip-path:inset(0%_0%_100%_0%)]"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div className="flex h-full flex-col justify-center px-6 md:px-10">
          <ul>
            {SITE.nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  className="nav-item group flex items-baseline gap-6 py-1 text-display text-[clamp(3rem,13vw,10rem)] text-ink transition-colors hover:text-accent"
                >
                  <span className="text-label text-ink-faint">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-item mt-16 flex flex-wrap gap-x-8 gap-y-2">
            {SITE.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="text-label text-ink-muted transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'button, [href], video, audio, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal plumbing: scroll lock, Escape to close, a tab loop inside the
 * dialog, and focus returned to whatever opened it.
 */
export function useOverlay(open: boolean, onClose: () => void) {
  const container = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement;
    container.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The first Escape out of a fullscreen video belongs to the browser. If the
    // dialog closed on that same keystroke, enlarging a film and pressing
    // Escape would drop the reader all the way back to the page when all they
    // asked for was the window back — so the dialog sits that one out, and a
    // second Escape closes it.
    //
    // Browsers disagree about whether the key even reaches the page and
    // whether fullscreen has already been left by the time it does, so rather
    // than depend on one ordering this watches both sides: the live flag
    // catches an Escape delivered before the exit, the timestamp catches one
    // delivered after.
    let inFullscreen = !!document.fullscreenElement;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const onFullscreen = () => {
      clearTimeout(settle);
      if (document.fullscreenElement) inFullscreen = true;
      // The flag is held a moment past the exit. The key that left fullscreen
      // can reach the page after the exit is already committed, and between
      // those two points document.fullscreenElement reads as null while the
      // reader is still, as far as they know, watching a full-screen film.
      else settle = setTimeout(() => (inFullscreen = false), 300);
    };
    document.addEventListener("fullscreenchange", onFullscreen);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (inFullscreen || document.fullscreenElement) return;
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = container.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes?.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Capture, so the fullscreen flag is read before the browser can clear it.
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("fullscreenchange", onFullscreen);
      clearTimeout(settle);
      document.body.style.overflow = previousOverflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  return container as RefObject<HTMLDivElement>;
}

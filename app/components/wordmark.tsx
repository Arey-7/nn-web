import { SITE } from "../content/site";

/**
 * The name, set rather than drawn. The old identity shipped as an Illustrator
 * SVG whose paths spelled the previous name, so it could not be renamed — and
 * it needed `brightness-0 dark:invert` to survive the theme. Type in the site's
 * own display face costs no request, scales cleanly and inherits the ink.
 *
 * It sets font-display rather than text-display: the latter carries -0.03em
 * tracking for headlines, wins the cascade against a tracking utility, and a
 * wordmark wants the opposite — letters opened up, not closed.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-semibold text-[0.95rem] uppercase leading-none tracking-[0.15em] ${className}`}
    >
      {SITE.name}
    </span>
  );
}

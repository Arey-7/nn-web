import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
};

/** Top of every inner page. The padding clears the fixed navbar. */
export default function PageHeader({ eyebrow, title, lede }: Props) {
  return (
    <header className="mx-auto max-w-400 px-6 pb-4 pt-36 md:px-10 md:pt-44">
      <p className="text-label text-ink-faint">{eyebrow}</p>
      <h1 className="mt-6 text-display text-[clamp(2.6rem,8vw,7rem)] text-ink">
        {title}
      </h1>
      {lede && (
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
          {lede}
        </p>
      )}
    </header>
  );
}

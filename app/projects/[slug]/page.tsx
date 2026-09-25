import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CAMPAIGNS, accentVars, bySlug } from "../../content/work";
import CampaignMedia from "./campaign-media";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const campaign = bySlug(slug);
  if (!campaign) return {};

  return {
    title: `${campaign.title} — ${campaign.client}`,
    description: campaign.blurb,
  };
}

export default async function CampaignPage({ params }: Params) {
  const { slug } = await params;
  const campaign = bySlug(slug);
  if (!campaign) notFound();

  const index = CAMPAIGNS.findIndex((c) => c.slug === campaign.slug);
  const next = CAMPAIGNS[(index + 1) % CAMPAIGNS.length];
  const print = campaign.print ?? [];

  return (
    <article className="pb-32">
      <header className="mx-auto max-w-400 px-6 pt-36 md:px-10 md:pt-44">
        <Link
          href="/projects"
          className="text-label text-ink-faint transition-colors hover:text-accent"
        >
          &larr; All work
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <span className="text-label ca-text" style={accentVars(campaign)}>
            {campaign.client}
          </span>
          <span className="h-px w-12 bg-line-strong" />
          <span className="text-label text-ink-faint">
            {campaign.discipline}
            {campaign.year ? ` · ${campaign.year}` : ""}
          </span>
        </div>

        <h1 className="mt-7 max-w-5xl text-display text-[clamp(2.2rem,6vw,5.5rem)] text-ink">
          {campaign.headline}
        </h1>

        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
          {campaign.blurb}
        </p>
      </header>

      <div className="mx-auto mt-20 max-w-400 px-6 md:px-10">
        {print.length > 0 && (
          <ul className="space-y-24">
            {print.map((piece, i) => (
              <li key={piece.src}>
                <figure>
                  <Image
                    src={piece.src}
                    alt={piece.alt}
                    width={piece.width}
                    height={piece.height}
                    sizes="(min-width: 1280px) 1100px, 100vw"
                    className="mx-auto h-auto w-full max-w-275"
                    priority={i === 0}
                  />
                  {piece.line && (
                    <figcaption className="mx-auto mt-6 max-w-275 text-lg italic text-ink-muted">
                      &ldquo;{piece.line}&rdquo;
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        )}

        <CampaignMedia campaign={campaign} />
      </div>

      <nav className="mx-auto mt-32 max-w-400 border-t border-line px-6 pt-10 md:px-10">
        <p className="text-label text-ink-faint">Next campaign</p>
        <Link href={`/projects/${next.slug}`} className="group mt-5 block">
          <p className="text-label text-ink-muted">{next.client}</p>
          <p className="mt-2 text-display text-[clamp(1.9rem,5vw,4rem)] text-ink transition-colors group-hover:text-accent">
            {next.title}
            <span className="ml-4 inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-4">
              &rarr;
            </span>
          </p>
        </Link>
      </nav>
    </article>
  );
}

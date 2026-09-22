import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/page-header";
import { CAMPAIGNS, CLIENTS } from "../content/work";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reef Rooster is an advertising agency in Nairobi working across press, film and radio for brands and for causes.",
};

const DISCIPLINES = Array.from(new Set(CAMPAIGNS.map((c) => c.discipline)));

const BELIEFS = [
  {
    title: "The page is an argument",
    body: "Most of this work is long copy, which is unfashionable and still the most honest thing we do. If a claim cannot survive four hundred words, it probably could not survive four.",
  },
  {
    title: "Name the thing",
    body: "Poaching is foreign. The tax man cometh. Mental case, judge-mental. The strongest lines we have written were not clever — they were exact, and they left the reader nowhere to stand.",
  },
  {
    title: "Causes pay differently",
    body: "Conservation, human rights, mental health and public health run through this portfolio next to banks and cars. We have never run two standards of craft for the two kinds of client.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-32">
      <PageHeader
        eyebrow="About"
        title={
          <>
            We link brands
            <br />
            and <span className="italic text-accent">causes</span>
            <br />
            to the people.
          </>
        }
        lede="Reef Rooster is an advertising agency in Nairobi. We write press, film and radio for organisations that have something worth saying and a reason for saying it now."
      />

      <section className="mx-auto mt-24 max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-x-8 gap-y-14 border-t border-line pt-14 md:grid-cols-3">
          {BELIEFS.map((belief, i) => (
            <div key={belief.title}>
              <span className="text-label text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-5 text-display text-[clamp(1.5rem,2.4vw,2.2rem)] text-ink">
                {belief.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {belief.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="disciplines"
        className="mx-auto mt-28 max-w-[1600px] px-6 md:px-10"
      >
        <h2 id="disciplines" className="text-label text-ink-faint">
          What we work on
        </h2>
        <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-8">
          {DISCIPLINES.map((d) => (
            <li
              key={d}
              className="text-display text-[clamp(1.4rem,3.2vw,2.6rem)] text-ink-muted"
            >
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="clients"
        className="mx-auto mt-28 max-w-[1600px] px-6 md:px-10"
      >
        <h2 id="clients" className="text-label text-ink-faint">
          Clients
        </h2>
        <ul className="mt-8 grid gap-y-4 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((client) => (
            <li key={client} className="text-lg text-ink-muted">
              {client}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-28 max-w-[1600px] px-6 md:px-10">
        <Link
          href="/projects"
          className="group inline-flex items-baseline gap-5 text-display text-[clamp(1.9rem,5vw,4rem)] text-ink"
        >
          See the work
          <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-4">
            &rarr;
          </span>
        </Link>
      </section>
    </div>
  );
}

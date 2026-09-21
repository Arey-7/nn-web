import type { Metadata } from "next";
import PageHeader from "../components/page-header";
import { SITE } from "../content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Noah's Navy about press, film and radio work.",
};

const REASONS = [
  "A brief you already have",
  "A cause that needs a voice",
  "Press, film or radio",
  "Something we have not thought of",
];

export default function ContactsPage() {
  return (
    <div className="pb-32">
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us what
            <br />
            you are <span className="italic text-accent">up against</span>.
          </>
        }
        lede="The useful first conversation is rarely about us. Send the problem, the deadline and the budget you actually have, and we will tell you honestly whether we are the right people."
      />

      <div className="mx-auto mt-20 grid max-w-[1600px] gap-16 px-6 md:px-10 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <h2 className="text-label text-ink-faint">Write to us</h2>
          <a
            href={`mailto:${SITE.email}`}
            className="group mt-6 block text-display text-[clamp(1.6rem,4.4vw,3.4rem)] break-words text-ink transition-colors hover:text-accent"
          >
            {SITE.email}
            <span className="ml-4 inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
              &rarr;
            </span>
          </a>

          <h2 className="text-label mt-16 text-ink-faint">Call</h2>
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="mt-5 block text-2xl text-ink transition-colors hover:text-accent"
          >
            {SITE.phone}
          </a>

          <h2 className="text-label mt-16 text-ink-faint">Studio</h2>
          <address className="mt-5 text-2xl not-italic text-ink-muted">
            {SITE.address}
          </address>
        </section>

        <aside className="lg:col-span-5">
          <h2 className="text-label text-ink-faint">Good reasons to write</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {REASONS.map((reason) => (
              <li key={reason} className="py-5 text-lg text-ink-muted">
                {reason}
              </li>
            ))}
          </ul>

          <h2 className="text-label mt-16 text-ink-faint">Elsewhere</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {SITE.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-ink transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

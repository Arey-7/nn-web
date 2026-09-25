import { SITE } from "../content/site";
import { CURRENCY, money, quotedLines, type Quote } from "./pricing";

export type Job = {
  client: string;
  reference: string;
  description: string;
  issuedOn: string;
};

/**
 * The half of this page a client may see, and the only part that prints.
 *
 * It is deliberately given the quote object rather than the inputs: cost,
 * profit and margin are the agency's business and must never reach
 * this component's markup, because `@media print` shows exactly what is
 * inside `.quote-doc` and nothing else.
 */
export default function QuoteDocument({
  job,
  quote,
  work,
  itemised,
}: {
  job: Job;
  quote: Quote;
  /** The kind of work quoted for, so the client can see what this is about. */
  work: string;
  /** Whether the client sees the quotation broken into its parts. */
  itemised: boolean;
}) {
  // Priced lines, never the cost lines: see quotedLines().
  const lines = itemised ? quotedLines(quote) : [];

  return (
    <article className="quote-doc border border-line bg-paper-raised p-8 md:p-10">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-[0.15em] text-ink">
            {SITE.name}
          </p>
          <p className="mt-1.5 text-sm text-ink-faint">{SITE.address}</p>
        </div>
        <p className="text-label text-ink-faint">Quotation</p>
      </header>

      <dl className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {(
          [
            ["Prepared for", job.client],
            ["Reference", job.reference],
            ["Date", job.issuedOn],
            ["Work", work],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <dt className="text-label text-ink-faint">{label}</dt>
            <dd className="mt-1.5 text-ink">{value || "—"}</dd>
          </div>
        ))}
      </dl>

      {job.description && (
        <p className="mt-7 max-w-prose leading-relaxed text-ink-muted">
          {job.description}
        </p>
      )}

      <dl className="mt-9 border-t border-line">
        {lines.map((line) => (
          <div
            key={line.label}
            className="flex items-baseline justify-between gap-6 border-b border-line py-3"
          >
            <dt className="text-ink-muted">{line.label}</dt>
            <dd className="tabular-nums text-ink-muted">
              {CURRENCY} {money(line.amount)}
            </dd>
          </div>
        ))}

        <div className="flex items-baseline justify-between gap-6 border-b border-line py-4">
          <dt className={lines.length ? "text-ink" : "text-ink-muted"}>
            {lines.length ? "Quotation, total" : "Quotation"}
          </dt>
          <dd className="tabular-nums text-ink">
            {CURRENCY} {money(quote.quote)}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-6 border-b border-line py-4">
          <dt className="text-ink-muted">VAT at 16%</dt>
          <dd className="tabular-nums text-ink">
            {CURRENCY} {money(quote.vat)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-6 py-5">
          <dt className="text-label text-ink">Total payable</dt>
          <dd className="text-display whitespace-nowrap text-2xl tabular-nums text-accent sm:text-3xl">
            {CURRENCY} {money(quote.payable)}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-ink-faint">
        Prepared by {SITE.legalName}.
      </p>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../components/page-header";
import Gate from "../gate";
import { hasSession, isConfigured } from "../session";
import { CURRENCY, money } from "../pricing";
import { ledgerConfigured } from "./db";
import LedgerRows from "./ledger-rows";
import { listEntries, totals } from "./store";

export const metadata: Metadata = {
  title: "Quote ledger",
  description: "Internal tool.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LedgerPage() {
  // The same gate as the calculator. A sub-route does not inherit protection
  // from its parent, so it asks for itself.
  if (!(await hasSession())) {
    return (
      <div className="pb-32">
        <Gate configured={isConfigured()} />
      </div>
    );
  }

  if (!ledgerConfigured()) {
    return (
      <div className="pb-32">
        <PageHeader eyebrow="Internal tool" title="Quote ledger" lede="" />
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <p className="max-w-lg border border-line px-5 py-4 text-sm text-ink-muted">
            No ledger database is configured. Set{" "}
            <code className="text-ink">DATABASE_URL</code> in the environment
            and restart. The calculator works without it; it just cannot save.
          </p>
        </div>
      </div>
    );
  }

  const [entries, sum] = await Promise.all([listEntries(), totals()]);

  return (
    <div className="pb-32">
      <PageHeader
        eyebrow="Internal tool"
        title="Quote ledger"
        lede="Every quote saved from the calculator, newest first. The figures are the ones quoted at the time, kept with the rules that produced them."
      />

      <div className="mx-auto mt-14 max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-6">
          <p className="text-label text-ink-faint">
            {sum.count} {sum.count === 1 ? "quote" : "quotes"}
          </p>
          <p className="text-label text-ink-faint">
            {CURRENCY} {money(sum.payable)} quoted in total
          </p>
          <Link
            href="/quote-calculator"
            className="text-label text-ink transition-colors hover:text-accent"
          >
            Back to the calculator
          </Link>
        </div>

        <div className="mt-10">
          {entries.length === 0 ? (
            <p className="text-ink-muted">
              Nothing saved yet. Price a job and save it from the calculator.
            </p>
          ) : (
            <LedgerRows entries={entries} />
          )}
        </div>
      </div>
    </div>
  );
}

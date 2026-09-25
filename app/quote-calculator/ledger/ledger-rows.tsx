"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CURRENCY, money } from "../pricing";
import { removeQuote } from "./actions";
import type { LedgerEntry } from "./store";

const STORE = "rr-quote";

const WORK: Record<string, string> = {
  print: "Print",
  film: "Film",
  radio: "Radio",
  creative: "Creative",
};

export default function LedgerRows({ entries }: { entries: LedgerEntry[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState<string | null>(null);

  /**
   * Reopening writes the entry into the same browser storage the calculator
   * already restores from, then navigates. No second loading path to keep in
   * step with the first.
   */
  const reopen = (entry: LedgerEntry) => {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({
          raw: entry.inputs,
          jobId: entry.jobType,
          itemised: entry.itemised,
          job: {
            client: entry.client,
            reference: entry.reference,
            description: entry.description,
            issuedOn: entry.issuedOn ?? "",
          },
        })
      );
    } catch {
      /* storage unavailable — the navigation below still works, unfilled */
    }
    router.push("/quote-calculator");
  };

  return (
    <ul className="divide-y divide-line border-y border-line">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="grid gap-4 py-5 sm:grid-cols-12 sm:items-baseline"
        >
          <div className="sm:col-span-2">
            <p className="text-label text-ink-faint">
              {entry.createdAt.slice(0, 10)}
            </p>
            <p className="mt-1 text-sm text-ink-faint">
              {WORK[entry.jobType] ?? entry.jobType}
            </p>
          </div>

          <div className="min-w-0 sm:col-span-4">
            <p className="truncate text-lg text-ink">{entry.client || "—"}</p>
            <p className="mt-1 truncate text-sm text-ink-faint">
              {entry.reference || "no reference"}
            </p>
          </div>

          <div className="sm:col-span-3 sm:text-right">
            <p className="text-lg tabular-nums text-ink">
              {CURRENCY} {money(entry.payable)}
            </p>
            <p className="mt-1 text-sm text-ink-faint tabular-nums">
              {money(entry.quoteAmount)} + VAT
            </p>
          </div>

          <div className="flex gap-4 sm:col-span-3 sm:justify-end">
            <button
              type="button"
              onClick={() => reopen(entry)}
              className="text-label text-ink transition-colors hover:text-accent"
            >
              Open
            </button>

            {confirming === entry.id ? (
              <span className="flex gap-3">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      await removeQuote(entry.id);
                      setConfirming(null);
                      router.refresh();
                    })
                  }
                  className="text-label text-red-500 disabled:opacity-50"
                >
                  {pending ? "Deleting" : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="text-label text-ink-faint hover:text-ink"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(entry.id)}
                className="text-label text-ink-faint transition-colors hover:text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

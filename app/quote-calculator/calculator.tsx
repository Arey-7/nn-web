"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SITE } from "../content/site";
import { saveQuote } from "./ledger/actions";
import QuoteDocument, { type Job } from "./quote-document";
import {
  CURRENCY,
  JOB_TYPES,
  MARGIN,
  ROUND_TO,
  fieldsOf,
  jobById,
  money,
  parseValues,
  priceJob,
  quotedLines,
  valueKey,
  type FieldSpec,
  type JobType,
} from "./pricing";

const STORE = "rr-quote";

type Raw = Record<string, string>;

/**
 * Inputs are held as the raw strings the fields contain and parsed only to
 * compute. Keeping numbers in state was what broke the tool this replaced:
 * clearing a field left an empty string behind, and one `number + ""` turned
 * the running total into a string that quietly lost its separators.
 *
 * Keys are namespaced by job type, so pricing a film job and then going back
 * to a print one finds the print figures still there.
 */
const blankRaw = (): Raw => {
  const out: Raw = {};
  for (const job of JOB_TYPES) {
    for (const field of fieldsOf(job)) {
      out[valueKey(job.id, field.key)] = field.default
        ? String(field.default)
        : "";
    }
  }
  return out;
};

/** Local calendar date, not UTC — a Nairobi evening is already tomorrow in UTC. */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const blankJob = (): Job => ({
  client: "",
  reference: "",
  description: "",
  issuedOn: "",
});

function NumberField({
  id,
  field,
  value,
  invalid,
  onChange,
}: {
  id: string;
  field: FieldSpec;
  value: string;
  invalid: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-label block text-ink-muted">
        {field.label}
      </label>
      <input
        id={id}
        name={id}
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        placeholder="0"
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "negative-note" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-3 w-full border-b bg-transparent pb-2 text-2xl text-ink tabular-nums transition-colors focus:outline-none ${
          invalid
            ? "border-red-500 focus:border-red-500"
            : "border-line-strong focus:border-accent"
        }`}
      />
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  area = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  area?: boolean;
}) {
  const shared =
    "mt-3 w-full border-b border-line-strong bg-transparent pb-2 text-lg text-ink transition-colors focus:border-accent focus:outline-none";
  return (
    <div>
      <label htmlFor={id} className="text-label block text-ink-muted">
        {label}
      </label>
      {area ? (
        <textarea
          id={id}
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
        />
      )}
    </div>
  );
}

function Group({
  title,
  note,
  jobId,
  fields,
  raw,
  negatives,
  set,
}: {
  title: string;
  note: string;
  jobId: string;
  fields: FieldSpec[];
  raw: Raw;
  negatives: Set<string>;
  set: (key: string, v: string) => void;
}) {
  if (fields.length === 0) return null;
  return (
    <fieldset className="mt-12">
      <legend className="text-label text-ink-faint">{title}</legend>
      <p className="mb-8 mt-2 text-sm text-ink-faint">{note}</p>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {fields.map((f) => {
          const key = valueKey(jobId, f.key);
          return (
            <NumberField
              key={key}
              id={key}
              field={f}
              value={raw[key] ?? ""}
              invalid={negatives.has(key)}
              onChange={(v) => set(key, v)}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Calculator() {
  const [jobId, setJobId] = useState(JOB_TYPES[0].id);
  const [raw, setRaw] = useState<Raw>(blankRaw);
  const [job, setJob] = useState<Job>(blankJob);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  // On by default: the clients in this portfolio are largely public sector,
  // where an itemised quotation is usually what procurement needs to approve
  // the spend at all. The figures shown are prices, so nothing is given away.
  const [itemised, setItemised] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const type: JobType = jobById(jobId);

  // Restored after mount, never during render: reading storage while rendering
  // would make the server and client trees disagree.
  useEffect(() => {
    let saved: {
      raw?: Raw;
      job?: Partial<Job>;
      jobId?: string;
      itemised?: boolean;
    } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORE) || "null");
    } catch {
      saved = null;
    }
    // Merged onto a blank set rather than used as-is, so a draft saved before a
    // job type gained a field still opens.
    if (saved?.raw) setRaw((r) => ({ ...r, ...saved.raw }));
    if (saved?.jobId && JOB_TYPES.some((j) => j.id === saved.jobId)) {
      setJobId(saved.jobId);
    }
    if (typeof saved?.itemised === "boolean") setItemised(saved.itemised);
    setJob((j) => ({
      ...j,
      ...(saved?.job ?? {}),
      issuedOn: saved?.job?.issuedOn || today(),
    }));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ raw, job, jobId, itemised }));
    } catch {
      /* private browsing, a full quota — the tool works, it just forgets */
    }
  }, [ready, raw, job, jobId, itemised]);

  const fields = useMemo(() => fieldsOf(type), [type]);

  const negatives = useMemo(
    () =>
      new Set(
        fields
          .map((f) => valueKey(type.id, f.key))
          .filter((k) => parseFloat(raw[k]) < 0)
      ),
    [fields, type.id, raw]
  );

  const values = useMemo(() => parseValues(type, raw), [type, raw]);

  const q = useMemo(() => priceJob(type, values), [type, values]);

  const set = (key: string, v: string) => setRaw((r) => ({ ...r, [key]: v }));

  const reset = () => {
    setRaw(blankRaw());
    setJob({ ...blankJob(), issuedOn: today() });
  };

  const asText = () =>
    [
      `${SITE.name} — Quotation`,
      "",
      `Prepared for: ${job.client || "—"}`,
      `Reference:    ${job.reference || "—"}`,
      `Date:         ${job.issuedOn || "—"}`,
      `Work:         ${type.label}`,
      ...(job.description ? ["", job.description] : []),
      "",
      ...(itemised
        ? quotedLines(q).map(
            (l) => `${l.label.padEnd(30)} ${CURRENCY} ${money(l.amount)}`
          )
        : []),
      `Quotation:     ${CURRENCY} ${money(q.quote)}`,
      `VAT at 16%:    ${CURRENCY} ${money(q.vat)}`,
      `Total payable: ${CURRENCY} ${money(q.payable)}`,
      "",
      `Prepared by ${SITE.legalName}.`,
    ].join("\n");

  const save = async () => {
    setSaving(true);
    setSaved(null);
    // Only this job's fields go into the record. A saved print quote carrying
    // whatever happened to be typed in the film tab is not a record of
    // anything.
    const prefix = `${type.id}-`;
    const inputs = Object.fromEntries(
      Object.entries(raw).filter(([k]) => k.startsWith(prefix))
    );
    const result = await saveQuote({
      jobType: type.id,
      client: job.client,
      reference: job.reference,
      description: job.description,
      issuedOn: job.issuedOn,
      itemised,
      inputs,
    });
    setSaving(false);
    setSaved(result.ok ? "Saved to the ledger" : result.error);
    setTimeout(() => setSaved(null), 4000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const internal: [string, string][] = [
    ["Total cost", `${CURRENCY} ${money(q.total)}`],
    ["Profit", `${CURRENCY} ${money(q.profit)}`],
    ["Margin", q.marginPct === null ? "—" : `${q.marginPct.toFixed(2)}%`],
  ];

  return (
    <div className="mx-auto mt-14 grid max-w-[1600px] gap-14 px-6 md:px-10 lg:grid-cols-12">
      <div className="no-print lg:col-span-7">
        <div>
          <p className="text-label text-ink-faint">Kind of work</p>
          <div
            role="tablist"
            aria-label="Kind of work"
            className="mt-5 flex flex-wrap gap-2"
          >
            {JOB_TYPES.map((t) => {
              const on = t.id === type.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setJobId(t.id)}
                  className={`border px-4 py-2.5 text-label transition-colors ${
                    on
                      ? "border-accent text-accent"
                      : "border-line-strong text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-ink-faint">{type.note}</p>
        </div>

        <form className="mt-12" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend className="text-label text-ink-faint">The job</legend>
            <p className="mb-8 mt-2 text-sm text-ink-faint">
              Appears on the quote the client sees.
            </p>
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <TextField
                id="client"
                label="Client"
                value={job.client}
                onChange={(v) => setJob((j) => ({ ...j, client: v }))}
              />
              <TextField
                id="reference"
                label="Reference"
                value={job.reference}
                onChange={(v) => setJob((j) => ({ ...j, reference: v }))}
              />
              <TextField
                id="issuedOn"
                label="Date"
                type="date"
                value={job.issuedOn}
                onChange={(v) => setJob((j) => ({ ...j, issuedOn: v }))}
              />
              <div className="sm:col-span-2">
                <TextField
                  id="description"
                  label="Description"
                  area
                  value={job.description}
                  onChange={(v) => setJob((j) => ({ ...j, description: v }))}
                />
              </div>
            </div>
          </fieldset>

          <Group
            title="Quantities"
            note="How many of each."
            jobId={type.id}
            fields={type.quantities}
            raw={raw}
            negatives={negatives}
            set={set}
          />
          <Group
            title="Unit costs"
            note="What one of each costs. Multiplied by the quantities above."
            jobId={type.id}
            fields={type.units}
            raw={raw}
            negatives={negatives}
            set={set}
          />
          <Group
            title="Flat costs"
            note="Charged once, whatever the quantities."
            jobId={type.id}
            fields={type.flats}
            raw={raw}
            negatives={negatives}
            set={set}
          />

          {negatives.size > 0 && (
            <p id="negative-note" className="mt-8 text-sm text-red-500">
              A cost cannot be negative. The highlighted fields are being
              counted as zero.
            </p>
          )}
        </form>

        <section
          aria-labelledby="internal-heading"
          className="no-print mt-12 border-t border-line pt-8"
        >
          <h2 id="internal-heading" className="text-label text-ink-faint">
            Internal working
          </h2>
          <p className="mt-2 text-sm text-ink-faint">
            Not shown on the quote, and not printed.
          </p>

          <dl className="mt-7 divide-y divide-line border-y border-line">
            {q.lines.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-6 py-3.5"
              >
                <dt className="text-ink-muted">
                  {line.label}{" "}
                  <span className="ml-1 text-sm text-ink-faint tabular-nums">
                    {line.detail}
                  </span>
                </dt>
                <dd className="tabular-nums text-ink">{money(line.amount)}</dd>
              </div>
            ))}
          </dl>

          <dl className="mt-7 divide-y divide-line border-y border-line">
            {internal.map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <dt className="text-label text-ink-muted">{label}</dt>
                <dd className="text-xl tabular-nums text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-ink-faint">
            Cost plus {Math.round(MARGIN * 100)}%, rounded up to the nearest{" "}
            {ROUND_TO}.
          </p>
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="quote-sticky lg:sticky lg:top-24">
          <p className="sr-only" aria-live="polite">
            {type.label}. Total payable {CURRENCY} {money(q.payable)}
          </p>

          <QuoteDocument
            job={job}
            quote={q}
            work={type.label}
            itemised={itemised}
          />

          <label className="no-print mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={itemised}
              onChange={(e) => setItemised(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span className="text-sm text-ink-muted">
              Break the quotation into line items.{" "}
              <span className="text-ink-faint">
                Shows what each part is being charged at, never what it costs
                us.
              </span>
            </span>
          </label>

          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copy}
              className="border border-line-strong px-5 py-3 text-label text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {copied ? "Copied" : "Copy quote"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-line-strong px-5 py-3 text-label text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Print / save PDF
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="border border-line-strong px-5 py-3 text-label text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {saving ? "Saving" : "Save to ledger"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-5 py-3 text-label text-ink-faint transition-colors hover:text-ink"
            >
              Reset
            </button>
          </div>

          {saved && (
            <p role="status" className="no-print mt-4 text-sm text-ink-muted">
              {saved}
            </p>
          )}

          <p className="no-print mt-6 text-sm">
            <Link
              href="/quote-calculator/ledger"
              className="text-label text-ink-faint transition-colors hover:text-ink"
            >
              Open the ledger
            </Link>
          </p>
        </div>
      </aside>
    </div>
  );
}

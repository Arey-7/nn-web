"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE } from "../content/site";
import QuoteDocument, { type Job } from "./quote-document";
import {
  ALL_FIELDS,
  CURRENCY,
  EMPTY,
  FLAT_FIELDS,
  MARGIN,
  QUANTITY_FIELDS,
  ROUND_TO,
  UNIT_FIELDS,
  money,
  priceJob,
  type FieldSpec,
  type Inputs,
} from "./pricing";

const STORE = "rr-quote";

type Raw = Record<keyof Inputs, string>;

/** Inputs are held as the raw strings the fields contain, and parsed only to
 *  compute. Keeping numbers in state was what broke the old tool: clearing a
 *  field left an empty string behind, and one `number + ""` turned the running
 *  total into a string that quietly lost its thousands separators. */
const blankRaw = (): Raw =>
  Object.fromEntries(
    ALL_FIELDS.map((f) => [f.name, EMPTY[f.name] ? String(EMPTY[f.name]) : ""]),
  ) as Raw;

/** Local calendar date, not UTC — a Nairobi evening is already tomorrow in UTC. */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const blankJob = (): Job => ({
  client: "",
  reference: "",
  description: "",
  issuedOn: "",
});

function NumberField({
  field,
  value,
  invalid,
  onChange,
}: {
  field: FieldSpec;
  value: string;
  invalid: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={field.name} className="text-label block text-ink-muted">
        {field.label}
      </label>
      <input
        id={field.name}
        name={field.name}
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
  fields,
  raw,
  negatives,
  set,
}: {
  title: string;
  note: string;
  fields: FieldSpec[];
  raw: Raw;
  negatives: Set<string>;
  set: (name: keyof Inputs, v: string) => void;
}) {
  return (
    <fieldset className="mt-12 first:mt-0">
      <legend className="text-label text-ink-faint">{title}</legend>
      <p className="mb-8 mt-2 text-sm text-ink-faint">{note}</p>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {fields.map((f) => (
          <NumberField
            key={f.name}
            field={f}
            value={raw[f.name]}
            invalid={negatives.has(f.name)}
            onChange={(v) => set(f.name, v)}
          />
        ))}
      </div>
    </fieldset>
  );
}

export default function Calculator() {
  const [raw, setRaw] = useState<Raw>(blankRaw);
  const [job, setJob] = useState<Job>(blankJob);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restored after mount, never during render: reading storage while rendering
  // would make the server and client trees disagree.
  useEffect(() => {
    let saved: { raw?: Partial<Raw>; job?: Partial<Job> } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORE) || "null");
    } catch {
      saved = null;
    }
    if (saved?.raw) setRaw((r) => ({ ...r, ...saved.raw }));
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
      localStorage.setItem(STORE, JSON.stringify({ raw, job }));
    } catch {
      /* private browsing, a full quota — the tool still works, it just forgets */
    }
  }, [ready, raw, job]);

  const negatives = useMemo(
    () =>
      new Set(
        ALL_FIELDS.filter((f) => parseFloat(raw[f.name]) < 0).map(
          (f) => f.name,
        ),
      ),
    [raw],
  );

  const values = useMemo(() => {
    const out = { ...EMPTY };
    for (const f of ALL_FIELDS) {
      const n = parseFloat(raw[f.name]);
      out[f.name] = Number.isFinite(n) ? Math.max(0, n) : 0;
    }
    return out;
  }, [raw]);

  const q = useMemo(() => priceJob(values), [values]);

  const set = (name: keyof Inputs, v: string) =>
    setRaw((r) => ({ ...r, [name]: v }));

  const reset = () => {
    setRaw(blankRaw());
    // No need to clear storage: the save effect writes the blank state back
    // on the very next render, which is the same outcome with one less way to
    // get out of step.
    setJob({ ...blankJob(), issuedOn: today() });
  };

  const asText = () =>
    [
      `${SITE.name} — Quotation`,
      "",
      `Prepared for: ${job.client || "—"}`,
      `Reference:    ${job.reference || "—"}`,
      `Date:         ${job.issuedOn || "—"}`,
      // Spread rather than filtered, so the blank lines that separate the
      // sections survive and only the description drops out when unset.
      ...(job.description ? ["", job.description] : []),
      "",
      `Quotation:     ${CURRENCY} ${money(q.quote)}`,
      `VAT at 16%:    ${CURRENCY} ${money(q.vat)}`,
      `Total payable: ${CURRENCY} ${money(q.payable)}`,
      "",
      `Prepared by ${SITE.legalName}.`,
    ].join("\n");

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
    ["Tithe at 12%", `${CURRENCY} ${money(q.tithe)}`],
  ];

  return (
    <div className="mx-auto mt-14 grid max-w-[1600px] gap-14 px-6 md:px-10 lg:grid-cols-12">
      <div className="no-print lg:col-span-7">
        <form onSubmit={(e) => e.preventDefault()}>
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
            note="How many of each. Printing defaults to a single run."
            fields={QUANTITY_FIELDS}
            raw={raw}
            negatives={negatives}
            set={set}
          />
          <Group
            title="Unit costs"
            note="What one of each costs. Multiplied by the quantities above."
            fields={UNIT_FIELDS}
            raw={raw}
            negatives={negatives}
            set={set}
          />
          <Group
            title="Flat costs"
            note="Charged once, whatever the quantities."
            fields={FLAT_FIELDS}
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
            Not shown on the quote above, and not printed.
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
            Total payable {CURRENCY} {money(q.payable)}
          </p>

          <QuoteDocument job={job} quote={q} />

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
              onClick={reset}
              className="px-5 py-3 text-label text-ink-faint transition-colors hover:text-ink"
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

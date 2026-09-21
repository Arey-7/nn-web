"use client";

import { useFormik } from "formik";
import PageHeader from "../components/page-header";

const FIELDS = [
  { name: "reamCost", label: "Cost of a ream of paper" },
  { name: "reamNum", label: "Number of reams" },
  { name: "transport", label: "Transport" },
  { name: "filmCost", label: "Cost of film" },
  { name: "plateCost", label: "Cost of a plate" },
  { name: "plateNum", label: "Number of plates" },
  { name: "printCost", label: "Printing" },
  { name: "trimCost", label: "Trimming / cutting" },
  { name: "packCost", label: "Packing" },
  { name: "misc", label: "Miscellaneous" },
] as const;

const money = (n: number) =>
  n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

export default function QuoteCalculator() {
  const formik = useFormik({
    initialValues: {
      reamCost: 0,
      reamNum: 0,
      transport: 0,
      filmCost: 0,
      plateCost: 0,
      plateNum: 0,
      printCost: 0,
      trimCost: 0,
      packCost: 0,
      misc: 0,
    },
    onSubmit: () => {},
  });

  const total =
    formik.values.reamCost * formik.values.reamNum +
    formik.values.transport * 1 +
    formik.values.filmCost * formik.values.plateNum +
    formik.values.plateCost * formik.values.plateNum +
    formik.values.printCost * 2 +
    formik.values.trimCost * 1 +
    formik.values.packCost * formik.values.reamNum +
    formik.values.misc;

  const quote = Math.ceil((total * 1.35) / 200) * 200;
  const tax = Math.round(0.16 * quote);
  const profit = quote - total;
  const percProf = (Math.round((profit / total) * 10000) / 100).toFixed(2);

  const results = [
    { label: "Total cost", value: money(total) },
    { label: "Amount to be quoted", value: money(quote), lead: true },
    { label: "16% VAT", value: money(tax) },
    { label: "Profit", value: money(profit) },
    // total starts at 0, so the percentage is NaN until something is entered.
    { label: "Percentage profit", value: total > 0 ? `${percProf}%` : "—" },
    { label: "Tithe", value: money(0.12 * profit) },
  ];

  return (
    <div className="pb-32">
      <PageHeader
        eyebrow="Internal tool"
        title="Print quote calculator"
        lede="Working costs for a print job, with the standard 35% margin rounded up to the nearest 200. Figures update as you type."
      />

      <div className="mx-auto mt-14 grid max-w-[1600px] gap-12 px-6 md:px-10 lg:grid-cols-12">
        <form className="lg:col-span-7" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <legend className="text-label mb-7 text-ink-faint">Inputs</legend>
            {FIELDS.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="text-label block text-ink-muted"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="0"
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                  className="mt-3 w-full border-b border-line-strong bg-transparent pb-2 text-2xl text-ink tabular-nums transition-colors focus:border-accent focus:outline-none"
                />
              </div>
            ))}
          </fieldset>
        </form>

        <aside className="lg:col-span-5">
          <h2 className="text-label text-ink-faint">Result</h2>
          <dl
            aria-live="polite"
            className="mt-7 divide-y divide-line border-y border-line"
          >
            {results.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-6 py-5"
              >
                <dt className="text-label text-ink-muted">{row.label}</dt>
                <dd
                  className={`tabular-nums ${
                    row.lead
                      ? "text-display text-3xl text-accent"
                      : "text-xl text-ink"
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}

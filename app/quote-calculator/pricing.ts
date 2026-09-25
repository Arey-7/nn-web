/**
 * Costing rules for a print job.
 *
 * The previous version of this tool hid two multipliers in the total: printing
 * was always charged twice, and the cost of film was multiplied by the number
 * of *plates* because there was no field for a number of films. Neither was
 * written down anywhere. Both are now ordinary inputs, so a quantity that is
 * wrong is visibly wrong rather than silently baked in.
 *
 * MARGIN, ROUND_TO, VAT_RATE and TITHE_RATE carry over from the original
 * unchanged.
 */

/** Markup applied to cost to reach the quoted price. */
export const MARGIN = 0.35;
/** The quote is rounded up to a whole multiple of this. */
export const ROUND_TO = 200;
export const VAT_RATE = 0.16;
export const TITHE_RATE = 0.12;

export const CURRENCY = "KSh";

export type Inputs = {
  reams: number;
  films: number;
  plates: number;
  runs: number;
  paperPerReam: number;
  filmEach: number;
  plateEach: number;
  printPerRun: number;
  packPerReam: number;
  transport: number;
  trimming: number;
  misc: number;
};

export type FieldSpec = { name: keyof Inputs; label: string };

export const QUANTITY_FIELDS: FieldSpec[] = [
  { name: "reams", label: "Reams of paper" },
  { name: "films", label: "Films" },
  { name: "plates", label: "Plates" },
  { name: "runs", label: "Print runs" },
];

export const UNIT_FIELDS: FieldSpec[] = [
  { name: "paperPerReam", label: "Paper, per ream" },
  { name: "filmEach", label: "Film, each" },
  { name: "plateEach", label: "Plate, each" },
  { name: "printPerRun", label: "Printing, per run" },
  { name: "packPerReam", label: "Packing, per ream" },
];

export const FLAT_FIELDS: FieldSpec[] = [
  { name: "transport", label: "Transport" },
  { name: "trimming", label: "Trimming / cutting" },
  { name: "misc", label: "Miscellaneous" },
];

export const ALL_FIELDS = [...QUANTITY_FIELDS, ...UNIT_FIELDS, ...FLAT_FIELDS];

/** Print runs start at one; every other input starts empty. */
export const EMPTY: Inputs = {
  reams: 0,
  films: 0,
  plates: 0,
  runs: 1,
  paperPerReam: 0,
  filmEach: 0,
  plateEach: 0,
  printPerRun: 0,
  packPerReam: 0,
  transport: 0,
  trimming: 0,
  misc: 0,
};

export const money = (n: number) =>
  n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

export type Line = { label: string; detail: string; amount: number };

export type Quote = {
  lines: Line[];
  total: number;
  quote: number;
  vat: number;
  payable: number;
  profit: number;
  /** null rather than NaN while there is no cost to take a percentage of. */
  marginPct: number | null;
  tithe: number;
};

const per = (unit: number, count: number, noun: string): Line["detail"] =>
  `${money(unit)} × ${money(count)} ${noun}${count === 1 ? "" : "s"}`;

export function priceJob(v: Inputs): Quote {
  const lines: Line[] = [
    {
      label: "Paper",
      detail: per(v.paperPerReam, v.reams, "ream"),
      amount: v.paperPerReam * v.reams,
    },
    {
      label: "Film",
      detail: per(v.filmEach, v.films, "film"),
      amount: v.filmEach * v.films,
    },
    {
      label: "Plates",
      detail: per(v.plateEach, v.plates, "plate"),
      amount: v.plateEach * v.plates,
    },
    {
      label: "Printing",
      detail: per(v.printPerRun, v.runs, "run"),
      amount: v.printPerRun * v.runs,
    },
    {
      label: "Packing",
      detail: per(v.packPerReam, v.reams, "ream"),
      amount: v.packPerReam * v.reams,
    },
    { label: "Transport", detail: "flat", amount: v.transport },
    { label: "Trimming / cutting", detail: "flat", amount: v.trimming },
    { label: "Miscellaneous", detail: "flat", amount: v.misc },
  ];

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  const quote = Math.ceil((total * (1 + MARGIN)) / ROUND_TO) * ROUND_TO;
  const vat = Math.round(quote * VAT_RATE);
  const profit = quote - total;

  return {
    lines,
    total,
    quote,
    vat,
    payable: quote + vat,
    profit,
    marginPct: total > 0 ? (profit / total) * 100 : null,
    tithe: Math.round(profit * TITHE_RATE),
  };
}

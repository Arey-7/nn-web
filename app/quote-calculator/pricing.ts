/**
 * Costing rules, and the job types the agency quotes for.
 *
 * A job type is data, not code: it declares its own inputs and how they
 * combine into line items. Adding a kind of work, renaming a line or changing
 * what multiplies what is an edit to JOB_TYPES below — the form, the working
 * and the quote all follow from it.
 *
 * Every line is one of two shapes, which is the whole grammar:
 *   { unit, count, noun } — a per-unit cost times a quantity
 *                           (plural, where adding an "s" would not do)
 *   { flat }              — charged once, whatever the quantities
 *
 * That is deliberately narrow. The tool this replaced hid a "× 2" and a cost
 * multiplied by the wrong quantity inside one expression; here a line can only
 * say something the form has shown the estimator.
 *
 * MARGIN, ROUND_TO, VAT_RATE and TITHE_RATE are the original print rules,
 * unchanged, and currently apply to every job type.
 */

/** Markup applied to cost to reach the quoted price. */
export const MARGIN = 0.35;
/** The quote is rounded up to a whole multiple of this. */
export const ROUND_TO = 200;
export const VAT_RATE = 0.16;
export const TITHE_RATE = 0.12;

export const CURRENCY = "KSh";

export type FieldSpec = { key: string; label: string; default?: number };

export type LineSpec =
  | { label: string; unit: string; count: string; noun: string; plural?: string }
  | { label: string; flat: string };

export type JobType = {
  id: string;
  label: string;
  note: string;
  /** How many of each. */
  quantities: FieldSpec[];
  /** What one of each costs. */
  units: FieldSpec[];
  /** Charged once. */
  flats: FieldSpec[];
  lines: LineSpec[];
};

export const JOB_TYPES: JobType[] = [
  {
    id: "print",
    label: "Print production",
    note: "Press advertising, and anything else that ends up on paper.",
    quantities: [
      { key: "reams", label: "Reams of paper" },
      { key: "films", label: "Films" },
      { key: "plates", label: "Plates" },
      { key: "runs", label: "Print runs", default: 1 },
    ],
    units: [
      { key: "paperPerReam", label: "Paper, per ream" },
      { key: "filmEach", label: "Film, each" },
      { key: "plateEach", label: "Plate, each" },
      { key: "printPerRun", label: "Printing, per run" },
      { key: "packPerReam", label: "Packing, per ream" },
    ],
    flats: [
      { key: "transport", label: "Transport" },
      { key: "trimming", label: "Trimming / cutting" },
      { key: "misc", label: "Miscellaneous" },
    ],
    lines: [
      { label: "Paper", unit: "paperPerReam", count: "reams", noun: "ream" },
      { label: "Film", unit: "filmEach", count: "films", noun: "film" },
      { label: "Plates", unit: "plateEach", count: "plates", noun: "plate" },
      { label: "Printing", unit: "printPerRun", count: "runs", noun: "run" },
      { label: "Packing", unit: "packPerReam", count: "reams", noun: "ream" },
      { label: "Transport", flat: "transport" },
      { label: "Trimming / cutting", flat: "trimming" },
      { label: "Miscellaneous", flat: "misc" },
    ],
  },
  {
    id: "film",
    label: "Film production",
    note: "Television and online film, from the treatment to the delivered master.",
    quantities: [
      { key: "shootDays", label: "Shoot days", default: 1 },
      { key: "editDays", label: "Edit days", default: 1 },
      { key: "cast", label: "Cast" },
      { key: "deliverables", label: "Cuts delivered", default: 1 },
    ],
    units: [
      { key: "crewPerDay", label: "Crew, per shoot day" },
      { key: "kitPerDay", label: "Camera & lighting, per shoot day" },
      { key: "locationPerDay", label: "Location, per shoot day" },
      { key: "castFee", label: "Cast fee, each" },
      { key: "editPerDay", label: "Edit suite, per day" },
      { key: "masterEach", label: "Finishing, per cut" },
    ],
    flats: [
      { key: "treatment", label: "Concept & treatment" },
      { key: "artDept", label: "Art department & wardrobe" },
      { key: "music", label: "Music & licensing" },
      { key: "travel", label: "Travel & catering" },
      { key: "miscFilm", label: "Miscellaneous" },
    ],
    lines: [
      { label: "Crew", unit: "crewPerDay", count: "shootDays", noun: "shoot day" },
      { label: "Camera & lighting", unit: "kitPerDay", count: "shootDays", noun: "shoot day" },
      { label: "Location", unit: "locationPerDay", count: "shootDays", noun: "shoot day" },
      { label: "Cast", unit: "castFee", count: "cast", noun: "person", plural: "people" },
      { label: "Edit", unit: "editPerDay", count: "editDays", noun: "day" },
      { label: "Finishing", unit: "masterEach", count: "deliverables", noun: "cut" },
      { label: "Concept & treatment", flat: "treatment" },
      { label: "Art department & wardrobe", flat: "artDept" },
      { label: "Music & licensing", flat: "music" },
      { label: "Travel & catering", flat: "travel" },
      { label: "Miscellaneous", flat: "miscFilm" },
    ],
  },
  {
    id: "radio",
    label: "Radio production",
    note: "Spots recorded, voiced and mixed for broadcast.",
    quantities: [
      { key: "spots", label: "Spots", default: 1 },
      { key: "voices", label: "Voice artists" },
      { key: "studioHours", label: "Studio hours" },
      { key: "languages", label: "Language versions", default: 1 },
    ],
    units: [
      { key: "studioPerHour", label: "Studio, per hour" },
      { key: "voiceFee", label: "Voice fee, each" },
      { key: "mixPerSpot", label: "Mix & master, per spot" },
      { key: "versionEach", label: "Translation, per version" },
    ],
    flats: [
      { key: "script", label: "Script & concept" },
      { key: "musicRadio", label: "Music & licensing" },
      { key: "miscRadio", label: "Miscellaneous" },
    ],
    lines: [
      { label: "Studio", unit: "studioPerHour", count: "studioHours", noun: "hour" },
      { label: "Voice artists", unit: "voiceFee", count: "voices", noun: "artist" },
      { label: "Mix & master", unit: "mixPerSpot", count: "spots", noun: "spot" },
      { label: "Translation", unit: "versionEach", count: "languages", noun: "version" },
      { label: "Script & concept", flat: "script" },
      { label: "Music & licensing", flat: "musicRadio" },
      { label: "Miscellaneous", flat: "miscRadio" },
    ],
  },
  {
    id: "creative",
    label: "Creative & design",
    note: "Time rather than materials: concepts, copy, artwork, a campaign's thinking.",
    quantities: [
      { key: "creativeDays", label: "Creative days" },
      { key: "designDays", label: "Design & artwork days" },
      { key: "accountDays", label: "Account & project days" },
      { key: "presentations", label: "Presentations" },
    ],
    units: [
      { key: "creativeRate", label: "Creative, per day" },
      { key: "designRate", label: "Design, per day" },
      { key: "accountRate", label: "Account, per day" },
      { key: "presentationEach", label: "Presentation, each" },
    ],
    flats: [
      { key: "research", label: "Research" },
      { key: "stock", label: "Stock images & fonts" },
      { key: "miscCreative", label: "Miscellaneous" },
    ],
    lines: [
      { label: "Creative", unit: "creativeRate", count: "creativeDays", noun: "day" },
      { label: "Design & artwork", unit: "designRate", count: "designDays", noun: "day" },
      { label: "Account & project", unit: "accountRate", count: "accountDays", noun: "day" },
      { label: "Presentations", unit: "presentationEach", count: "presentations", noun: "presentation" },
      { label: "Research", flat: "research" },
      { label: "Stock images & fonts", flat: "stock" },
      { label: "Miscellaneous", flat: "miscCreative" },
    ],
  },
];

export const jobById = (id: string) =>
  JOB_TYPES.find((j) => j.id === id) ?? JOB_TYPES[0];

export const fieldsOf = (job: JobType): FieldSpec[] => [
  ...job.quantities,
  ...job.units,
  ...job.flats,
];

/**
 * Values are namespaced by job, so switching type does not lose the other.
 * These strings also become input ids, so the separator has to be something a
 * CSS selector accepts unescaped — a colon is legal in an HTML id and breaks
 * querySelector, which is a nasty thing to leave lying around for later.
 */
export const valueKey = (jobId: string, field: string) => `${jobId}-${field}`;

export const money = (n: number) =>
  n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

export type Values = Record<string, number>;
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

export function priceJob(job: JobType, v: Values): Quote {
  const lines: Line[] = job.lines.map((spec) => {
    if ("flat" in spec) {
      return { label: spec.label, detail: "flat", amount: v[spec.flat] ?? 0 };
    }
    const unit = v[spec.unit] ?? 0;
    const count = v[spec.count] ?? 0;
    return {
      label: spec.label,
      detail: `${money(unit)} × ${money(count)} ${
        count === 1 ? spec.noun : (spec.plural ?? `${spec.noun}s`)
      }`,
      amount: unit * count,
    };
  });

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

export type PricedLine = { label: string; amount: number };

/**
 * The client's version of the breakdown.
 *
 * It must never be built from `Quote.lines`: those are costs, and a client who
 * adds them up next to the quoted figure has just been handed the margin. Each
 * line is carried up to its share of the quoted price instead, and the unit
 * rates and quantities are left behind — what a crew day costs the agency is
 * not the client's business, but what the crew comes to on their invoice is.
 *
 * The shares are allocated by largest remainder rather than rounded one by
 * one. Rounding each line independently leaves the column a shilling or two
 * off the total, and a quote whose own numbers do not add up is worse than no
 * breakdown at all. Lines costing nothing are dropped rather than printed as
 * zeroes.
 */
export function quotedLines(q: Quote): PricedLine[] {
  const billable = q.lines.filter((l) => l.amount > 0);
  if (billable.length === 0 || q.total <= 0 || q.quote <= 0) return [];

  const exact = billable.map((l) => (l.amount * q.quote) / q.total);
  const amounts = exact.map(Math.floor);

  // Whatever the flooring dropped, handed out to the largest fractions first.
  let left = q.quote - amounts.reduce((a, b) => a + b, 0);
  const byFraction = exact
    .map((e, i) => ({ i, fraction: e - Math.floor(e) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let k = 0; left > 0; k++, left--) {
    amounts[byFraction[k % byFraction.length].i] += 1;
  }

  return billable.map((l, i) => ({ label: l.label, amount: amounts[i] }));
}

import { randomUUID } from "node:crypto";
import {
  JOB_TYPES,
  MARGIN,
  ROUND_TO,
  VAT_RATE,
  parseValues,
  priceJob,
} from "../pricing";
import { ready } from "./db";

export type LedgerEntry = {
  id: string;
  createdAt: string;
  jobType: string;
  client: string;
  reference: string;
  description: string;
  issuedOn: string | null;
  itemised: boolean;
  inputs: Record<string, string>;
  totalCost: number;
  quoteAmount: number;
  vat: number;
  payable: number;
  profit: number;
  marginPct: number | null;
  /** The rules in force when this was quoted. */
  marginRate: number;
  roundTo: number;
  vatRate: number;
};

export type NewEntry = {
  jobType: string;
  client: string;
  reference: string;
  description: string;
  issuedOn: string;
  itemised: boolean;
  inputs: Record<string, string>;
};

/** Postgres hands back bigint and numeric as strings, to avoid silent loss. */
const num = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));
const maybe = (v: unknown) => (v === null || v === undefined ? null : Number(v));

/* eslint-disable @typescript-eslint/no-explicit-any */
const toEntry = (r: any): LedgerEntry => ({
  id: r.id,
  createdAt: new Date(r.created_at).toISOString(),
  jobType: r.job_type,
  client: r.client,
  reference: r.reference,
  description: r.description,
  issuedOn: r.issued_on
    ? new Date(r.issued_on).toISOString().slice(0, 10)
    : null,
  itemised: r.itemised,
  inputs: r.inputs ?? {},
  totalCost: num(r.total_cost),
  quoteAmount: num(r.quote_amount),
  vat: num(r.vat),
  payable: num(r.payable),
  profit: num(r.profit),
  marginPct: maybe(r.margin_pct),
  marginRate: num(r.margin_rate),
  roundTo: num(r.round_to),
  vatRate: num(r.vat_rate),
});
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function saveEntry(entry: NewEntry): Promise<LedgerEntry> {
  // The figures are recomputed here rather than taken from the request. A
  // Server Action is an endpoint, so whatever it is handed is an assertion,
  // not a fact; recomputing from the inputs means the row can never disagree
  // with the inputs stored beside it.
  const job = JOB_TYPES.find((j) => j.id === entry.jobType);
  if (!job) throw new Error("Unknown kind of work.");
  const q = priceJob(job, parseValues(job, entry.inputs));

  const db = await ready();
  const id = randomUUID();

  const [row] = await db`
    insert into quotes ${db({
      id,
      job_type: entry.jobType,
      client: entry.client,
      reference: entry.reference,
      description: entry.description,
      // An empty date field is absent, not the start of the epoch.
      issued_on: entry.issuedOn || null,
      itemised: entry.itemised,
      inputs: db.json(entry.inputs),
      total_cost: Math.round(q.total),
      quote_amount: Math.round(q.quote),
      vat: Math.round(q.vat),
      payable: Math.round(q.payable),
      profit: Math.round(q.profit),
      margin_pct: q.marginPct,
      margin_rate: MARGIN,
      round_to: ROUND_TO,
      vat_rate: VAT_RATE,
    })}
    returning *
  `;
  return toEntry(row);
}

export async function listEntries(limit = 200): Promise<LedgerEntry[]> {
  const db = await ready();
  const rows = await db`
    select * from quotes order by created_at desc limit ${limit}
  `;
  return rows.map(toEntry);
}

export async function getEntry(id: string): Promise<LedgerEntry | null> {
  const db = await ready();
  const rows = await db`select * from quotes where id = ${id}`;
  return rows.length ? toEntry(rows[0]) : null;
}

export async function deleteEntry(id: string): Promise<boolean> {
  const db = await ready();
  const rows = await db`delete from quotes where id = ${id} returning id`;
  return rows.length > 0;
}

export async function totals(): Promise<{ count: number; payable: number }> {
  const db = await ready();
  const [row] = await db`
    select count(*)::int as count, coalesce(sum(payable), 0) as payable
    from quotes
  `;
  return { count: num(row.count), payable: num(row.payable) };
}

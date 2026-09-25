import postgres from "postgres";

/**
 * The ledger's connection.
 *
 * Server-only, like everything else under this route: DATABASE_URL has no
 * NEXT_PUBLIC_ prefix and must never be imported from a client component.
 *
 * The ledger is optional. With no DATABASE_URL the calculator still works in
 * full — it simply cannot save — because pricing a job at a client's desk
 * should not fail because a database is unreachable.
 */

export const ledgerConfigured = () => Boolean(process.env.DATABASE_URL);

let client: postgres.Sql | null = null;

function connection(): postgres.Sql {
  client ??= postgres(process.env.DATABASE_URL!, {
    // Serverless hosts open a connection per invocation and throw it away; a
    // large pool there just exhausts the server's connection limit.
    max: 4,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return client;
}

let prepared: Promise<unknown> | null = null;

/**
 * Creates the table on first use: idempotent, and small enough that a
 * migration tool would be more machinery than the problem deserves.
 */
export function ready(): Promise<postgres.Sql> {
  const db = connection();
  prepared ??= db`
    create table if not exists quotes (
      id            text primary key,
      created_at    timestamptz not null default now(),
      job_type      text        not null,
      client        text        not null default '',
      reference     text        not null default '',
      description   text        not null default '',
      issued_on     date,
      itemised      boolean     not null default true,

      -- What was typed, so a quote can be reopened and reworked.
      inputs        jsonb       not null,

      -- What was actually quoted. Stored rather than recomputed from inputs:
      -- the pricing rules will change, and a ledger has to say what was
      -- promised at the time, not what the same figures would produce today.
      total_cost    bigint      not null,
      quote_amount  bigint      not null,
      vat           bigint      not null,
      payable       bigint      not null,
      profit        bigint      not null,
      margin_pct    numeric(8,2),

      -- The rules in force when it was quoted, for the same reason.
      margin_rate   numeric(6,4) not null,
      round_to      integer      not null,
      vat_rate      numeric(6,4) not null
    )
  `.then(
    () =>
      db`create index if not exists quotes_created_at_idx on quotes (created_at desc)`
  );

  return prepared.then(() => db);
}

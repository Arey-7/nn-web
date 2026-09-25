"use server";

import { revalidatePath } from "next/cache";
import { hasSession } from "../session";
import { ledgerConfigured } from "./db";
import {
  deleteEntry,
  listEntries,
  saveEntry,
  type LedgerEntry,
  type NewEntry,
} from "./store";

/**
 * Every action here checks the session itself.
 *
 * The page being behind a gate is not enough: a Server Action is an endpoint,
 * and anyone who can construct the request can call it whether or not they
 * were ever served the page it lives on. The gate protects the rendering; this
 * protects the data.
 */
/** An error whose message is fit to show someone. Anything else is not. */
class LedgerError extends Error {}

async function guard() {
  if (!(await hasSession())) {
    throw new LedgerError("Not signed in. Reload and unlock the tool.");
  }
  if (!ledgerConfigured()) {
    throw new LedgerError("No ledger database is configured.");
  }
}

export type SaveResult =
  | { ok: true; entry: LedgerEntry }
  | { ok: false; error: string };

export async function saveQuote(entry: NewEntry): Promise<SaveResult> {
  try {
    await guard();
    const saved = await saveEntry(entry);
    revalidatePath("/quote-calculator/ledger");
    return { ok: true, entry: saved };
  } catch (error) {
    // Only messages raised deliberately are shown. A driver error can carry
    // the connection string, the host or a stack trace, and none of that has
    // any business being rendered in a browser — it goes to the log instead.
    console.error("ledger: save failed", error);
    return {
      ok: false,
      error:
        error instanceof LedgerError
          ? error.message
          : "Could not save to the ledger.",
    };
  }
}

export async function removeQuote(id: string): Promise<{ ok: boolean }> {
  try {
    await guard();
    const gone = await deleteEntry(id);
    revalidatePath("/quote-calculator/ledger");
    return { ok: gone };
  } catch (error) {
    console.error("ledger: delete failed", error);
    return { ok: false };
  }
}

export async function fetchEntries(): Promise<LedgerEntry[]> {
  await guard();
  return listEntries();
}

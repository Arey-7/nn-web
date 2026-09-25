"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPassword,
  endSession,
  isConfigured,
  startSession,
} from "./session";

export type SignInState = { error: string | null };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

/**
 * Throttling lives in module scope, which means one counter per server
 * instance. On a single long-running server that is a real limit; spread
 * across serverless instances it is friction against a casual guesser rather
 * than a lockout. It is deliberately not a database: the honest protection
 * here is the length of the password.
 */
const attempts = new Map<string, { count: number; since: number }>();

function locked(key: string) {
  const record = attempts.get(key);
  if (!record) return false;
  if (Date.now() - record.since > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string) {
  const record = attempts.get(key);
  if (!record || Date.now() - record.since > WINDOW_MS) {
    attempts.set(key, { count: 1, since: Date.now() });
    return;
  }
  record.count += 1;
}

async function caller() {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
}

export async function signIn(
  _previous: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isConfigured()) {
    return {
      error:
        "This tool has no password set on the server, so it cannot be unlocked.",
    };
  }

  const who = await caller();
  if (locked(who)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  if (!checkPassword(String(formData.get("password") ?? ""))) {
    recordFailure(who);
    // One message for every failure: naming what was wrong would confirm
    // whether a guess was close.
    return { error: "That password is not right." };
  }

  attempts.delete(who);
  await startSession();
  // The page reads the cookie while rendering on the server, so it has to be
  // asked for again rather than re-rendered from the action's return value.
  redirect("/quote-calculator");
}

export async function signOut() {
  await endSession();
  redirect("/quote-calculator");
}

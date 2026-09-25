import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * The password gate for the costing tool.
 *
 * This module is only ever imported by a Server Component or a Server Action.
 * Nothing here may be imported from a client component — `QUOTE_PASSWORD` has
 * no NEXT_PUBLIC_ prefix precisely so that it cannot reach the browser bundle,
 * and importing this from client code would be the one way to undo that.
 *
 * The check lives in the route rather than in proxy.ts on purpose: Next's own
 * guidance is that proxy is for optimistic checks and "should not be used as a
 * full session management or authorization solution". One authoritative check,
 * in the thing being protected.
 */

const COOKIE = "rr_quote_session";
const TTL_MS = 8 * 60 * 60 * 1000;

const password = () => process.env.QUOTE_PASSWORD ?? "";
const secret = () => process.env.QUOTE_SESSION_SECRET ?? "";

/**
 * Both variables are required. An unconfigured deployment denies everyone
 * rather than letting an empty password through — the gate fails closed.
 */
export const isConfigured = () => password().length > 0 && secret().length > 0;

const sha = (s: string) => createHash("sha256").update(s).digest();

/**
 * Compares digests rather than the strings themselves. timingSafeEqual throws
 * on a length mismatch, and that throw would itself leak the password's length;
 * hashing first makes every comparison exactly 32 bytes.
 */
const sameSecret = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

const sign = (payload: string) =>
  createHmac("sha256", secret()).update(payload).digest("hex");

/** The token carries its own expiry, signed, so it cannot be extended by hand. */
export const issueToken = (now = Date.now()) => {
  const payload = String(now + TTL_MS);
  return `${payload}.${sign(payload)}`;
};

export function tokenIsValid(token: string | undefined, now = Date.now()) {
  if (!isConfigured() || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  // Signature first: the expiry in the payload is only worth reading once the
  // payload is known not to have been written by the client.
  if (!sameSecret(sign(payload), signature)) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > now;
}

export const checkPassword = (input: string) =>
  isConfigured() && sameSecret(input, password());

export async function hasSession() {
  const store = await cookies();
  return tokenIsValid(store.get(COOKIE)?.value);
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  // Plain http on localhost would otherwise drop the cookie in development.
  secure: process.env.NODE_ENV === "production",
  // Scoped to the tool, so it is not sent with any other request to the site.
  path: "/quote-calculator",
};

export async function startSession() {
  const store = await cookies();
  store.set(COOKIE, issueToken(), {
    ...COOKIE_OPTIONS,
    maxAge: TTL_MS / 1000,
  });
}

export async function endSession() {
  const store = await cookies();
  store.set(COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

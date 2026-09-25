"use client";

import { useTransition } from "react";
import { signOut } from "./actions";

const STORE = "rr-quote";

/**
 * Signing out clears the saved quote as well as the session. The inputs are
 * kept in this browser's storage so work survives a reload, which is welcome
 * on your own machine and not at all welcome on a shared one — a client's name
 * and what the job costs would otherwise sit there for whoever opens the page
 * next. An expiring session leaves the draft alone; only a deliberate sign-out
 * wipes it.
 */
export default function SignOutButton() {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        try {
          localStorage.removeItem(STORE);
        } catch {
          /* nothing stored to clear */
        }
        start(() => {
          signOut();
        });
      }}
      className="text-label text-ink-faint transition-colors hover:text-ink disabled:opacity-50"
    >
      {pending ? "Signing out" : "Sign out"}
    </button>
  );
}

"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "./actions";

const INITIAL: SignInState = { error: null };

export default function Gate({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, INITIAL);

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[1600px] items-center px-6 md:px-10">
      <div className="w-full max-w-md">
        <p className="text-label text-ink-faint">Internal</p>
        <h1 className="mt-5 text-display text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
          Staff only.
        </h1>
        <p className="mt-5 leading-relaxed text-ink-muted">
          The quote calculator is an internal tool. Enter the password to open
          it.
        </p>

        {configured ? (
          <form action={formAction} className="mt-10">
            <label htmlFor="password" className="text-label block text-ink-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              aria-describedby={state.error ? "gate-error" : undefined}
              className="mt-3 w-full border-b border-line-strong bg-transparent pb-2 text-2xl text-ink transition-colors focus:border-accent focus:outline-none"
            />

            {state.error && (
              <p id="gate-error" role="alert" className="mt-5 text-sm text-red-500">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-9 border border-line-strong px-6 py-3 text-label text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {pending ? "Checking" : "Unlock"}
            </button>
          </form>
        ) : (
          <p className="mt-10 border border-line px-5 py-4 text-sm text-ink-muted">
            No password has been set on the server. Add{" "}
            <code className="text-ink">QUOTE_PASSWORD</code> and{" "}
            <code className="text-ink">QUOTE_SESSION_SECRET</code> to the
            environment, then restart.
          </p>
        )}
      </div>
    </div>
  );
}

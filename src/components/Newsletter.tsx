"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "../app/actions";

const initial: SubscribeState = { status: "idle", message: "" };

/** Membership sign-up. Submits to a server action that persists to Neon. */
export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribe, initial);

  return (
    <section className="section container" id="membership">
      <div className="newsletter">
        <span className="eyebrow">Membership</span>
        <h2>Join the inner circle</h2>
        <p>
          Early access to new arrivals, private offers and the occasional beautiful thing —
          straight to your inbox.
        </p>

        <form action={formAction} className="subscribe-form" noValidate>
          <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            aria-describedby="newsletter-msg"
          />
          <button type="submit" disabled={isPending}>
            {isPending ? "Joining…" : "Subscribe"}
          </button>
        </form>

        <p
          id="newsletter-msg"
          className={`form-msg ${state.status === "success" ? "success" : ""} ${state.status === "error" ? "error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      </div>
    </section>
  );
}

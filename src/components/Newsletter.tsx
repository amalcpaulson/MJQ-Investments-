"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "../app/actions";
import { useT } from "@/i18n/client";

const initial: SubscribeState = { status: "idle", message: "" };

/** Membership sign-up. Submits to a server action that persists to Neon. */
export default function Newsletter() {
  const { t } = useT();
  const [state, formAction, isPending] = useActionState(subscribe, initial);

  return (
    <section className="section container" id="membership">
      <div className="newsletter reveal-scroll">
        <span className="eyebrow">{t("newsletter.eyebrow")}</span>
        <h2>{t("newsletter.title")}</h2>
        <p>{t("newsletter.desc")}</p>

        <form action={formAction} className="subscribe-form" noValidate>
          <label htmlFor="newsletter-email" className="visually-hidden">{t("contact.fEmail")}</label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder={t("newsletter.placeholder")}
            required
            aria-describedby="newsletter-msg"
          />
          <button type="submit" disabled={isPending}>
            {isPending ? t("newsletter.joining") : t("newsletter.subscribe")}
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

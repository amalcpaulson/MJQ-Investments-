"use server";

import { db } from "../lib/db";
import { subscribers } from "../db/schema";
import { getLocale } from "../i18n/server";
import { translate } from "../i18n/dictionaries";

export interface SubscribeState {
  status: "idle" | "success" | "error";
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter / membership sign-up.
 * Validates the email, then upserts into the Neon `subscribers` table.
 * Messages are returned in the active locale.
 */
export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const locale = await getLocale();
  const m = (key: string) => translate(locale, key);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) return { status: "error", message: m("newsletter.errEmpty") };
  if (!EMAIL_RE.test(email)) return { status: "error", message: m("newsletter.errInvalid") };

  const url = process.env.DATABASE_URL;
  const configured = !!url && !url.includes("placeholder") && !url.includes("user:password");
  if (!configured) {
    return { status: "success", message: m("newsletter.okPreview") };
  }

  try {
    await db
      .insert(subscribers)
      .values({ email })
      .onConflictDoNothing({ target: subscribers.email });
    return { status: "success", message: m("newsletter.ok") };
  } catch (err) {
    console.error("Subscribe insert failed:", err);
    return { status: "error", message: m("newsletter.err") };
  }
}

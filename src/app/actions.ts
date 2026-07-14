"use server";

import { db } from "../lib/db";
import { subscribers } from "../db/schema";

export interface SubscribeState {
  status: "idle" | "success" | "error";
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter / membership sign-up.
 * Validates the email, then upserts into the Neon `subscribers` table.
 * Falls back to a friendly message if the database is not configured.
 */
export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "That doesn't look like a valid email." };
  }

  const url = process.env.DATABASE_URL;
  const configured = !!url && !url.includes("placeholder") && !url.includes("user:password");
  if (!configured) {
    // No DB yet — accept gracefully so the UX still reads as successful in preview.
    return {
      status: "success",
      message: "You're on the list. (Preview mode — connect Neon to persist.)",
    };
  }

  try {
    await db
      .insert(subscribers)
      .values({ email })
      .onConflictDoNothing({ target: subscribers.email });

    return { status: "success", message: "Welcome to Luxury.ae — you're subscribed." };
  } catch (err) {
    console.error("Subscribe insert failed:", err);
    return {
      status: "error",
      message: "Something went wrong saving your email. Please try again.",
    };
  }
}

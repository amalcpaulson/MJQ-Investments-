"use client";

import { useState } from "react";
import { useT } from "@/i18n/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side contact form with validation and a success state (demo). */
export default function ContactForm() {
  const { t } = useT();
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error"); setError(t("contact.errFill")); return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error"); setError(t("contact.errEmail")); return;
    }
    setError("");
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="contact-sent" role="status">
        <h3>{t("contact.sentTitle")}</h3>
        <p>{t("contact.sentDesc")}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="c-name">{t("contact.fName")}</label>
        <input id="c-name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="c-email">{t("contact.fEmail")}</label>
        <input id="c-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="c-message">{t("contact.fMessage")}</label>
        <textarea id="c-message" name="message" rows={5} required />
      </div>
      {status === "error" && <p className="field-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary">{t("contact.send")}</button>
    </form>
  );
}

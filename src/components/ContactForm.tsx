"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side contact form with validation and a success state (demo). */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error"); setError("Please fill in every field."); return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error"); setError("Please enter a valid email address."); return;
    }
    setError("");
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="contact-sent" role="status">
        <h3>Message received</h3>
        <p>Thank you — we&rsquo;ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="c-name">Full name</label>
        <input id="c-name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows={5} required />
      </div>
      {status === "error" && <p className="field-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary">Send message</button>
    </form>
  );
}

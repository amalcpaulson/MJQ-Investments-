"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../cart/CartProvider";
import { useT } from "@/i18n/client";
import { ChatIcon, CloseIcon, SendIcon } from "../icons";

interface ProductRef { handle: string; title: string; vendor: string; price: string; image: string | null }
interface OrderRef { orderNumber: string; total: string; lines: { title: string; qty: number }[] }
interface Msg {
  role: "user" | "assistant";
  content: string;
  products?: ProductRef[];
  order?: OrderRef;
}

export default function ChatWidget() {
  const { items, add, clear } = useCart();
  const { t, locale } = useT();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quick = [t("chat.q1"), t("chat.q2"), t("chat.q3"), t("chat.q4")];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, busy]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const history = [...msgs, { role: "user" as const, content: clean }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          cart: items.map((i) => ({ handle: i.handle, title: i.title, priceFils: i.priceFils, qty: i.qty })),
        }),
      });
      const data = await res.json();
      setMsgs((prev) => [...prev, { role: "assistant", content: data.reply ?? "…", products: data.products, order: data.order }]);
      if (data.order) clear();
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", content: "…" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={`chat-fab ${open ? "hidden" : ""}`} aria-label={t("chat.open")} onClick={() => setOpen(true)}>
        <ChatIcon />
        <span>{t("chat.fab")}</span>
      </button>

      <div className={`chat-panel ${open ? "open" : ""}`} role="dialog" aria-label={t("chat.title")} aria-hidden={!open}>
        <header className="chat-head">
          <div>
            <span className="chat-title">{t("chat.title")}</span>
            <span className="chat-status"><span className="dot" /> {t("chat.online")}</span>
          </div>
          <button type="button" className="icon-btn" aria-label={t("chat.close")} onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </header>

        <div className="chat-log" ref={scrollRef}>
          <div className="chat-msg assistant">
            <div className="chat-bubble">{t("chat.greeting")}</div>
          </div>

          {msgs.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <div className="chat-bubble">{m.content}</div>

              {m.products && m.products.length > 0 && (
                <div className="chat-products">
                  {m.products.map((p) => (
                    <div key={p.handle} className="chat-product">
                      <Link href={`/products/${p.handle}`} className="chat-product-media" onClick={() => setOpen(false)}>
                        {p.image && <Image src={p.image} alt={p.title} fill sizes="56px" className="product-img" />}
                      </Link>
                      <div className="chat-product-info">
                        <span className="chat-product-title">{p.title}</span>
                        <span className="chat-product-price">{p.price}</span>
                      </div>
                      <button
                        type="button"
                        className="chat-add"
                        onClick={() => add({ handle: p.handle, title: p.title, image: p.image, priceFils: priceToFils(p.price) })}
                        aria-label={`${t("chat.add")} — ${p.title}`}
                      >
                        {t("chat.add")}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {m.order && (
                <div className="chat-order" role="status">
                  <strong>{t("chat.orderConfirmed", { n: m.order.orderNumber })}</strong>
                  <ul>{m.order.lines.map((l, j) => <li key={j}>{l.qty}× {l.title}</li>)}</ul>
                  <span className="chat-order-total">{t("chat.orderTotal", { total: m.order.total })}</span>
                </div>
              )}
            </div>
          ))}
          {busy && (
            <div className="chat-msg assistant">
              <div className="chat-bubble typing"><span /><span /><span /></div>
            </div>
          )}
        </div>

        {msgs.length === 0 && (
          <div className="chat-quick">
            {quick.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="chat-text" className="visually-hidden">{t("chat.send")}</label>
          <input
            id="chat-text"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat.placeholder")}
            autoComplete="off"
          />
          <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label={t("chat.send")}>
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  );
}

function priceToFils(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

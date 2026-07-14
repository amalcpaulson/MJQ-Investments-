"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../cart/CartProvider";
import { ChatIcon, CloseIcon, SendIcon } from "../icons";

interface ProductRef { handle: string; title: string; vendor: string; price: string; image: string | null }
interface OrderRef { orderNumber: string; total: string; lines: { title: string; qty: number }[] }
interface Msg {
  role: "user" | "assistant";
  content: string;
  products?: ProductRef[];
  order?: OrderRef;
}

const GREETING: Msg = {
  role: "assistant",
  content: "Hello — I'm the Luxury.ae concierge. I can help you find products and place your order right here. What are you after?",
};
const QUICK = ["Best Marvis toothpaste", "Hair care for dry hair", "A grooming gift", "Checkout my cart"];

export default function ChatWidget() {
  const { items, add, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          cart: items.map((i) => ({ handle: i.handle, title: i.title, priceFils: i.priceFils, qty: i.qty })),
        }),
      });
      const data = await res.json();
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "…", products: data.products, order: data.order },
      ]);
      if (data.order) clear(); // order placed — empty the cart
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`chat-fab ${open ? "hidden" : ""}`}
        aria-label="Open the Luxury.ae concierge chat"
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
        <span>Concierge</span>
      </button>

      <div className={`chat-panel ${open ? "open" : ""}`} role="dialog" aria-label="Luxury.ae concierge" aria-hidden={!open}>
        <header className="chat-head">
          <div>
            <span className="chat-title">Luxury.ae Concierge</span>
            <span className="chat-status"><span className="dot" /> Online</span>
          </div>
          <button type="button" className="icon-btn" aria-label="Close chat" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </header>

        <div className="chat-log" ref={scrollRef}>
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
                        aria-label={`Add ${p.title} to cart`}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {m.order && (
                <div className="chat-order" role="status">
                  <strong>Order {m.order.orderNumber} confirmed ✓</strong>
                  <ul>{m.order.lines.map((l, j) => <li key={j}>{l.qty}× {l.title}</li>)}</ul>
                  <span className="chat-order-total">Total {m.order.total}</span>
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

        {msgs.length <= 1 && (
          <div className="chat-quick">
            {QUICK.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        <form
          className="chat-input"
          onSubmit={(e) => { e.preventDefault(); send(input); }}
        >
          <label htmlFor="chat-text" className="visually-hidden">Message the concierge</label>
          <input
            id="chat-text"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a product, or say “checkout”…"
            autoComplete="off"
          />
          <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label="Send message">
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  );
}

/** "AED 47" -> 4700 fils, for adding chat results to the shared cart. */
function priceToFils(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

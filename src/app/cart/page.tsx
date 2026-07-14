"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { useT } from "@/i18n/client";

export default function CartPage() {
  const { items, totalFils, setQty, remove, clear, ready } = useCart();
  const { t } = useT();
  const [placed, setPlaced] = useState(false);

  if (!ready) {
    return <main id="main" className="section container"><p className="result-count">{t("cart.loading")}</p></main>;
  }

  if (placed) {
    return (
      <main id="main" className="section container">
        <div className="cart-empty">
          <h1>{t("cart.thanksTitle")}</h1>
          <p>{t("cart.thanksDesc")}</p>
          <Link href="/collections" className="btn btn-primary">{t("cart.thanksCta")}</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main" className="section container">
        <div className="cart-empty">
          <h1>{t("cart.emptyTitle")}</h1>
          <p>{t("cart.emptyDesc")}</p>
          <Link href="/collections" className="btn btn-primary">{t("cart.emptyCta")}</Link>
        </div>
      </main>
    );
  }

  const shipping = totalFils >= 15000 || totalFils === 0 ? 0 : 2000;

  return (
    <main id="main" className="section container">
      <div className="page-head">
        <span className="eyebrow">{t("cart.eyebrow")}</span>
        <h1>{t("cart.title")}</h1>
      </div>

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => (
            <li key={item.handle} className="cart-item">
              <Link href={`/products/${item.handle}`} className="cart-thumb">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="96px" className="product-img" />
                ) : null}
              </Link>
              <div className="cart-item-info">
                <Link href={`/products/${item.handle}`} className="cart-item-title">{item.title}</Link>
                <span className="cart-item-price">{formatPrice(item.priceFils)}</span>
              </div>
              <div className="qty-control" role="group" aria-label={item.title}>
                <button type="button" onClick={() => setQty(item.handle, item.qty - 1)} aria-label="−">−</button>
                <span aria-live="polite">{item.qty}</span>
                <button type="button" onClick={() => setQty(item.handle, item.qty + 1)} aria-label="+">+</button>
              </div>
              <span className="cart-line-total">{formatPrice(item.priceFils * item.qty)}</span>
              <button type="button" className="cart-remove" onClick={() => remove(item.handle)} aria-label={`× ${item.title}`}>×</button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary" aria-label={t("cart.summary")}>
          <h2>{t("cart.summary")}</h2>
          <div className="cart-row"><span>{t("cart.subtotal")}</span><span>{formatPrice(totalFils)}</span></div>
          <div className="cart-row"><span>{t("cart.shipping")}</span><span>{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</span></div>
          <div className="cart-row total"><span>{t("cart.total")}</span><span>{formatPrice(totalFils + shipping)}</span></div>
          <button type="button" className="btn btn-primary cart-checkout" onClick={() => setPlaced(true)}>
            {t("cart.checkout")}
          </button>
          <button type="button" className="cart-clear" onClick={clear}>{t("cart.clear")}</button>
          <p className="cart-note">{t("cart.note")}</p>
        </aside>
      </div>
    </main>
  );
}

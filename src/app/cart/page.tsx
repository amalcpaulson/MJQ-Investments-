"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, totalFils, setQty, remove, clear, ready } = useCart();
  const [placed, setPlaced] = useState(false);

  if (!ready) {
    return <main id="main" className="section container"><p className="result-count">Loading your cart…</p></main>;
  }

  if (placed) {
    return (
      <main id="main" className="section container">
        <div className="cart-empty">
          <h1>Thank you</h1>
          <p>Your order has been placed (demo checkout). A confirmation would be emailed to you.</p>
          <Link href="/collections" className="btn btn-primary">Continue shopping</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main" className="section container">
        <div className="cart-empty">
          <h1>Your cart is empty</h1>
          <p>Discover the houses we carry — Marvis, Fino and Proraso.</p>
          <Link href="/collections" className="btn btn-primary">Shop the collection</Link>
        </div>
      </main>
    );
  }

  const shipping = totalFils >= 15000 || totalFils === 0 ? 0 : 2000;

  return (
    <main id="main" className="section container">
      <div className="page-head">
        <span className="eyebrow">Your bag</span>
        <h1>Shopping cart</h1>
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
              <div className="qty-control" role="group" aria-label={`Quantity for ${item.title}`}>
                <button type="button" onClick={() => setQty(item.handle, item.qty - 1)} aria-label="Decrease quantity">−</button>
                <span aria-live="polite">{item.qty}</span>
                <button type="button" onClick={() => setQty(item.handle, item.qty + 1)} aria-label="Increase quantity">+</button>
              </div>
              <span className="cart-line-total">{formatPrice(item.priceFils * item.qty)}</span>
              <button type="button" className="cart-remove" onClick={() => remove(item.handle)} aria-label={`Remove ${item.title}`}>×</button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary" aria-label="Order summary">
          <h2>Summary</h2>
          <div className="cart-row"><span>Subtotal</span><span>{formatPrice(totalFils)}</span></div>
          <div className="cart-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="cart-row total"><span>Total</span><span>{formatPrice(totalFils + shipping)}</span></div>
          <button type="button" className="btn btn-primary cart-checkout" onClick={() => setPlaced(true)}>
            Checkout
          </button>
          <button type="button" className="cart-clear" onClick={clear}>Clear cart</button>
          <p className="cart-note">Free shipping on orders over AED 150.</p>
        </aside>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "./cart/CartProvider";
import { CartIcon, SearchIcon, MenuIcon, CloseIcon } from "./icons";

const LINKS = [
  { href: "/collections/marvis", label: "Toothpaste" },
  { href: "/collections/mouthwash", label: "Mouthwash" },
  { href: "/collections/fino", label: "Hair Care" },
  { href: "/collections/proraso", label: "Grooming" },
  { href: "/collections/gift-set-collection", label: "Gift Sets" },
  { href: "/blogs", label: "Journal" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count, ready } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Luxury.ae home">
          LUXURY<span className="dot-ae">.ae</span>
        </Link>

        <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/collections" onClick={() => setOpen(false)} className="nav-all">
            Shop all
          </Link>
        </nav>

        <div className="header-actions">
          <Link href="/collections" className="icon-btn" aria-label="Search products">
            <SearchIcon />
          </Link>
          <ThemeToggle />
          <Link href="/cart" className="icon-btn" aria-label={`Cart, ${count} items`} style={{ position: "relative" }}>
            <CartIcon />
            {ready && count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

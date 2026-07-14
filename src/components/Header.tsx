"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "./cart/CartProvider";
import { useT } from "@/i18n/client";
import { CartIcon, SearchIcon, MenuIcon, CloseIcon } from "./icons";

const LINKS = [
  { href: "/collections/marvis", key: "nav.toothpaste" },
  { href: "/collections/mouthwash", key: "nav.mouthwash" },
  { href: "/collections/fino", key: "nav.hairCare" },
  { href: "/collections/proraso", key: "nav.grooming" },
  { href: "/collections/gift-set-collection", key: "nav.giftSets" },
  { href: "/blogs", key: "nav.journal" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count, ready } = useCart();
  const { t } = useT();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Luxury.ae home">
          LUXURY<span className="dot-ae">.ae</span>
        </Link>

        <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {t(l.key)}
            </Link>
          ))}
          <Link href="/collections" onClick={() => setOpen(false)} className="nav-all">
            {t("common.shopAll")}
          </Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          <Link href="/collections" className="icon-btn" aria-label={t("common.search")}>
            <SearchIcon />
          </Link>
          <ThemeToggle />
          <Link href="/cart" className="icon-btn" aria-label={`${t("common.cart")} (${count})`} style={{ position: "relative" }}>
            <CartIcon />
            {ready && count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-label={t("common.shop")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

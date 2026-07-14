"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { CartIcon, MenuIcon, CloseIcon } from "./icons";

const LINKS = [
  { href: "#categories", label: "Categories" },
  { href: "#collection", label: "Collection" },
  { href: "#journal", label: "The Edit" },
  { href: "#membership", label: "Membership" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="Luxury.ae home">
          LUXURY<span className="dot-ae">.ae</span>
        </a>

        <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button type="button" className="icon-btn" aria-label="Cart (0 items)" style={{ position: "relative" }}>
            <CartIcon />
            <span className="cart-count" aria-hidden="true">0</span>
          </button>
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

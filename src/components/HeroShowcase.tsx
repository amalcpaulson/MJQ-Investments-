"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroSlide {
  handle: string;
  title: string;
  price: string;
  image: string | null;
  href: string;
}

const DURATION = 5000; // ms per slide

/**
 * Full-bleed hero: a giant display headline behind an auto-advancing product,
 * with a video-style pause control + progress bars and glassy pill CTAs.
 * Inspired by premium skincare landing pages, adapted to the Luxury.ae brand.
 */
export default function HeroShowcase({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<number | null>(null);

  // Honour reduced-motion: no autoplay, no float.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  // Autoplay timer (restarts whenever the active slide changes).
  useEffect(() => {
    if (reduced || slides.length <= 1) return;
    timer.current = window.setTimeout(advance, DURATION);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [active, reduced, advance, slides.length]);

  const current = slides[active];

  return (
    <section className="showcase" aria-roledescription="carousel" aria-label="Featured products">
      <div className="showcase-panel">
        <div className="showcase-bg" aria-hidden="true" />
        <span className="showcase-eyebrow fade-up delay-1">Luxury living, delivered in the UAE</span>

        <h1 className="showcase-headline" aria-label="Everyday luxury">
          <span className="line line-1">EVERYDAY</span>
          <span className="line line-2">LUXURY</span>
        </h1>

        <div className={`showcase-stage ${reduced ? "" : "floating"}`}>
          {slides.map((s, i) => (
            <div key={s.handle} className={`stage-item ${i === active ? "on" : ""}`} aria-hidden={i !== active}>
              {s.image && (
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 780px) 62vw, 420px"
                  className="stage-img"
                  priority={i === 0}
                />
              )}
            </div>
          ))}
        </div>

        <Link href={current.href} className="showcase-label" aria-live="polite">
          <span className="showcase-label-name">{current.title}</span>
          <span className="showcase-label-price">{current.price}</span>
        </Link>

        <div className="showcase-cta fade-up delay-4">
          <Link href="/collections" className="pill pill-primary">Shop the collection</Link>
          <Link href="/collections" className="pill pill-glass">Explore collection</Link>
        </div>
      </div>
    </section>
  );
}

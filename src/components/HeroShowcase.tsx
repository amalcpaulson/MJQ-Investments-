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
  const [paused, setPaused] = useState(false);
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

  // Autoplay timer (restarts whenever active/pause changes).
  useEffect(() => {
    if (paused || reduced || slides.length <= 1) return;
    timer.current = window.setTimeout(advance, DURATION);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [active, paused, reduced, advance, slides.length]);

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

        <div className="showcase-controls">
          {slides.length > 1 && !reduced && (
            <button
              type="button"
              className="showcase-play"
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
              )}
            </button>
          )}
          <div className="showcase-bars" role="tablist" aria-label="Choose product">
            {slides.map((s, i) => {
              const running = i === active && !reduced;
              return (
                <button
                  key={s.handle}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={s.title}
                  className={`showcase-bar ${i === active ? "active" : ""} ${i < active ? "done" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <span
                    className={`showcase-bar-fill ${running ? "run" : ""} ${running && paused ? "paused" : ""}`}
                    style={running ? { animationDuration: `${DURATION}ms` } : undefined}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

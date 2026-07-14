"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Feature detect native CSS Scroll-Driven Animations.
    // If supported, we exit early and let native CSS handle the reveals for optimal performance.
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)")
    ) {
      return;
    }

    // Fallback: IntersectionObserver to apply the `.in-view` class.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // Stop observing to make it a one-shot reveal animation
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px", // Trigger when element is 10% inside the viewport
        threshold: 0.02,
      }
    );

    // Find and observe all scroll-reveal candidates
    const elements = document.querySelectorAll(".reveal-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]); // Re-run when navigation occurs

  return null;
}

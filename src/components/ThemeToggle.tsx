"use client";

import { useSyncExternalStore } from "react";
import { SunIcon, MoonIcon } from "./icons";

type Theme = "light" | "dark";
const EVENT = "luxae-themechange";

/** Subscribe to theme changes broadcast by the toggle. */
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/** Read the live theme straight from the DOM (set pre-paint in layout). */
function getSnapshot(): Theme {
  return (document.documentElement.getAttribute("data-theme") as Theme) || "light";
}

/** Stable value for SSR + first hydration; the real theme is read post-mount. */
function getServerSnapshot(): Theme {
  return "light";
}

/** Toggles light/dark via data-theme on <html>, persisted to localStorage. */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("luxae-theme", next);
    } catch {
      /* ignore private-mode storage errors */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

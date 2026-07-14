"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { translate, plural } from "./dictionaries";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

type Vars = Record<string, string | number>;

/** Client translator bound to the provider's locale. */
export function useT() {
  const locale = useContext(LocaleContext);
  return {
    locale,
    t: (key: string, vars?: Vars) => translate(locale, key, vars),
    plural: (base: string, n: number, vars?: Vars) => plural(locale, base, n, vars),
  };
}

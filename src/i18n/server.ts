import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { translate, plural } from "./dictionaries";

/** Resolve the active locale from the cookie (server components). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

type Vars = Record<string, string | number>;

/** Server translator bound to the request's locale. */
export async function getT() {
  const locale = await getLocale();
  return {
    locale,
    t: (key: string, vars?: Vars) => translate(locale, key, vars),
    plural: (base: string, n: number, vars?: Vars) => plural(locale, base, n, vars),
  };
}

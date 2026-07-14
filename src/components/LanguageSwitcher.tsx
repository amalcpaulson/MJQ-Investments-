"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/client";
import { LOCALE_COOKIE } from "@/i18n/config";
import { translate } from "@/i18n/dictionaries";

/** EN ⇄ AR toggle. Persists to a cookie and refreshes server components. */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const next = locale === "ar" ? "en" : "ar";

  const switchLang = () => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={switchLang}
      aria-label={translate(locale, "lang.label")}
      lang={next}
    >
      {translate(locale, "lang.switchTo")}
    </button>
  );
}

import { searchProducts, createOrder, makeOrderNumber } from "@/lib/shop";
import { formatPrice } from "@/lib/format";
import { translate, plural } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { PRODUCTS_AR } from "@/i18n/content-ar";
import type { Product } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage { role: "user" | "assistant"; content: string }
interface CartItem { handle: string; title: string; priceFils: number; qty: number }

const EMAIL_RE = /[^\s@,;]+@[^\s@,;]+\.[a-zA-Z]{2,24}/;

function localizeTitle(p: { handle: string; title: string }, locale: Locale): string {
  return locale === "ar" && PRODUCTS_AR[p.handle] ? PRODUCTS_AR[p.handle].title : p.title;
}
function productCard(p: Product, locale: Locale) {
  return { handle: p.handle, title: localizeTitle(p, locale), vendor: p.vendor, price: formatPrice(p.priceFils), image: p.image };
}

/**
 * Concierge assistant — deterministic product search + in-chat ordering against
 * Neon, in the caller's locale. (An AI mode can be layered on later.)
 */
export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; cart?: CartItem[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ reply: "…" }, { status: 400 });
  }

  const locale: Locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const messages = (body.messages ?? []).slice(-12).filter((m) => m && m.content?.trim());
  const cart = (body.cart ?? []).filter((c) => c && c.handle);
  const orderNumber = makeOrderNumber(Date.now());

  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const text = last.toLowerCase();
  const wantsOrder = /\b(order|checkout|buy|purchase|place|confirm)\b/.test(text) || /(اطلب|طلب|شراء|اشتري|إتمام|الدفع|أكمل|تأكيد)/.test(last);
  const email = last.match(EMAIL_RE)?.[0];

  if (wantsOrder) {
    if (cart.length === 0) return Response.json({ reply: t("chat.rEmpty") });
    if (!email) {
      const total = formatPrice(cart.reduce((n, c) => n + c.priceFils * c.qty, 0));
      return Response.json({ reply: t("chat.rNeedInfo", { n: plural(locale, "common.products", cart.length), total }) });
    }
    const phone = last.match(/(\+?\d[\d\s-]{6,})/)?.[0]?.trim() ?? "";
    const name = last.match(/\bname[:\s]+([a-z .'-]{2,40})/i)?.[1]?.trim() || (locale === "ar" ? "زائر" : "Guest");
    try {
      const placed = await createOrder(
        { name, email, phone, address: last, items: cart.map((c) => ({ handle: c.handle, qty: c.qty })), channel: "chatbot" },
        orderNumber
      );
      return Response.json({
        reply: t("chat.rConfirmed", { n: placed.orderNumber, total: formatPrice(placed.totalFils), email }),
        order: {
          orderNumber: placed.orderNumber,
          total: formatPrice(placed.totalFils),
          lines: placed.lines.map((l) => ({ title: localizeTitle(l, locale), qty: l.qty })),
        },
      });
    } catch {
      return Response.json({ reply: t("chat.rFail") });
    }
  }

  const results = await searchProducts(last, 4);
  if (results.length > 0) {
    return Response.json({
      reply: last.trim() ? t("chat.rResultsQ", { q: last.trim() }) : t("chat.rResults"),
      products: results.map((p) => productCard(p, locale)),
    });
  }

  return Response.json({ reply: t("chat.rHelp") });
}

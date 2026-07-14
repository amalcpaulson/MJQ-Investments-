import { searchProducts, createOrder, makeOrderNumber } from "@/lib/shop";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage { role: "user" | "assistant"; content: string }
interface CartItem { handle: string; title: string; priceFils: number; qty: number }

interface ChatResult {
  reply: string;
  products?: { handle: string; title: string; vendor: string; price: string; image: string | null }[];
  order?: { orderNumber: string; total: string; lines: { title: string; qty: number }[] };
}

const EMAIL_RE = /[^\s@,;]+@[^\s@,;]+\.[a-zA-Z]{2,24}/;

function productCard(p: Product) {
  return { handle: p.handle, title: p.title, vendor: p.vendor, price: formatPrice(p.priceFils), image: p.image };
}

/**
 * Concierge assistant — deterministic product search + in-chat ordering against
 * Neon. (An AI-powered conversational mode can be layered on later.)
 */
export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; cart?: CartItem[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ reply: "Sorry, I couldn't read that." }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-12).filter((m) => m && m.content?.trim());
  const cart = (body.cart ?? []).filter((c) => c && c.handle);
  const orderNumber = makeOrderNumber(Date.now());

  return Response.json(await runAssistant(messages, cart, orderNumber));
}

async function runAssistant(messages: ChatMessage[], cart: CartItem[], orderNumber: string): Promise<ChatResult> {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const text = last.toLowerCase();
  const wantsOrder = /\b(order|checkout|buy|purchase|place|confirm)\b/.test(text);
  const email = last.match(EMAIL_RE)?.[0];

  if (wantsOrder) {
    if (cart.length === 0) {
      return { reply: "Your cart is empty at the moment — add a few things and I'll place the order for you." };
    }
    if (!email) {
      const total = formatPrice(cart.reduce((n, c) => n + c.priceFils * c.qty, 0));
      return {
        reply: `Happy to place your order (${cart.length} item${cart.length > 1 ? "s" : ""}, ${total}). Please reply with your email, name and delivery address.`,
      };
    }
    const phone = last.match(/(\+?\d[\d\s-]{6,})/)?.[0]?.trim() ?? "";
    const name = last.match(/\bname[:\s]+([a-z .'-]{2,40})/i)?.[1]?.trim() || "Guest";
    try {
      const placed = await createOrder(
        { name, email, phone, address: last, items: cart.map((c) => ({ handle: c.handle, qty: c.qty })), channel: "chatbot" },
        orderNumber
      );
      return {
        reply: `Order confirmed — thank you! Your order number is ${placed.orderNumber} and the total is ${formatPrice(placed.totalFils)}. A confirmation will be emailed to ${email}.`,
        order: { orderNumber: placed.orderNumber, total: formatPrice(placed.totalFils), lines: placed.lines.map((l) => ({ title: l.title, qty: l.qty })) },
      };
    } catch {
      return { reply: "Something went wrong placing that order. Please try again in a moment." };
    }
  }

  // Product discovery.
  const results = await searchProducts(last, 4);
  if (results.length > 0) {
    return {
      reply: `Here are a few options I found${last.trim() ? ` for “${last.trim()}”` : ""}. Tap a product to view it, or add items and say “checkout” to order.`,
      products: results.map(productCard),
    };
  }

  return {
    reply: "I'm the Luxury.ae concierge — I can help you find Marvis toothpaste, Fino hair care or Proraso grooming, and place your order. What are you looking for?",
  };
}

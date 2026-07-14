import Anthropic from "@anthropic-ai/sdk";
import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { searchProducts, createOrder, makeOrderNumber } from "@/lib/shop";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5"; // fast, low-cost chat tier

interface ChatMessage { role: "user" | "assistant"; content: string }
interface CartItem { handle: string; title: string; priceFils: number; qty: number }

interface ChatResult {
  reply: string;
  products?: { handle: string; title: string; vendor: string; price: string; image: string | null }[];
  order?: { orderNumber: string; total: string; lines: { title: string; qty: number }[] };
  source: "ai" | "assistant";
}

const EMAIL_RE = /[^\s@,;]+@[^\s@,;]+\.[a-zA-Z]{2,24}/;

function productCard(p: Product) {
  return { handle: p.handle, title: p.title, vendor: p.vendor, price: formatPrice(p.priceFils), image: p.image };
}

const SYSTEM = `You are the Luxury.ae Concierge — a warm, concise shopping assistant for a UAE luxury beauty, hair and grooming store (brands: Marvis, Fino, Proraso). Prices are in AED.

Help shoppers discover products and place orders directly in chat.
- Use the search_products tool to find real products; never invent items or prices.
- To place an order, first make sure you have the customer's name, email, phone, and delivery address, and confirm the items and quantities. Then call place_order.
- Keep replies short and elegant (1-3 sentences). Do not use markdown tables.`;

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; cart?: CartItem[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ reply: "Sorry, I couldn't read that.", source: "assistant" }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-12).filter((m) => m && m.content?.trim());
  const cart = (body.cart ?? []).filter((c) => c && c.handle);
  const orderNumber = makeOrderNumber(Date.now());

  const configured = !!process.env.ANTHROPIC_API_KEY;

  if (configured) {
    try {
      const result = await runWithClaude(messages, cart, orderNumber);
      return Response.json(result);
    } catch (err) {
      console.error("Chat AI error, using fallback:", err);
      // fall through to deterministic assistant
    }
  }

  return Response.json(await runFallback(messages, cart, orderNumber));
}

/* ------------------------------------------------------------------ */
/* AI path — tool-runner over the catalogue                            */
/* ------------------------------------------------------------------ */
async function runWithClaude(messages: ChatMessage[], cart: CartItem[], orderNumber: string): Promise<ChatResult> {
  const client = new Anthropic();
  const collected: { products?: ChatResult["products"]; order?: ChatResult["order"] } = {};

  const cartNote = cart.length
    ? `\n\nThe shopper's current cart: ${cart.map((c) => `${c.qty}× ${c.title} (${c.handle})`).join(", ")}.`
    : "\n\nThe shopper's cart is currently empty.";

  const search = betaTool({
    name: "search_products",
    description: "Search the Luxury.ae catalogue by keyword and return matching products with prices.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "Keywords, e.g. 'mint toothpaste' or 'beard oil'" } },
      required: ["query"],
      additionalProperties: false,
    },
    run: async ({ query }: { query: string }) => {
      const results = await searchProducts(query, 6);
      collected.products = results.slice(0, 4).map(productCard);
      return JSON.stringify(
        results.map((p) => ({ handle: p.handle, title: p.title, vendor: p.vendor, price: formatPrice(p.priceFils), available: p.available }))
      );
    },
  });

  const placeOrder = betaTool({
    name: "place_order",
    description: "Place a confirmed order. Only call after collecting name, email, phone, address, and confirming the items.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        items: {
          type: "array",
          description: "Items to order. Handles come from search_products or the shopper's cart.",
          items: {
            type: "object",
            properties: { handle: { type: "string" }, qty: { type: "integer" } },
            required: ["handle", "qty"],
            additionalProperties: false,
          },
        },
      },
      required: ["name", "email", "phone", "address", "items"],
      additionalProperties: false,
    },
    run: async (input: { name: string; email: string; phone: string; address: string; items: { handle: string; qty: number }[] }) => {
      try {
        const placed = await createOrder({ ...input, channel: "chatbot" }, orderNumber);
        collected.order = {
          orderNumber: placed.orderNumber,
          total: formatPrice(placed.totalFils),
          lines: placed.lines.map((l) => ({ title: l.title, qty: l.qty })),
        };
        return JSON.stringify({ ok: true, orderNumber: placed.orderNumber, total: formatPrice(placed.totalFils) });
      } catch (e) {
        return JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Order failed" });
      }
    },
  });

  const finalMessage = await client.beta.messages.toolRunner({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM + cartNote,
    tools: [search, placeOrder],
    max_iterations: 6,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const reply = finalMessage.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join(" ")
    .trim();

  return { reply: reply || "How can I help you shop today?", products: collected.products, order: collected.order, source: "ai" };
}

/* ------------------------------------------------------------------ */
/* Fallback path — deterministic, no API key required                  */
/* ------------------------------------------------------------------ */
async function runFallback(messages: ChatMessage[], cart: CartItem[], orderNumber: string): Promise<ChatResult> {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const text = last.toLowerCase();
  const wantsOrder = /\b(order|checkout|buy|purchase|place|confirm)\b/.test(text);
  const email = last.match(EMAIL_RE)?.[0];

  if (wantsOrder) {
    if (cart.length === 0) {
      return { reply: "Your cart is empty at the moment — add a few things and I'll place the order for you.", source: "assistant" };
    }
    if (!email) {
      const total = formatPrice(cart.reduce((n, c) => n + c.priceFils * c.qty, 0));
      return {
        reply: `Happy to place your order (${cart.length} item${cart.length > 1 ? "s" : ""}, ${total}). Please reply with your email, name and delivery address.`,
        source: "assistant",
      };
    }
    // We have a cart + an email — place the order.
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
        source: "assistant",
      };
    } catch {
      return { reply: "Something went wrong placing that order. Please try again in a moment.", source: "assistant" };
    }
  }

  // Otherwise, treat it as product discovery.
  const results = await searchProducts(last, 4);
  if (results.length > 0) {
    return {
      reply: `Here are a few options I found${last.trim() ? ` for “${last.trim()}”` : ""}. Tap a product to view it, or add items and say “checkout” to order.`,
      products: results.map(productCard),
      source: "assistant",
    };
  }

  return {
    reply: "I'm the Luxury.ae concierge — I can help you find Marvis toothpaste, Fino hair care or Proraso grooming, and place your order. What are you looking for?",
    source: "assistant",
  };
}

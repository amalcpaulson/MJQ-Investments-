# Luxury.ae — Full E-commerce Website

A modern, premium, responsive **multi-page storefront** for **Luxury.ae**, a luxury
shopping and brand-discovery platform for premium beauty, hair and personal-care in
the UAE. Full-stack Next.js, backed by Neon PostgreSQL, deployed on Vercel.

> Redesign of [luxuryuae.ae](https://luxuryuae.ae/) (operated by MJQ Investment LLC).
> Catalogue, imagery and copy were scraped from the real store: **35 products,
> 12 collections, 30 journal articles, 53 product images** — reshaped into an
> original design (not a clone).

## Pages / routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, categories, featured products, journal, newsletter |
| `/collections` | Shop-all with brand filter, search & sort |
| `/collections/[handle]` | Category pages (Toothpaste, Mouthwash, Hair Care, Grooming, Gift Sets, …) |
| `/products/[handle]` | Product detail — gallery, price, stock, add-to-cart, related |
| `/cart` | Cart with quantity controls, totals, free-shipping threshold, checkout |
| `/blogs`, `/blogs/[handle]` | The Journal — index + articles |
| `/about`, `/why-us`, `/faq`, `/contact` | Content pages |
| `/policies/[slug]` | Shipping & Returns, Privacy, Terms |

**Live demo:** https://mjq-investments.vercel.app/
**Repository:** https://github.com/amalcpaulson/MJQ-Investments-

---

## 1. Technology used

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, React 19, Server Components + Server Actions) |
| Language | **TypeScript** (strict) |
| Database | **Neon PostgreSQL** (serverless) |
| ORM / migrations | **Drizzle ORM** + drizzle-kit |
| Styling | Hand-authored **CSS design system** (CSS custom properties, light/dark, RTL-ready logical properties) |
| Fonts | `next/font` — Playfair Display (display) + Inter (body) |
| Hosting | **Vercel** |

No UI library — the entire look is a bespoke, self-contained design system, so
there are no external image/CDN dependencies and nothing to break on deploy.

## 2. Design language

Quiet-luxury aesthetic per the brief: ivory / warm-neutral canvas, ink type,
**gold + deep-green** accents, large serif display type, generous spacing and
subtle hover motion. Real product photography (downloaded from the source store)
is served locally and optimised with `next/image`, on soft neutral tiles.

## 3. Setup instructions

```bash
# 1. Install
npm install

# 2. Configure the database (see §4) — copy the template and add your Neon URL
cp .env.example .env.local
#   then edit .env.local: DATABASE_URL="postgresql://…@…neon.tech/neondb?sslmode=require"

# 3. Create the tables in Neon and seed the catalogue
npm run db:push     # pushes the Drizzle schema (products, categories, subscribers)
npm run db:seed     # inserts 14 products + 4 categories

# 4. Run
npm run dev         # http://localhost:3000
```

Useful scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run db:studio`.

> **Runs without a database too.** If `DATABASE_URL` is unset, the storefront
> gracefully falls back to a bundled catalogue and shows a *“Preview catalogue”*
> badge, so the page always renders. Connect Neon to switch it to *“Live from Neon”*.

## 4. Database configuration

1. Create a free Postgres database at **[neon.tech](https://neon.tech)**.
2. Copy the connection string (Dashboard → *Connect*), e.g.
   `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`.
3. Local: put it in `.env.local` as `DATABASE_URL`.
4. Production: add `DATABASE_URL` as a **Vercel Environment Variable** (never commit it — `.env*` is gitignored).
5. Run `npm run db:push` then `npm run db:seed`.

**Schema** (`src/db/schema.ts`)

| Table | Purpose | Key columns |
|---|---|---|
| `products` | catalogue | handle, title, vendor, product_type, price_fils, images, body_html, collections, variants, featured |
| `collections` | categories | handle, title, description, product_handles |
| `blog_posts` | the journal | handle, title, published, content_html |
| `subscribers` | newsletter sign-ups (unique email) | email, created_at |
| `orders` | orders from checkout & the AI concierge | order_number, name, email, phone, address, items, total_fils, channel |

Pages read from Postgres at request time (`dynamic = "force-dynamic"`); the newsletter
form writes to `subscribers` via a Server Action (`src/app/actions.ts`).

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. On **vercel.com** → *New Project* → import the repo.
3. Add env var **`DATABASE_URL`** = your Neon string (Production + Preview).
4. Deploy. Then run `npm run db:push && npm run db:seed` once (locally against the same DB, or via Neon SQL editor) so production reads live data.

## 6. Features completed

- **Full multi-page storefront** — home, shop-all, category pages, product detail, cart, journal, and content/policy pages (see routes table above).
- **Real scraped catalogue** — 35 products with genuine imagery (optimised via `next/image`), descriptions, prices and variants; 12 collections; 30 articles.
- **Neon + Drizzle integration** — products, collections and blog posts read live from Postgres; newsletter persists to `subscribers`.
- **Shopping cart** — add/remove/quantity, subtotal + shipping + total, free-shipping threshold, checkout confirmation; persisted to `localStorage` via a `useSyncExternalStore` store.
- **Concierge chatbot** — a floating assistant (`/api/chat`) that searches the catalogue and **places orders in chat**, writing to the Neon `orders` table. Currently a deterministic assistant (keyword search + guided checkout); designed so an AI-powered conversational mode can be layered on later.
- **Browsing** — brand filter, live search and price sort with an accessible empty state; product detail with image gallery + related products.
- **Newsletter** with client + server email validation, `onConflictDoNothing` de-dupe, success/error feedback.
- **Dark mode** (no-flash, system-aware, persisted).
- **Error handling** — graceful DB to bundled-JSON fallback so every page renders even if the DB is down; honest live/preview indicator.
- **Accessibility** — semantic landmarks, skip link, breadcrumbs, labelled controls, `aria-live` regions, visible focus rings, `prefers-reduced-motion`.
- **SEO** — per-page metadata, Open Graph/Twitter, JSON-LD (`Store`, `Product`, `FAQPage`).
- Clean, reusable components; passes `next lint` and `next build` with zero errors/warnings.

## 7. What I'd add with more time

- Real checkout + payment gateways for the UAE (Tabby, Tamara, card, COD).
- Accounts/auth, wishlist, order history; server-side cart.
- AI-powered concierge (natural-language search + ordering) on top of the existing `/api/chat` route.
- Bilingual **EN / Arabic** with full RTL (the CSS already uses logical properties).
- Admin panel for catalogue & inventory management.
- Automated tests (Vitest/Playwright) and 301 redirects from the legacy Shopify URLs.

> **Data note:** the catalogue was scraped from the live store's public Shopify JSON
> endpoints and normalised into `src/data/*.json`, which both seeds Neon and acts as
> the offline fallback. Product images live in `/public/products`.

---

_Built with Next.js App Router, TypeScript, Drizzle ORM and Neon PostgreSQL._

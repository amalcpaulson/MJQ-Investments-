# Luxury.ae — Premium Homepage

A modern, premium, responsive storefront homepage for **Luxury.ae**, a luxury
shopping and brand-discovery platform for premium beauty, hair and personal-care
in the UAE. Built as a full-stack Next.js prototype backed by Neon PostgreSQL and
deployed on Vercel.

> Redesign brief reference: [luxuryuae.ae](https://luxuryuae.ae/) (operated by MJQ Investment LLC).
> The catalogue uses that real brand portfolio (Marvis, Fino, Proraso).

**Live demo:** _add your Vercel URL here_
**Repository:** _add your GitHub URL here_

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
subtle hover motion. Product imagery is rendered as branded typographic art
(brand initial on a per-product gradient) — premium and immune to broken images.

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
| `products` | catalogue | slug, name, brand, category, price, size, badge, accent, featured |
| `categories` | shop-by-category tiles | slug, name, tagline, accent |
| `subscribers` | newsletter sign-ups (unique email) | email, created_at |

The homepage reads `products`/`categories` at request time (`dynamic = "force-dynamic"`);
the newsletter form writes to `subscribers` via a Server Action (`src/app/actions.ts`).

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. On **vercel.com** → *New Project* → import the repo.
3. Add env var **`DATABASE_URL`** = your Neon string (Production + Preview).
4. Deploy. Then run `npm run db:push && npm run db:seed` once (locally against the same DB, or via Neon SQL editor) so production reads live data.

## 6. Features completed

- Premium, responsive homepage: header nav, hero (headline + description + CTAs + proof stats), shop-by-category, featured product grid, membership/newsletter, footer.
- **Neon + Drizzle integration** — products & categories read live from Postgres; newsletter persists to `subscribers`.
- **Category filtering** + **live product search** with an accessible empty state.
- **Newsletter form** with client + server email validation, `onConflictDoNothing` de-dupe, and success/error feedback.
- **Loading skeletons** via React `<Suspense>` around the data-fetching boundary.
- **Dark mode** (no-flash, system-aware, persisted) via `useSyncExternalStore`.
- **Error handling** — graceful DB→fallback so the page never breaks; honest live/preview status indicator.
- **Accessibility** — semantic landmarks, skip link, labelled controls, `aria-live` form status, visible focus rings, `prefers-reduced-motion` support, `role="img"` on the art cards.
- **SEO** — full metadata (Open Graph/Twitter), JSON-LD `Store` structured data, semantic headings.
- Clean, reusable component structure; passes `next lint` and `next build` with zero errors/warnings.

## 7. What I'd add with more time

- Product detail pages (`/products/[slug]`) and real cart + checkout state.
- Real product photography with `next/image` + optimisation.
- Bilingual **EN / Arabic** with full RTL (the CSS already uses logical properties).
- Cart persistence, wishlist, and account/auth.
- Admin panel for catalogue & inventory management.
- Automated tests (Vitest/Playwright) and 301 redirects from the legacy URLs.
- Payment gateways relevant to the UAE (Tabby, Tamara, card, COD).

---

_Built with Next.js App Router, TypeScript, Drizzle ORM and Neon PostgreSQL._

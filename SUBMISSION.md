# Software Developer Practical Test — Submission

**Project:** Luxury.ae Website Redesign
**Candidate:** Amal Paulson
**Stack:** Next.js 16 (App Router) · TypeScript · Neon PostgreSQL · Drizzle ORM · Vercel

---

## 1. Submission deliverables

| # | Requirement | Link / Location |
|---|---|---|
| 1 | **Live Vercel website URL** | https://mjq-investments.vercel.app/ |
| 2 | **GitHub repository URL** | https://github.com/amalcpaulson/MJQ-Investments- |
| 3 | **Screenshot of the Neon database table** | `neon-products-table.png` (attached) — `products` table, 35 records, live in the `production` branch |
| 4 | **Short README** | [`README.md`](./README.md) — Technology used · Setup instructions · Database configuration · Features completed · Features to add with more time |

---

## 2. How the build maps to the Evaluation Criteria (100 pts)

### Visual design and luxury branding — 25
- Quiet-luxury identity: ivory canvas, ink type, **gold + deep-green** accents; Playfair Display + Inter.
- Cinematic full-bleed hero: giant "EVERYDAY / LUXURY" headline behind an **auto-advancing product carousel** using **background-removed (transparent) product cutouts** that float on the scene.
- Real product photography throughout; image-led "Shop by category" lookbook tiles; "The Houses" brand showcase (Marvis / Fino / Proraso).

### Responsive UI and user experience — 15
- Mobile-first; verified at 375 / 768 / 1024 / 1440 px with no horizontal scroll.
- Adaptive hero, mobile nav drawer, responsive product grids, compact mobile CTAs.

### Neon database integration — 25
- **Drizzle ORM** over Neon serverless. Tables: `products`, `collections`, `blog_posts`, `subscribers`.
- Homepage, collection and product pages **read live from Neon** at request time — an honest "**Live from Neon PostgreSQL**" indicator confirms the connection.
- The **newsletter form persists to `subscribers`** via a Server Action (with de-dupe).
- Graceful fallback to bundled JSON if the DB is unreachable, so the site never breaks.

### Code quality and component structure — 15
- Typed, reusable components (ProductCard, ProductGrid, ProductBrowser, HeroShowcase, CategorySection, BrandHouses, cart store, etc.).
- Clean data-access layer (`src/lib/catalog.ts`) with a single fallback pattern.
- Passes `next lint` and `next build` with **zero errors/warnings**.

### Error handling and accessibility — 10
- DB-failure fallback, empty states, and form validation (client + server).
- Skip link, semantic landmarks, breadcrumbs, `aria-*` labels, visible focus rings, `prefers-reduced-motion` respected (hero autoplay/float disabled).

### Successful Vercel deployment — 10
- Live and building successfully; `DATABASE_URL` set as a Vercel environment variable; loads without console errors; works on desktop and mobile.

---

## 3. Bonus points achieved

| Bonus item | Status | Where |
|---|---|---|
| Product category filtering | ✅ | `/collections` + each collection page (brand filter + category routes) |
| Functional newsletter DB submission | ✅ | Server Action → Neon `subscribers` |
| Smooth, professional animations | ✅ | Hero carousel/float/crossfade, fade-up entrances, reveal-on-scroll, hover motion |
| Search interface | ✅ | Live product search in `ProductBrowser` |
| Dark-mode option | ✅ | System-aware, persisted, no-flash toggle |
| Strong SEO metadata | ✅ | Per-page metadata, Open Graph/Twitter, JSON-LD (`Store`, `Product`, `FAQPage`) |
| Excellent loading skeletons | ✅ | `loading.tsx` skeletons on collections / product / blog routes |
| Well-organized reusable components | ✅ | See §2 (Code quality) |

---

## 4. Beyond the brief

- Full **multi-page storefront** (not just a homepage): shop-all, category pages, product detail, cart, journal (30 articles), About / Why Us / FAQ / Contact, and policy pages.
- Working **shopping cart** (add / quantity / totals / free-ship threshold / checkout), persisted client-side.
- Real catalogue **scraped from the live store** (35 products, 12 collections, 53 images) and reshaped into an original design.

---

## 5. Notes for the reviewer (code understanding)

Two intentional, non-obvious implementation choices:
1. **`useSyncExternalStore` for theme + cart** — reads external (DOM/`localStorage`) state without hydration mismatch or the ESLint `set-state-in-effect` warning.
2. **Env-first dynamic import in the seed script** — ES imports are hoisted, so `dotenv` is loaded before `db.ts` (which reads `DATABASE_URL` on import) via `await import()`.

Data was scraped from the live Shopify store's public JSON endpoints into `src/data/*.json`, which both seeds Neon (`npm run db:seed`) and acts as the offline fallback. Hero product cutouts were generated with AI background removal (rembg).

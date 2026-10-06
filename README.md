# PriceScout (working name) — Multi-Affiliate Shopping Discovery Platform

A discovery + comparison layer over merchant catalogs (Amazon, Flipkart, Myntra, Ajio, Nykaa, Croma, etc.) for the Indian market. No checkout, no inventory, no payments — every "Buy" click leaves the site through a tracked affiliate redirect.

## 1. Core Product Loop
1. User lands via SEO (category/product/guide page) or search.
2. Sees a product with **normalized specs** and a table of live/cached **offers** from multiple merchants (price, delivery, coupon, rating).
3. Reads editorial "buying guide" / comparison content for context.
4. Clicks an offer → hits `/go/[offerId]` → server logs the click → 302 redirect to the merchant's affiliate deep link.
5. (Optional, phase 2) Merchant postback/conversion webhook reconciles commissions.

## 2. Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Frontend/SSR | Next.js 14 (App Router) + TypeScript | SEO-critical (SSR/ISR), same stack you already use on web |
| Styling | Tailwind CSS | fast iteration, consistent design tokens |
| DB | PostgreSQL (Supabase or Neon) | relational integrity for products/offers/merchants |
| ORM | Prisma | type-safe, migrations |
| Search | Postgres full-text (pg_trgm) → Meilisearch/Typesense later | start simple, upgrade when catalog >50k SKUs |
| Cache | Redis (Upstash) | price/offer cache, rate limiting, click dedupe |
| Auth (admin/editorial only) | NextAuth (credentials + Google) | no consumer auth needed initially |
| Image/CDN | Cloudflare Images or S3 + CloudFront | product images, WebP |
| Hosting | Vercel (app) + Supabase/Neon (DB) | zero-ops, scales, cheap at your stage |
| Analytics | Plausible/PostHog + server-side click log table | affiliate revenue attribution, not just pageviews |
| Feeds | Cron workers (Vercel Cron / a small worker service) pulling merchant product feeds (Amazon PA-API, Flipkart Affiliate API, CJ/Impact/Admitad/EarnKaro/INRDeals aggregators) | this is the actual hard part — see §6 |

You already run Firebase elsewhere (GST SaaS, directory app). I'd still recommend **Postgres, not Firestore**, for this project specifically: offers/products/merchants/categories are deeply relational (many merchants × many products × price history), and you'll want SQL joins + full-text search + price-history aggregation that Firestore makes painful.

## 3. Data Model (see `prisma/schema.prisma`)
Key entities:
- **Merchant** — Amazon, Flipkart, etc. + affiliate network config
- **Category** — hierarchical (Electronics > Mobiles > Smartphones)
- **Product** — canonical, de-duplicated product (brand, model, normalized specs as JSON)
- **Offer** — one row per (Product × Merchant): price, MRP, coupon, in-stock, affiliate deep link, last-checked timestamp
- **PriceHistory** — daily snapshot per Offer, powers "price trend" charts
- **Guide** — editorial content (buying guide / "best X under ₹Y"), linked to Category and/or Products
- **ClickEvent** — every affiliate click: offerId, timestamp, referrer, UA hash, IP hash (privacy-safe), session id
- **User (admin)** — editorial/admin accounts only

## 4. SEO Strategy (this is the actual growth engine)
- **Programmatic pages**: `/category/[slug]`, `/product/[slug]`, `/compare/[slugA]-vs-[slugB]`, `/best/[category]-under-[price]` — all SSR/ISR, unique title/meta/schema per page.
- **Structured data**: `Product`, `Offer` (AggregateOffer), `BreadcrumbList`, `FAQPage`, `Article` (for guides) via JSON-LD.
- **ISR** (revalidate every 1–6h) for product/category pages so prices stay fresh without rebuilding the whole site.
- Canonical tags + hreflang if you go multi-language (Hindi/regional later).
- Core Web Vitals: image optimization (`next/image`), no client-heavy comparison widgets on first paint.
- Internal linking: every guide links to relevant category/product pages and vice versa (this is what actually ranks affiliate sites in India).

## 5. Security & Compliance
- **FTC/CCPA-style disclosure**: mandatory "we may earn a commission" banner — in India this maps to ASCI influencer/affiliate disclosure guidelines. Add it globally, not just per-page.
- Rate-limit `/go/[offerId]` (Redis) to stop click-fraud/bot abuse of affiliate links.
- Sign affiliate deep links server-side (never expose your raw affiliate tag client-side) so it can't be swapped by browser extensions/scrapers.
- Admin panel behind NextAuth + role check; audit log for who edited a product/offer/guide.
- Input validation (zod) on all feed-ingestion and admin write paths.
- No PII stored beyond hashed IP/session for click logs (store salt server-side only) — keeps you clear of most data-protection obligations while still measuring attribution.
- CSP headers, HSTS, and merchant-feed webhook signature verification (HMAC) if/when postback conversions are added.

## 6. The Hard Part: Getting Offer Data
This is the actual bottleneck for an affiliate comparison site, more than the app code:
- **Amazon**: Product Advertising API (needs an approved Associates account with tracked sales — chicken-and-egg for a new site). Rate-limited.
- **Flipkart**: Flipkart Affiliate API (feed-based, easier to get approved).
- **Everything else in India**: realistically via aggregator networks — **EarnKaro, INRDeals, Cuelinks, vCommission, Admitad** — which give you one integration surface for many merchants (Myntra, Ajio, Nykaa, Croma, etc.) instead of chasing each merchant's own program.
- **Start narrow**: pick 1–2 categories (e.g., smartphones, laptops) and 3–4 merchants you can actually get feed access to, launch, then expand. Don't try to boil the ocean on catalog breadth on day one — SEO rewards depth-in-a-niche over shallow breadth anyway.

## 7. Suggested Build Order
1. Schema + admin CRUD for Product/Merchant/Offer (manual entry, no feeds yet) — get the UI/UX and page templates right.
2. Public pages: category, product detail with offer comparison table, `/go/[id]` redirect + click logging.
3. SEO layer: JSON-LD, sitemap.xml generation, ISR.
4. Guides/editorial CMS (even a simple MDX-based one to start).
5. First real feed integration (Flipkart or one aggregator network) replacing manual entry.
6. Price history + "track this price" (email alert) as a retention hook.
7. Second feed source, comparison-page generator, "best under ₹X" programmatic pages at scale.

---

This repo scaffold implements step 1–2: schema, one API route, and the product/compare page shells, so you have a running skeleton to extend.

## 8. Setup
```bash
npm install
cp .env.example .env         # fill in DATABASE_URL at minimum
npx prisma migrate dev --name init
npm run prisma:seed          # creates first admin login + a sample category/merchant
npm run dev
```
Then sign in at `/admin/login` with the email/password printed by the seed script
(**change that password immediately** — the seed route is a bootstrap convenience,
not something to leave with default credentials in production).

**What's wired up end-to-end right now:**
- Admin auth (NextAuth credentials, JWT sessions, `/admin/*` + `/api/admin/*` gated by middleware)
- Product CRUD (`/admin/products`) and Merchant CRUD (`/admin/merchants`)
- Offer management per product — add/edit/delete, with price edits auto-logged to `PriceHistory`
- Public site: home, category, product detail (with offer comparison table + JSON-LD)
- `/go/[offerId]` affiliate redirect with click logging + basic rate limiting
- `sitemap.xml` and `robots.txt` generated from live DB content

**Deliberately left as next steps** (flagged inline in code comments where relevant):
- Real feed ingestion (Flipkart/aggregator API) — currently all data entry is manual via admin
- Image upload/storage (product images are stubbed as placeholder blocks on list pages)
- Price-drop email alerts, "track this price" feature
- Editorial guides UI (schema exists; no admin editor built yet)
- Swap the in-memory click rate-limiter for Redis before running more than one server instance


# Shopify catalogue seeder

Seeds the configured Shopify store with **collections** and **products** extracted
from the legacy site at <https://dardgo.com>.

---

## 1. Generate an Admin API access token

The runtime app uses the **Storefront** token (read-only); seeding products
requires **Admin** access.

1. In Shopify admin go to **Settings → Apps and sales channels → Develop apps**.
2. Click **Create an app** → name it `Dardgo Seeder`.
3. **Configure Admin API scopes** → check at minimum:
   - `write_products`
   - `read_products`
   - `write_publications`
4. Click **Install app** in the top right.
5. Copy the **Admin API access token** (starts with `shpat_…`). It is shown
   only once.

## 2. Add credentials to `.env.local`

Append the following lines (alongside the existing `VITE_*` variables):

```bash
SHOPIFY_STORE_DOMAIN=dardgo-aura-lsiqw.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
# optional — defaults to 2025-07
SHOPIFY_API_VERSION=2025-07
```

The file is git-ignored via the `*.local` rule.

## 3. (Optional) add product images

Open `scripts/products.json` and fill in `imageUrls` for each product. Use
publicly-accessible image URLs (CDN, R2, S3, etc.). The seeder will tell
Shopify to fetch each URL and store it on its CDN. If `imageUrls` is empty,
the product is created without images (you can add them later in the admin).

## 4. Run the seeder

```bash
npm run seed:shopify
```

The script is **idempotent** — it looks up each collection / product by
handle before creating, so you can safely re-run after editing
`products.json`.

Sample output:

```text
→ Seeding store: dardgo-aura-lsiqw.myshopify.com
→ API version : 2025-07
→ 7 collections, 15 products

[02:14:01] collection + created pain-relief-oils
[02:14:01] collection + created ayurvedic-tablets
…
[02:14:18] product    + created dardgo-herbal-pain-relief-massage-oil
[02:14:19] product    + created dardgo-ayurvedic-pain-relief-roll-on
…

✓ Seeding complete.
```

Once seeding finishes, the homepage's `CollectionShowcases` component
automatically picks up the new collections through the Storefront API — no
extra code changes required.

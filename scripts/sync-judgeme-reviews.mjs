#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Sync Judge.me product reviews → Shopify `custom.dardgo_reviews` (JSON) per product.
 * The headless PDP reads this metafield for review text (see src/lib/shopify-product-reviews.ts).
 *
 * Env (.env.local):
 *   SHOPIFY_STORE_DOMAIN / VITE_SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_TOKEN
 *   JUDGEME_API_TOKEN   — Judge.me → Settings → Integrations → Developers (Private API token)
 *   SHOPIFY_API_VERSION optional
 *
 * Run:
 *   npm run sync:judgeme-reviews
 *   npm run sync:judgeme-reviews -- --handle=my-product-handle
 *   npm run sync:judgeme-reviews -- --limit=5
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const repoRoot = path.resolve(__dirname, "..");
loadEnvFile(path.join(repoRoot, ".env"));
loadEnvFile(path.join(repoRoot, ".env.local"));

const STORE = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const JUDGEME_TOKEN =
  process.env.JUDGEME_API_TOKEN ||
  process.env.JUDGEME_PRIVATE_TOKEN;
const JUDGEME_SHOP = process.env.VITE_JUDGEME_SHOP_DOMAIN || STORE;
const API_VERSION =
  process.env.SHOPIFY_API_VERSION || process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

const args = process.argv.slice(2);
const handleFilter = args.find((a) => a.startsWith("--handle="))?.split("=")[1];
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;

if (!STORE || !ADMIN_TOKEN || !JUDGEME_TOKEN) {
  console.error(
    "\nMissing env. Need SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN, JUDGEME_API_TOKEN in .env.local\n",
  );
  process.exit(1);
}

const ADMIN_GQL = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`;
const STOREFRONT_GQL = `https://${STORE}/api/${API_VERSION}/graphql.json`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function gidToLegacyId(gid) {
  return gid?.replace(/^gid:\/\/shopify\/Product\//, "") ?? "";
}

async function adminGraphql(query, variables = {}) {
  const res = await fetch(ADMIN_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`);
  }
  return json.data;
}

async function fetchJudgeMeReviews(productExternalId) {
  const judgeProductId = await fetchJudgeMeProductId(productExternalId);
  const out = [];
  let page = 1;
  const perPage = 100;

  while (page <= 20) {
    const params = new URLSearchParams({
      shop_domain: JUDGEME_SHOP,
      page: String(page),
      per_page: String(perPage),
    });
    if (judgeProductId != null) {
      params.set("product_id", String(judgeProductId));
    } else {
      params.set("product_external_id", String(productExternalId));
    }
    const res = await fetch(`https://api.judge.me/api/v1/reviews?${params}`, {
      headers: { "X-Api-Token": JUDGEME_TOKEN },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Judge.me HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    const batch = Array.isArray(data.reviews) ? data.reviews : [];
    out.push(
      ...batch.filter(
        (r) =>
          r &&
          !r.hidden &&
          r.curated !== "spam" &&
          String(r.product_external_id) === String(productExternalId),
      ),
    );
    if (batch.length < perPage) break;
    page += 1;
    await sleep(250);
  }

  return out;
}

async function fetchJudgeMeProductId(productExternalId) {
  const params = new URLSearchParams({
    shop_domain: JUDGEME_SHOP,
    external_id: String(productExternalId),
  });
  const res = await fetch(`https://api.judge.me/api/v1/products/-1?${params}`, {
    headers: { "X-Api-Token": JUDGEME_TOKEN },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const id = data?.product?.id;
  return typeof id === "number" && Number.isFinite(id) ? id : null;
}

function mapReview(r) {
  const name = String(r.reviewer?.name ?? r.reviewer_name ?? "Customer").trim() || "Customer";
  const rating = Number(r.rating);
  const title = String(r.title ?? "").trim() || "Review";
  const text = String(r.body ?? r.review ?? "").trim() || "—";
  const dateRaw = r.created_at ?? r.updated_at ?? "";
  const date =
    typeof dateRaw === "string" && dateRaw.length >= 10 ? dateRaw.slice(0, 10) : "—";
  const verified = r.verified === "buyer" || r.verified === true || r.verified_buyer === true;

  return {
    name,
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    title,
    text,
    date,
    helpful: 0,
    verified,
  };
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query ProductsPage($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          legacyResourceId
        }
      }
    }
  }
`;

const METAFIELDS_SET = /* GraphQL */ `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function storefrontGraphql(query, variables = {}) {
  if (!STOREFRONT_TOKEN) {
    throw new Error("Missing VITE_SHOPIFY_STOREFRONT_TOKEN");
  }
  const res = await fetch(STOREFRONT_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`);
  }
  return json.data;
}

const STOREFRONT_PRODUCTS_QUERY = /* GraphQL */ `
  query StorefrontProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query StorefrontProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

async function* iterateProductsStorefront() {
  if (handleFilter) {
    const data = await storefrontGraphql(STOREFRONT_PRODUCT_BY_HANDLE, {
      handle: handleFilter,
    });
    const node = data.productByHandle;
    if (node) {
      yield {
        id: node.id,
        handle: node.handle,
        legacyResourceId: gidToLegacyId(node.id),
      };
    }
    return;
  }

  let after = null;
  let count = 0;
  while (true) {
    const data = await storefrontGraphql(STOREFRONT_PRODUCTS_QUERY, {
      first: 50,
      after,
      query: null,
    });
    for (const edge of data.products.edges) {
      const node = edge.node;
      yield {
        id: node.id,
        handle: node.handle,
        legacyResourceId: gidToLegacyId(node.id),
      };
      count += 1;
      if (limit != null && count >= limit) return;
    }
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
    await sleep(300);
  }
}

async function* iterateProductsAdmin() {
  let after = null;
  let count = 0;
  const query = handleFilter ? `handle:${handleFilter}` : null;

  while (true) {
    const data = await adminGraphql(PRODUCTS_QUERY, {
      first: 50,
      after,
      query,
    });
    for (const edge of data.products.edges) {
      yield edge.node;
      count += 1;
      if (limit != null && count >= limit) return;
    }
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
    await sleep(300);
  }
}

async function* iterateProducts() {
  try {
    yield* iterateProductsAdmin();
  } catch (err) {
    console.warn(
      `[sync-judgeme-reviews] Admin product list failed (${err.message}). Using Storefront API…`,
    );
    yield* iterateProductsStorefront();
  }
}

async function setProductReviews(productId, reviews) {
  const value = JSON.stringify(reviews);
  const res = await fetch(ADMIN_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({
      query: METAFIELDS_SET,
      variables: {
        metafields: [
          {
            ownerId: productId,
            namespace: "custom",
            key: "dardgo_reviews",
            type: "json",
            value,
          },
        ],
      },
    }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join("; ");
    if (msg.includes("ACCESS_DENIED")) {
      throw new Error(
        `${msg} — Reinstall Custom App on ${STORE} with read_products + write_products and update SHOPIFY_ADMIN_TOKEN.`,
      );
    }
    throw new Error(msg);
  }
  const errs = json.data?.metafieldsSet?.userErrors ?? [];
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
}

async function main() {
  console.log(`[sync-judgeme-reviews] Shopify: ${STORE}  Judge.me: ${JUDGEME_SHOP}`);
  if (handleFilter) console.log(`  Filter handle: ${handleFilter}`);
  if (limit) console.log(`  Limit: ${limit} products\n`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for await (const product of iterateProducts()) {
    const externalId = product.legacyResourceId;
    if (!externalId) {
      console.log(`  skip  ${product.handle} (no legacyResourceId)`);
      skipped += 1;
      continue;
    }

    try {
      const raw = await fetchJudgeMeReviews(externalId);
      const mapped = raw
        .map(mapReview)
        .filter((r) => Number.isFinite(r.rating) && r.rating >= 1);
      await setProductReviews(product.id, mapped);
      console.log(`  OK    ${product.handle}  →  ${mapped.length} review(s)`);
      ok += 1;
      await sleep(400);
    } catch (err) {
      console.error(`  FAIL  ${product.handle}:`, err.message || err);
      failed += 1;
      await sleep(400);
    }
  }

  console.log(`\nDone. Updated: ${ok}, skipped: ${skipped}, failed: ${failed}`);
  console.log(
    "Ensure custom.dardgo_reviews has Storefront read access (Settings → Custom data → Products).",
  );
  if (failed > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

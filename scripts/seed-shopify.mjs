#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Shopify catalogue seeder for DARDGO
 * --------------------------------------------------
 * Reads `scripts/products.json` (generated from dardgo.com) and populates
 * the configured Shopify store with:
 *   1. Custom collections (Pain Relief Oils, Tablets, Beauty, Halwa, Powder, ...)
 *   2. Products with title, description, price, compareAtPrice, vendor, tags, images
 *   3. Collection assignments (each product is added to its declared collections)
 *
 * Requires Shopify ADMIN access (the public Storefront token used at runtime
 * is read-only and cannot mutate). Create a Custom App in the Shopify admin
 * UI (Settings → Apps and sales channels → Develop apps), grant it the
 * Admin API scopes:
 *     write_products, read_products, write_publications
 * then install it and copy the Admin API access token (starts with `shpat_`).
 *
 * Configure these environment variables in `.env.local` (or shell env):
 *     SHOPIFY_STORE_DOMAIN     e.g. dardgo-aura-lsiqw.myshopify.com
 *     SHOPIFY_ADMIN_TOKEN      e.g. shpat_xxxxxxxxxxxxxxxxxxxxxxxx
 *     SHOPIFY_API_VERSION      optional, defaults to 2025-07
 *
 * Run with:    npm run seed:shopify
 *      or:    node scripts/seed-shopify.mjs
 *
 * The script is idempotent: products and collections are looked up by handle
 * before being created, so it can safely be re-run after editing products.json.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Env loading (parse `.env.local` so the script runs without extra dev deps).
// -----------------------------------------------------------------------------
/** If override is true, file values replace existing process.env (so `.env.local` wins over shell). */
function loadEnvFile(file, override = false) {
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
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
    if (override || !(key in process.env)) process.env[key] = value;
  }
}

const repoRoot = path.resolve(__dirname, "..");
loadEnvFile(path.join(repoRoot, ".env"), false);
loadEnvFile(path.join(repoRoot, ".env.local"), true);

const STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION =
  process.env.SHOPIFY_API_VERSION ||
  process.env.VITE_SHOPIFY_API_VERSION ||
  "2025-07";

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error(
    "\n[seed-shopify] Missing env vars.\n" +
      "  Required: SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_TOKEN\n" +
      "  Add them to .env.local (admin token starts with `shpat_`).\n",
  );
  process.exit(1);
}

const ADMIN_GRAPHQL_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
const ADMIN_REST_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}`;

// -----------------------------------------------------------------------------
// Tiny helpers
// -----------------------------------------------------------------------------
async function adminGraphql(query, variables = {}) {
  const res = await fetch(ADMIN_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin GraphQL ${res.status}: ${text.slice(0, 500)}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function adminRest(method, endpoint, body) {
  const res = await fetch(`${ADMIN_REST_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Admin REST ${method} ${endpoint} → ${res.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

// Shopify rate limit ≈ 2 req/sec on basic plans — sleep between mutations.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function logStep(step, msg) {
  const ts = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(`[${ts}] ${step.padEnd(10)} ${msg}`);
}

// -----------------------------------------------------------------------------
// Collection management
// -----------------------------------------------------------------------------
const FIND_COLLECTION_BY_HANDLE = /* GraphQL */ `
  query FindCollection($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

const CREATE_COLLECTION = /* GraphQL */ `
  mutation CreateCollection($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id handle title }
      userErrors { field message }
    }
  }
`;

async function ensureCollection(collection) {
  const existing = await adminGraphql(FIND_COLLECTION_BY_HANDLE, { handle: collection.handle });
  if (existing.collectionByHandle) {
    logStep("collection", `✓ exists  ${collection.handle}`);
    return existing.collectionByHandle.id;
  }
  const data = await adminGraphql(CREATE_COLLECTION, {
    input: {
      handle: collection.handle,
      title: collection.title,
      descriptionHtml: `<p>${collection.description}</p>`,
    },
  });
  const errs = data.collectionCreate.userErrors;
  if (errs.length) throw new Error(`collectionCreate ${collection.handle}: ${JSON.stringify(errs)}`);
  logStep("collection", `+ created ${collection.handle}`);
  return data.collectionCreate.collection.id;
}

// -----------------------------------------------------------------------------
// Product management — use REST for product create (simpler image upload),
// then a GraphQL collectionAddProducts for assignment.
// -----------------------------------------------------------------------------
const FIND_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query FindProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

const COLLECTION_ADD_PRODUCTS = /* GraphQL */ `
  mutation AddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection { id }
      userErrors { field message }
    }
  }
`;

async function ensureProduct(product) {
  const existing = await adminGraphql(FIND_PRODUCT_BY_HANDLE, { handle: product.handle });
  if (existing.productByHandle) {
    logStep("product", `✓ exists  ${product.handle}`);
    return existing.productByHandle.id;
  }

  // Build REST payload. Single variant for now — extend if a product needs options.
  const restPayload = {
    product: {
      title: product.title,
      body_html: `<p>${product.description}</p>`,
      vendor: product.vendor || "DARDGO",
      product_type: product.productType || "Ayurvedic",
      handle: product.handle,
      tags: (product.tags || []).join(", "),
      status: "active",
      published: true,
      variants: [
        {
          price: product.price.toFixed(2),
          compare_at_price: product.compareAtPrice
            ? product.compareAtPrice.toFixed(2)
            : null,
          inventory_management: "shopify",
          inventory_quantity: product.inventoryQuantity ?? 50,
          requires_shipping: true,
          taxable: true,
        },
      ],
      images: (product.imageUrls || [])
        .filter(Boolean)
        .map((src) => ({ src })),
    },
  };

  const created = await adminRest("POST", "/products.json", restPayload);
  const productGid = `gid://shopify/Product/${created.product.id}`;
  logStep("product", `+ created ${product.handle}`);
  return productGid;
}

async function assignToCollections(productGid, collectionGids) {
  for (const cid of collectionGids) {
    const data = await adminGraphql(COLLECTION_ADD_PRODUCTS, {
      id: cid,
      productIds: [productGid],
    });
    const errs = data.collectionAddProducts.userErrors;
    if (errs.length) {
      // Already added is not a fatal error; log and continue.
      const msg = errs.map((e) => e.message).join("; ");
      if (!/already/i.test(msg)) {
        throw new Error(`collectionAddProducts: ${msg}`);
      }
    }
    await sleep(250);
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
  const dataPath = path.resolve(__dirname, "products.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log(`\n→ Seeding store: ${STORE_DOMAIN}`);
  console.log(`→ API version : ${API_VERSION}`);
  console.log(
    `→ ${data.collections.length} collections, ${data.products.length} products\n`,
  );

  // 1. Collections
  const collectionGidByHandle = {};
  for (const c of data.collections) {
    collectionGidByHandle[c.handle] = await ensureCollection(c);
    await sleep(500);
  }

  // 2. Products + collection assignment
  for (const p of data.products) {
    const productGid = await ensureProduct(p);
    await sleep(500);

    const collectionGids = (p.collections || [])
      .map((h) => collectionGidByHandle[h])
      .filter(Boolean);
    if (collectionGids.length) {
      await assignToCollections(productGid, collectionGids);
    }
  }

  console.log("\n✓ Seeding complete.\n");
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message || err);
  process.exit(1);
});

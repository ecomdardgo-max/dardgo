#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Seeds Shopify from `Product Details.csv` (project root by default).
 * Requires Admin API token (same as scripts/seed-shopify.mjs) with at least:
 *   read_products, write_products, write_publications
 * (reads collections/products by handle before creating — write_products alone is not enough.)
 *
 *   npm run seed:product-csv
 *   node scripts/seed-product-details-csv.mjs ./Product\ Details.csv
 *
 * CSV grouping: rows with an empty product name are extra variants for the
 * previous product (same option name as the last explicit row).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION =
  process.env.SHOPIFY_API_VERSION ||
  process.env.VITE_SHOPIFY_API_VERSION ||
  "2025-07";

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error(
    "\n[seed-product-details-csv] Missing SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_TOKEN in .env.local\n",
  );
  process.exit(1);
}

const ADMIN_GRAPHQL_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
const ADMIN_REST_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

function logStep(step, msg) {
  const ts = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(`[${ts}] ${step.padEnd(10)} ${msg}`);
}

/** Minimal RFC4180-style CSV parser (quoted fields, commas inside quotes). */
function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function inferCollectionHandles({ productCategory, type, title }) {
  const cat = (productCategory || "").toLowerCase();
  const t = (type || "").toLowerCase();
  const ttl = (title || "").toLowerCase();

  if (ttl.includes("roll-on") || cat.includes("massage") || t.includes("roll-on")) {
    return ["pain-relief-oils"];
  }
  if (
    cat.includes("hair care") ||
    t === "shampoo" ||
    (t === "oil" && (cat.includes("hair") || ttl.includes("hair")))
  ) {
    return ["ayurvedic-beauty"];
  }
  if (t.includes("capsule")) return ["ayurvedic-capsules"];
  if (t.includes("tablet")) return ["ayurvedic-tablets"];
  if (t.includes("malt") || ttl.includes("halwa")) return ["ayurvedic-halwa"];
  if (t.includes("powder")) return ["ayurvedic-powder"];
  if (t.includes("cream") || t.includes("syrup") || cat.includes("skin care") || cat.includes("oral care")) {
    return ["ayurvedic-beauty"];
  }
  if (t.includes("pain relief oil") || (t.includes("oil") && cat.includes("massage"))) {
    return ["pain-relief-oils"];
  }
  if (t.includes("oil")) return ["pain-relief-oils"];

  return ["ayurvedic-tablets"];
}

const FIND_COLLECTION_BY_HANDLE = `
  query FindCollection($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

const CREATE_COLLECTION = `
  mutation CreateCollection($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id handle title }
      userErrors { field message }
    }
  }
`;

const FIND_PRODUCT_BY_HANDLE = `
  query FindProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

const COLLECTION_ADD_PRODUCTS = `
  mutation AddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection { id }
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
  if (errs?.length) throw new Error(`collectionCreate ${collection.handle}: ${JSON.stringify(errs)}`);
  logStep("collection", `+ created ${collection.handle}`);
  return data.collectionCreate.collection.id;
}

async function assignToCollections(productGid, collectionGids) {
  for (const cid of collectionGids) {
    const data = await adminGraphql(COLLECTION_ADD_PRODUCTS, {
      id: cid,
      productIds: [productGid],
    });
    const errs = data.collectionAddProducts.userErrors;
    const msg = errs?.map((e) => e.message).join("; ") || "";
    if (msg && !/already/i.test(msg)) {
      throw new Error(`collectionAddProducts: ${msg}`);
    }
    await sleep(250);
  }
}

function loadCollectionsManifest() {
  const dataPath = path.resolve(__dirname, "products.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return data.collections || [];
}

function parseProductDetailsCsv(csvPath) {
  const raw = fs.readFileSync(csvPath, "utf-8");
  const table = parseCsvRows(raw).filter((r) => r.some((c) => String(c).trim() !== ""));
  if (table.length < 2) throw new Error("CSV has no data rows");

  const header = table[0].map((h) => h.trim().replace(/^\ufeff/, ""));
  const idx = (name) =>
    header.findIndex((h) => h.toLowerCase().replace(/\s+/g, " ") === name.toLowerCase());
  const iTitle = idx("Producy Name") >= 0 ? idx("Producy Name") : idx("Product Name");
  const iBrand = idx("Brand");
  const iCategory = idx("Product Category");
  const iType = idx("Type");
  const iOptName = idx("Option1 Name");
  const iOptVal = idx("Option1 Value");
  const iSku = idx("Variant SKU");
  const iGrams = idx("Variant Grams");
  const iPrice = idx("Variant Price");

  if ([iTitle, iBrand, iCategory, iType, iOptName, iOptVal, iSku, iGrams, iPrice].some((x) => x < 0)) {
    throw new Error("CSV missing expected columns (check header names).");
  }

  /** @type {Array<{ title: string; brand: string; category: string; type: string; optionName: string; variants: Array<{ optionValue: string; sku: string; grams: number; price: number }> }>} */
  const products = [];
  let current = null;
  let lastOptionName = "Size";

  for (let r = 1; r < table.length; r++) {
    const row = table[r];
    const title = String(row[iTitle] ?? "").trim();
    const brand = String(row[iBrand] ?? "").trim() || "DARDGO";
    const category = String(row[iCategory] ?? "").trim();
    const ptype = String(row[iType] ?? "").trim();
    let optName = String(row[iOptName] ?? "").trim();
    const optVal = String(row[iOptVal] ?? "").trim();
    const sku = String(row[iSku] ?? "").trim();
    const grams = Number.parseFloat(String(row[iGrams] ?? "0")) || 0;
    const price = Number.parseFloat(String(row[iPrice] ?? "0")) || 0;

    if (!sku || !optVal) continue;

    if (!optName) optName = lastOptionName;
    else lastOptionName = optName;

    if (title) {
      current = {
        title,
        brand,
        category,
        type: ptype,
        optionName: optName,
        variants: [{ optionValue: optVal, sku, grams, price }],
      };
      products.push(current);
    } else if (current) {
      current.variants.push({ optionValue: optVal, sku, grams, price });
    }
  }

  return products;
}

async function ensureProductFromGroup(group, handleUsed) {
  let handle = slugify(group.title);
  if (!handle) handle = slugify(group.variants[0]?.sku || "product");
  if (handleUsed.has(handle)) {
    handle = `${handle}-${slugify(group.variants[0].sku)}`.slice(0, 100);
  }
  handleUsed.add(handle);

  const existing = await adminGraphql(FIND_PRODUCT_BY_HANDLE, { handle });
  if (existing.productByHandle) {
    logStep("product", `✓ exists  ${handle}`);
    return { gid: existing.productByHandle.id, skipped: true };
  }

  const collections = inferCollectionHandles({
    productCategory: group.category,
    type: group.type,
    title: group.title,
  });
  const categoryTags = collections.map((h) => `category-${h}`);
  const tags = ["ayurvedic", "csv-import", ...categoryTags].join(", ");

  const variants = group.variants.map((v) => ({
    option1: v.optionValue,
    sku: v.sku,
    price: v.price.toFixed(2),
    inventory_management: "shopify",
    inventory_quantity: 50,
    requires_shipping: true,
    taxable: true,
    ...(v.grams > 0 ? { weight: v.grams, weight_unit: "g" } : {}),
  }));

  const restPayload = {
    product: {
      title: group.title,
      body_html: `<p>${group.title}</p>`,
      vendor: group.brand,
      product_type: group.type || "Ayurvedic",
      handle,
      tags,
      status: "active",
      published: true,
      options: [{ name: group.optionName || "Size" }],
      variants,
      images: [],
    },
  };

  const created = await adminRest("POST", "/products.json", restPayload);
  const id = created.product?.id;
  if (!id) throw new Error(`Create failed for ${handle}: ${JSON.stringify(created).slice(0, 400)}`);

  logStep("product", `+ created ${handle} (${group.variants.length} variant(s))`);
  return { gid: `gid://shopify/Product/${id}`, skipped: false };
}

async function main() {
  const csvArg = process.argv.find((a) => a.endsWith(".csv"));
  const csvPath = csvArg
    ? path.resolve(process.cwd(), csvArg)
    : path.resolve(process.cwd(), "Product Details.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  const groups = parseProductDetailsCsv(csvPath);
  console.log(`\n→ Store     : ${STORE_DOMAIN}`);
  console.log(`→ API       : ${API_VERSION}`);
  console.log(`→ CSV       : ${csvPath}`);
  console.log(`→ Products  : ${groups.length}\n`);

  const collectionsManifest = loadCollectionsManifest();
  const collectionGidByHandle = {};
  for (const c of collectionsManifest) {
    collectionGidByHandle[c.handle] = await ensureCollection(c);
    await sleep(400);
  }

  const handleUsed = new Set();
  for (const group of groups) {
    const { gid } = await ensureProductFromGroup(group, handleUsed);
    await sleep(500);

    const handles = inferCollectionHandles({
      productCategory: group.category,
      type: group.type,
      title: group.title,
    });
    const collectionGids = handles.map((h) => collectionGidByHandle[h]).filter(Boolean);
    if (collectionGids.length) {
      await assignToCollections(gid, collectionGids);
    }
  }

  console.log("\n✓ CSV seed complete.\n");
}

main().catch((err) => {
  const msg = err.message || String(err);
  console.error("\n✗ Seed failed:", msg);
  if (
    /read_products/i.test(msg) ||
    /ACCESS_DENIED/i.test(msg) ||
    /collectionByHandle|productByHandle/i.test(msg)
  ) {
    console.error(`
→ Shopify ne bataya: Admin token par **read_products** scope nahi hai (ya purana token hai).

  Fix (ek baar):
  1. Shopify Admin → Settings → Apps and sales channels → Develop apps → apna app
  2. Configuration → Admin API integration → **Admin API access scopes**
  3. **read_products** ✓ (saath me **write_products**, **write_publications** rahen)
  4. Save → upar **Install app** / reinstall → **naya** Admin API token copy karo
  5. .env.local me SHOPIFY_ADMIN_TOKEN update karo

  Details: https://shopify.dev/docs/api/usage/access-scopes
`);
  }
  process.exit(1);
});

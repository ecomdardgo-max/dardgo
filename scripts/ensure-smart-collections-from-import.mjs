#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Creates **automated (smart) Shopify collections** that match the CSV import tags:
 * each product has tags like `category-pain-relief-oils`, `category-ayurvedic-tablets`, …
 * (see scripts/build-shopify-import-csv.mjs → inferTags).
 *
 * Definitions (title, description, handle) come from scripts/products.json.
 * Skips `bacterial-vanish-ointment` (no matching category-* tag in the import flow).
 *
 * Requires: SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN (Admin API; write_products minimum;
 * read helps for cleaner idempotency — script tolerates 422 duplicate handle).
 *
 *   npm run seed:smart-collections
 *   node scripts/ensure-smart-collections-from-import.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    "\nMissing SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_TOKEN (see scripts/README.md)\n",
  );
  process.exit(1);
}

const ADMIN_REST_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}`;

const SKIP_HANDLES = new Set(["bacterial-vanish-ointment"]);

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
  let parsed = {};
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    /* ignore */
  }
  return { res, text, parsed };
}

function logStep(msg) {
  const ts = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(`[${ts}] ${msg}`);
}

async function ensureSmartCollection({ handle, title, description, tag }) {
  const payload = {
    smart_collection: {
      title,
      handle,
      body_html: `<p>${description}</p>`,
      published: true,
      disjunctive: false,
      rules: [{ column: "tag", relation: "equals", condition: tag }],
    },
  };

  const { res, parsed } = await adminRest("POST", "/smart_collections.json", payload);

  if (res.ok && parsed.smart_collection) {
    logStep(`+ smart collection  ${handle}  (rule: tag = ${tag})`);
    return;
  }

  const errs = parsed.errors || parsed.base || parsed;
  const errStr = typeof errs === "string" ? errs : JSON.stringify(errs);

  if (
    res.status === 422 ||
    /already|taken|exists|duplicate/i.test(errStr)
  ) {
    logStep(`✓ skip / exists  ${handle}`);
    return;
  }

  throw new Error(
    `POST smart_collections ${handle} → ${res.status}: ${(errStr || "").slice(0, 400)}`,
  );
}

function main() {
  const manifestPath = path.join(repoRoot, "scripts", "products.json");
  const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const list = data.collections || [];

  console.log(`\n→ Store  : ${STORE_DOMAIN}`);
  console.log(`→ API    : ${API_VERSION}`);
  console.log(`→ Source : scripts/products.json (smart rules = tag category-<handle>)\n`);

  const tasks = list.filter((c) => c.handle && !SKIP_HANDLES.has(c.handle));

  for (const c of tasks) {
    const tag = `category-${c.handle}`;
    await ensureSmartCollection({
      handle: c.handle,
      title: c.title,
      description: c.description || "",
      tag,
    });
    await new Promise((r) => setTimeout(r, 350));
  }

  console.log(
    "\n✓ Done. Collections pick up any product whose tags include `category-<handle>` (same as CSV import).\n",
  );
}

main().catch((err) => {
  console.error("\n✗ Failed:", err.message || err);
  process.exit(1);
});

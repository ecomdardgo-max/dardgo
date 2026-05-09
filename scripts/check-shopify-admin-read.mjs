#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Quick check: does the Admin token in .env.local have read_products?
 * Does not print the token. Run: node scripts/check-shopify-admin-read.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const STORE =
  process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const VER =
  process.env.SHOPIFY_API_VERSION ||
  process.env.VITE_SHOPIFY_API_VERSION ||
  "2025-07";

if (!STORE || !TOKEN) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN");
  process.exit(1);
}

console.log("Store:", STORE);
console.log("Token: present in env (length", TOKEN.length, "chars)");

const url = `https://${STORE}/admin/api/${VER}/products.json?limit=1`;
const res = await fetch(url, {
  headers: { "X-Shopify-Access-Token": TOKEN },
});
const text = await res.text();
console.log("GET /products.json?limit=1 → HTTP", res.status);
if (res.ok) {
  console.log("read_products: OK — seed script should be able to read collections/products.");
  process.exit(0);
}
console.log(text.slice(0, 280));
console.error(
  "\nread_products: NOT active on this token. Reinstall app after enabling scope; paste NEW token into .env.local.",
);
process.exit(1);

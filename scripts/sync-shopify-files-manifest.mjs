#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Build a static filename → CDN URL map from Shopify Content → Files.
 * Output: public/shopify-files.json (used as fallback when /api/shopify-files is unavailable).
 *
 * Requires SHOPIFY_ADMIN_TOKEN with read_files scope in .env.local
 * Run: npm run sync:shopify-files
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

function normalizeStem(filename) {
  const full = filename.trim().toLowerCase();
  const stem = full
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/(_+\d+x\d+|_\d+x)+$/i, "");
  return { full, stem };
}

function stemFromUrl(url) {
  try {
    const base = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "").toLowerCase();
    return normalizeStem(base).stem;
  } catch {
    return "";
  }
}

function addUrlToMap(map, url) {
  if (!url) return;
  const stem = stemFromUrl(url);
  if (stem && !map[stem]) map[stem] = url;
  try {
    const base = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "").toLowerCase();
    if (base && !map[base]) map[base] = url;
  } catch {
    /* ignore */
  }
}

const repoRoot = path.resolve(__dirname, "..");
loadEnvFile(path.join(repoRoot, ".env"), false);
loadEnvFile(path.join(repoRoot, ".env.local"), true);

const STORE = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const VER = process.env.SHOPIFY_API_VERSION || process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

if (!STORE || !TOKEN) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN");
  process.exit(1);
}

const FILES_PAGE_QUERY = `
  query ShopifyFilesPage($after: String) {
    files(first: 250, after: $after, query: "media_type:Image") {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          ... on MediaImage { image { url } }
          ... on GenericFile { url mimeType }
        }
      }
    }
  }
`;

async function adminGraphql(query, variables) {
  const res = await fetch(`https://${STORE}/admin/api/${VER}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`);
  }
  return json.data;
}

const map = {};
let after = null;
let pages = 0;

while (pages < 40) {
  pages += 1;
  const data = await adminGraphql(FILES_PAGE_QUERY, { after });
  for (const edge of data.files.edges) {
    const node = edge.node;
    if (node.image?.url) addUrlToMap(map, node.image.url);
    else if (node.url && String(node.mimeType ?? "").startsWith("image/")) addUrlToMap(map, node.url);
  }
  if (!data.files.pageInfo.hasNextPage) break;
  after = data.files.pageInfo.endCursor;
  if (!after) break;
}

const outPath = path.join(repoRoot, "public", "shopify-files.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(map, null, 2)}\n`, "utf-8");
console.log(`Wrote ${Object.keys(map).length} file entries → public/shopify-files.json`);

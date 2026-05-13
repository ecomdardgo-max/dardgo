#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Generate a Shopify-compatible Products CSV from `scripts/products.json`.
 *
 * Output: `scripts/dardgo-products.csv` — upload this file in
 * Shopify admin → Products → Import. No Admin API token required.
 *
 * After import, products carry tags like `category-pain-relief-oils` so smart
 * collections can be created with one rule: "Tag equals category-<handle>".
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, "products.json");
const outPath = path.resolve(__dirname, "dardgo-products.csv");

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Shopify Products CSV header (2024+ schema). Extra fields can be left blank.
const HEADER = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Qty",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Gift Card",
  "SEO Title",
  "SEO Description",
  "Status",
];

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Always wrap in quotes if it contains comma, quote, or newline.
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const rows = [HEADER];

for (const p of data.products) {
  // Build tag list — include category tags so smart collections can match.
  const categoryTags = (p.collections || []).map((h) => `category-${h}`);
  const allTags = [...(p.tags || []), ...categoryTags].join(", ");

  const images = (p.imageUrls || []).filter(Boolean);
  const inventoryQty = p.inventoryQuantity ?? 50;
  const inventoryPolicy = p.available === false ? "deny" : "deny";
  const status = "active";

  // Each product is one row even with multiple images: extra image rows
  // would only need the Handle + Image columns. Skipped here for simplicity
  // since product image URLs are blank by default — fill imageUrls in
  // products.json then re-run if you want them included.

  rows.push([
    p.handle,
    p.title,
    `<p>${p.description}</p>`,
    p.vendor || "DARDGO",
    "", // Product Category — auto
    p.productType || "Ayurvedic",
    allTags,
    "TRUE",
    "Title",
    "Default Title",
    p.handle.toUpperCase().slice(0, 24), // SKU — synthesised from handle
    "100", // Variant Grams (rough estimate — edit per product)
    "shopify",
    String(inventoryQty),
    inventoryPolicy,
    "manual",
    p.price.toFixed(2),
    p.compareAtPrice ? p.compareAtPrice.toFixed(2) : "",
    "TRUE",
    "TRUE",
    images[0] || "",
    images[0] ? "1" : "",
    images[0] ? p.title : "",
    "FALSE",
    p.title,
    p.description.slice(0, 160),
    status,
  ]);

  // Additional image rows (Handle + Image Src/Position only, rest blank).
  for (let i = 1; i < images.length; i++) {
    const blank = HEADER.map(() => "");
    blank[HEADER.indexOf("Handle")] = p.handle;
    blank[HEADER.indexOf("Image Src")] = images[i];
    blank[HEADER.indexOf("Image Position")] = String(i + 1);
    blank[HEADER.indexOf("Image Alt Text")] = p.title;
    rows.push(blank);
  }
}

const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\r\n");
fs.writeFileSync(outPath, csv, "utf-8");

console.log(`\n✓ Generated CSV with ${data.products.length} products`);
console.log(`  → ${outPath}\n`);
console.log("Next steps:");
console.log("  1. Open  https://admin.shopify.com/store/dardgo-aura-lsiqw/products");
console.log('  2. Click "Import" → "Add file" → choose dardgo-products.csv');
console.log('  3. Click "Upload and continue" → Confirm import\n');

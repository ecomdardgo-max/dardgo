#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Builds a Shopify Admin product import CSV from Product Details.csv
 * using the same columns as product_template.csv (Shopify sample export).
 *
 *   node scripts/build-shopify-import-csv.mjs
 * Output: shopify-import-from-product-details.csv (repo root)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** Minimal RFC4180-style CSV parser (matches seed script). */
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

function escapeCsvField(val) {
  const s = String(val ?? "");
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
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

function inferTags({ productCategory, type, title }) {
  const cat = (productCategory || "").toLowerCase();
  const t = (type || "").toLowerCase();
  const ttl = (title || "").toLowerCase();
  const tags = ["Ayurvedic", "csv-import"];

  if (ttl.includes("roll-on") || cat.includes("massage") || t.includes("roll-on")) {
    tags.push("category-pain-relief-oils");
  } else if (
    cat.includes("hair care") ||
    t === "shampoo" ||
    (t === "oil" && (cat.includes("hair") || ttl.includes("hair")))
  ) {
    tags.push("category-ayurvedic-beauty");
  } else if (t.includes("capsule")) tags.push("category-ayurvedic-capsules");
  else if (t.includes("tablet")) tags.push("category-ayurvedic-tablets");
  else if (t.includes("malt") || ttl.includes("halwa")) tags.push("category-ayurvedic-halwa");
  else if (t.includes("powder")) tags.push("category-ayurvedic-powder");
  else if (
    t.includes("cream") ||
    t.includes("syrup") ||
    cat.includes("skin care") ||
    cat.includes("oral care")
  ) {
    tags.push("category-ayurvedic-beauty");
  } else if (t.includes("pain relief oil") || (t.includes("oil") && cat.includes("massage"))) {
    tags.push("category-pain-relief-oils");
  } else if (t.includes("oil")) tags.push("category-pain-relief-oils");
  else tags.push("category-ayurvedic-tablets");

  return [...new Set(tags)].join(", ");
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
    throw new Error("Product Details.csv — missing expected columns.");
  }

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

function rowFromTemplate(headers, data) {
  const map = Object.fromEntries(headers.map((h) => [h, ""]));
  for (const [k, v] of Object.entries(data)) {
    if (k in map) map[k] = v;
  }
  return headers.map((h) => escapeCsvField(map[h]));
}

function buildRows(headers, groups, handleUsed) {
  const rows = [];

  for (const group of groups) {
    let handle = slugify(group.title);
    if (!handle) handle = slugify(group.variants[0]?.sku || "product");
    if (handleUsed.has(handle)) {
      handle = `${handle}-${slugify(group.variants[0].sku)}`.slice(0, 100);
    }
    handleUsed.add(handle);

    const tags = inferTags({
      productCategory: group.category,
      type: group.type,
      title: group.title,
    });
    const desc = `<p>${group.title.replace(/</g, "")}</p>`;
    const published = "TRUE";
    const status = "Active";
    const optNameCol = group.optionName || "Size";

    group.variants.forEach((v, i) => {
      const isFirst = i === 0;
      const priceStr = v.price.toFixed(2);
      const gramsStr = v.grams > 0 ? String(Math.round(v.grams)) : "";

      const commonVariant = {
        SKU: v.sku,
        Barcode: "",
        "Option1 name": isFirst ? optNameCol : "",
        "Option1 value": v.optionValue,
        "Option1 Linked To": "",
        "Option2 name": "",
        "Option2 value": "",
        "Option2 Linked To": "",
        "Option3 name": "",
        "Option3 value": "",
        "Option3 Linked To": "",
        Price: priceStr,
        "Compare-at price": "",
        "Cost per item": "",
        "Charge tax": "TRUE",
        "Tax code": "",
        "Unit price total measure": "",
        "Unit price total measure unit": "",
        "Unit price base measure": "",
        "Unit price base measure unit": "",
        "Inventory tracker": "shopify",
        "Inventory quantity": "50",
        "Continue selling when out of stock": "DENY",
        "Weight value (grams)": gramsStr,
        "Weight unit for display": "g",
        "Requires shipping": "TRUE",
        "Fulfillment service": "manual",
        "Product image URL": "",
        "Image position": "",
        "Image alt text": "",
        "Variant image URL": "",
        "Gift card": "FALSE",
      };

      if (isFirst) {
        rows.push(
          rowFromTemplate(headers, {
            Title: group.title,
            "URL handle": handle,
            Description: desc,
            Vendor: group.brand,
            "Product category": group.category,
            Type: group.type || "Ayurvedic",
            Tags: tags,
            "Published on online store": published,
            Status: status,
            "SEO title": group.title.slice(0, 70),
            "SEO description": group.title.slice(0, 320),
            ...commonVariant,
          }),
        );
      } else {
        rows.push(
          rowFromTemplate(headers, {
            Title: "",
            "URL handle": handle,
            Description: "",
            Vendor: "",
            "Product category": "",
            Type: "",
            Tags: "",
            "Published on online store": "",
            Status: "",
            "SEO title": "",
            "SEO description": "",
            ...commonVariant,
          }),
        );
      }
    });
  }

  return rows;
}

function main() {
  const templatePath = path.join(ROOT, "product_template.csv");
  const detailsPath = path.join(ROOT, "Product Details.csv");
  const outPath = path.join(ROOT, "shopify-import-from-product-details.csv");

  if (!fs.existsSync(templatePath)) {
    console.error("Missing product_template.csv at repo root.");
    process.exit(1);
  }
  if (!fs.existsSync(detailsPath)) {
    console.error("Missing Product Details.csv at repo root.");
    process.exit(1);
  }

  const templateRows = parseCsvRows(fs.readFileSync(templatePath, "utf-8"));
  const headers = templateRows[0].map((h) => h.trim().replace(/^\ufeff/, ""));

  const groups = parseProductDetailsCsv(detailsPath);
  const handleUsed = new Set();
  const dataRows = buildRows(headers, groups, handleUsed);

  const lines = [
    headers.map(escapeCsvField).join(","),
    ...dataRows.map((cells) => cells.join(",")),
  ];
  fs.writeFileSync(outPath, lines.join("\r\n"), "utf-8");

  console.log(`Wrote ${outPath}`);
  console.log(`  Products: ${groups.length}, variant rows: ${dataRows.length}`);
}

main();

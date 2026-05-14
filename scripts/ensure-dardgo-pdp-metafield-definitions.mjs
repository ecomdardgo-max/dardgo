#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Creates Shopify **product** metafield definitions used by the PDP tabs on
 * dardgo.in (see `src/lib/product-pdp-tabs.ts` + Storefront query in `shopify.ts`).
 *
 * This uses the **Admin GraphQL API** (not Storefront). Dev MCP alone cannot
 * mutate your store — run this script with a Custom App admin token.
 *
 * Env (same pattern as `seed-shopify.mjs` — load `.env.local`):
 *   SHOPIFY_STORE_DOMAIN or VITE_SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_TOKEN   (shpat_…)
 *   SHOPIFY_API_VERSION     optional, default 2025-07
 *
 * Required Admin scopes (Custom App → API scopes):
 *   read_products, write_products
 *   If `metafieldDefinitionCreate` returns ACCESS_DENIED, open the app config,
 *   enable every metafield / “definitions” scope shown, **Save**, then **Reinstall**
 *   the app so the token includes them.
 *
 * Run:  npm run ensure:pdp-metafields
 *
 * Idempotent: if a definition already exists, Shopify returns a userError and we skip.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION =
  process.env.SHOPIFY_API_VERSION || process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error(
    "\n[ensure-pdp-metafields] Missing SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_TOKEN in .env.local\n",
  );
  process.exit(1);
}

const ADMIN_GRAPHQL_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

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
    throw new Error(`Admin GraphQL ${res.status}: ${text.slice(0, 800)}`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    const denied = json.errors.some((e) => e.extensions?.code === "ACCESS_DENIED");
    if (denied) {
      throw new Error(
        [
          "ACCESS_DENIED on metafieldDefinitionCreate — the Admin token is not allowed to create these definitions.",
          "Fixes to try:",
          "  • Use the Custom app Admin API access token (shpat_…), not a Storefront token.",
          "  • In Shopify Admin → Settings → Apps → your app: enable read_products + write_products, Save, then reinstall the app so the token is reissued.",
          "  • Or add definitions manually: Settings → Custom data → Products (namespace dardgo, keys pdp_tabs, key_ingredients, how_to_use, benefits, suitable_for, storage_safety, faqs).",
          "Docs: https://shopify.dev/docs/apps/build/metafields/definitions",
          `Raw: ${JSON.stringify(json.errors)}`,
        ].join("\n"),
      );
    }
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const METAFIELD_DEFINITION_CREATE = /* GraphQL */ `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        namespace
        key
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const DEFINITIONS = [
  {
    name: "DARDGO PDP — all tabs (JSON)",
    namespace: "dardgo",
    key: "pdp_tabs",
    description:
      "Single JSON for Key ingredients, How to use, Benefits, Suitable for, Storage & safety, FAQs. Storefront must read this.",
    type: "json",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "DARDGO PDP — key ingredients (JSON)",
    namespace: "dardgo",
    key: "key_ingredients",
    description:
      "JSON array of { name, emoji?, desc? }. Optional if using combined pdp_tabs only.",
    type: "json",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "DARDGO PDP — how to use",
    namespace: "dardgo",
    key: "how_to_use",
    description: "JSON string array, OR plain multi-line text (one step per line).",
    type: "multi_line_text_field",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "DARDGO PDP — benefits (JSON)",
    namespace: "dardgo",
    key: "benefits",
    description: "JSON array of { title, desc }.",
    type: "json",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "DARDGO PDP — suitable for",
    namespace: "dardgo",
    key: "suitable_for",
    description: "JSON string array, OR one bullet per line as plain text.",
    type: "multi_line_text_field",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "DARDGO PDP — storage & safety (JSON)",
    namespace: "dardgo",
    key: "storage_safety",
    description: "JSON array of { title, body }.",
    type: "json",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "DARDGO PDP — FAQs (JSON)",
    namespace: "dardgo",
    key: "faqs",
    description: "JSON array of { q, a }.",
    type: "json",
    ownerType: "PRODUCT",
    access: { storefront: "PUBLIC_READ" },
  },
];

function isAlreadyExists(errors) {
  if (!errors?.length) return false;
  return errors.some(
    (e) =>
      String(e.message || "")
        .toLowerCase()
        .includes("taken") ||
      String(e.code || "").includes("TAKEN") ||
      String(e.message || "")
        .toLowerCase()
        .includes("already"),
  );
}

async function main() {
  console.log(`[ensure-pdp-metafields] Store ${STORE_DOMAIN}  API ${API_VERSION}\n`);

  for (const def of DEFINITIONS) {
    const data = await adminGraphql(METAFIELD_DEFINITION_CREATE, { definition: def });
    const payload = data?.metafieldDefinitionCreate;
    const errs = payload?.userErrors || [];
    const created = payload?.createdDefinition;

    if (!created) {
      if (errs.length && isAlreadyExists(errs)) {
        console.log(`  skip (exists)  ${def.namespace}.${def.key}`);
      } else if (errs.length) {
        console.error(`  FAIL ${def.namespace}.${def.key}:`, JSON.stringify(errs, null, 2));
        process.exitCode = 1;
      } else {
        console.error(`  FAIL ${def.namespace}.${def.key}: no createdDefinition and no userErrors`);
        process.exitCode = 1;
      }
      await sleep(200);
      continue;
    }
    console.log(`  OK  ${created.namespace}.${created.key}  id=${created.id}`);
    await sleep(350);
  }

  console.log(`
Next steps:
  1. In Admin → each product → Metafields: fill dardgo.pdp_tabs (JSON) OR the per-tab dardgo.* fields.
  2. Legacy custom.dardgo_* keys still work if you already use them (see src/lib/product-pdp-tabs.ts).
  3. Rebuild / refresh the storefront after saving products.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

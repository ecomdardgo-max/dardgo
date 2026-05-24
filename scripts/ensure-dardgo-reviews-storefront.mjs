#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Ensure custom.dardgo_reviews is readable on Storefront API (PUBLIC_READ).
 * Run: npm run ensure:reviews-storefront
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}
loadEnvFile(path.join(__dirname, "..", ".env"));
loadEnvFile(path.join(__dirname, "..", ".env.local"));

const STORE = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN = process.env.SHOPIFY_ADMIN_TOKEN;
const VER = process.env.SHOPIFY_API_VERSION || process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

if (!STORE || !ADMIN) {
  console.error("Need SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_TOKEN");
  process.exit(1);
}

const GQL = `https://${STORE}/admin/api/${VER}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const CREATE = `
  mutation($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id namespace key access { storefront } }
      userErrors { message code }
    }
  }
`;

const UPDATE = `
  mutation($definition: MetafieldDefinitionUpdateInput!) {
    metafieldDefinitionUpdate(definition: $definition) {
      updatedDefinition { id namespace key access { storefront } }
      userErrors { message code }
    }
  }
`;

const FIND = `
  query {
    metafieldDefinitions(first: 20, ownerType: PRODUCT, namespace: "custom", key: "dardgo_reviews") {
      edges {
        node {
          id
          namespace
          key
          access { storefront }
        }
      }
    }
  }
`;

async function main() {
  console.log(`Store: ${STORE}\n`);

  let existing = null;
  try {
    const data = await gql(FIND);
    existing = data.metafieldDefinitions?.edges?.[0]?.node ?? null;
  } catch (e) {
    console.warn("Could not list definitions (token may need read access). Trying create…\n", e.message);
  }

  if (existing) {
    console.log("Found:", existing.namespace + "." + existing.key, "storefront:", existing.access?.storefront);
    if (existing.access?.storefront === "PUBLIC_READ") {
      console.log("Already PUBLIC_READ — storefront can read reviews.");
      return;
    }
    const data = await gql(UPDATE, {
      definition: {
        namespace: "custom",
        key: "dardgo_reviews",
        ownerType: "PRODUCT",
        access: { storefront: "PUBLIC_READ" },
      },
    });
    const errs = data.metafieldDefinitionUpdate?.userErrors ?? [];
    if (errs.length) {
      console.error("Update failed:", errs);
      process.exit(1);
    }
    console.log("Updated to PUBLIC_READ:", data.metafieldDefinitionUpdate?.updatedDefinition);
    return;
  }

  const data = await gql(CREATE, {
    definition: {
      name: "DARDGO product reviews JSON",
      namespace: "custom",
      key: "dardgo_reviews",
      description: "Judge.me sync — review text for headless PDP",
      type: "json",
      ownerType: "PRODUCT",
      access: { storefront: "PUBLIC_READ" },
    },
  });
  const errs = data.metafieldDefinitionCreate?.userErrors ?? [];
  if (errs.some((e) => String(e.message).toLowerCase().includes("taken"))) {
    console.log("Definition exists — in Admin: Settings → Custom data → Products → dardgo_reviews → Storefront access: Read");
    return;
  }
  if (errs.length) {
    console.error("Create failed:", errs);
    process.exit(1);
  }
  console.log("Created:", data.metafieldDefinitionCreate?.createdDefinition);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

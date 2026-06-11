/**
 * Write public/sitemap.xml + public/robots.txt for static hosting fallback.
 * Live site also serves dynamic /sitemap.xml from Nitro (Shopify products/collections).
 *
 *   npm run generate:sitemap
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

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

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

function loadBlogSlugs() {
  const src = fs.readFileSync(path.join(root, "src/content/dardgoBlogPosts.ts"), "utf8");
  const slugs = [];
  for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) {
    slugs.push(m[1]);
  }
  return [...new Set(slugs)];
}

let origin = (
  process.env.SITE_URL ||
  process.env.VITE_PUBLIC_APP_URL ||
  "https://www.dardgo.in"
)
  .trim()
  .replace(/\/$/, "");
if (/\.myshopify\.com$/i.test(new URL(origin).hostname)) {
  origin = "https://www.dardgo.in";
}

const today = new Date().toISOString().slice(0, 10);

const staticPaths = [
  "/",
  "/categories",
  "/about",
  "/blog",
  "/contact",
  "/faqs",
  "/bulk-order",
  "/points-of-sale",
  "/privacy-policy",
  "/terms-conditions",
  "/shipping-delivery",
  "/returns-refund",
  "/medical-disclaimer",
  "/disclaimer",
];

function xmlEscape(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function fetchShopifyHandles() {
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  const version = process.env.VITE_SHOPIFY_API_VERSION || "2025-07";
  if (!domain || !token) return { products: [], collections: [] };

  const gql = async (query, variables = {}) => {
    const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  };

  const products = [];
  let cursor = null;
  for (let i = 0; i < 20; i++) {
    const data = await gql(
      `query($cursor: String) {
        products(first: 250, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges { node { handle updatedAt } }
        }
      }`,
      { cursor },
    );
    products.push(...data.products.edges.map((e) => e.node));
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }

  const colData = await gql(`{
    collections(first: 100) { edges { node { handle updatedAt } } }
  }`);
  const collections = colData.collections.edges.map((e) => e.node);

  return { products, collections };
}

const blogSlugs = loadBlogSlugs();

const urls = staticPaths.map((p) => ({
  loc: `${origin}${p}`,
  lastmod: today,
}));

for (const slug of blogSlugs) {
  urls.push({ loc: `${origin}/blog/${slug}`, lastmod: today });
}

try {
  const { products, collections } = await fetchShopifyHandles();
  for (const p of products) {
    urls.push({
      loc: `${origin}/product/${p.handle}`,
      lastmod: p.updatedAt?.slice(0, 10) ?? today,
    });
  }
  for (const c of collections) {
    urls.push({
      loc: `${origin}/collections/${c.handle}`,
      lastmod: c.updatedAt?.slice(0, 10) ?? today,
    });
  }
  console.log(`[generate-sitemap] Shopify: ${products.length} products, ${collections.length} collections`);
} catch (err) {
  console.warn("[generate-sitemap] Shopify fetch skipped:", err.message);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /account/callback

Sitemap: ${origin}/sitemap.xml
`;

const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");

console.log(`[generate-sitemap] Wrote ${urls.length} URLs → public/sitemap.xml`);
console.log(`[generate-sitemap] Origin: ${origin}`);

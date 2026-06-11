import { dardgoBlogPostsMeta } from "../../src/content/dardgoBlogPosts";

export type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const STATIC_PATHS: Array<{
  path: string;
  changefreq?: SitemapUrl["changefreq"];
  priority?: number;
}> = [
  { path: "/", changefreq: "daily", priority: 1 },
  { path: "/categories", changefreq: "weekly", priority: 0.9 },
  { path: "/about", changefreq: "monthly", priority: 0.7 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.6 },
  { path: "/faqs", changefreq: "monthly", priority: 0.6 },
  { path: "/bulk-order", changefreq: "monthly", priority: 0.6 },
  { path: "/points-of-sale", changefreq: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms-conditions", changefreq: "yearly", priority: 0.3 },
  { path: "/shipping-delivery", changefreq: "yearly", priority: 0.3 },
  { path: "/returns-refund", changefreq: "yearly", priority: 0.3 },
  { path: "/medical-disclaimer", changefreq: "yearly", priority: 0.3 },
  { path: "/disclaimer", changefreq: "yearly", priority: 0.3 },
];

export function getSiteOrigin(): string {
  const fromEnv =
    process.env.SITE_URL ||
    process.env.VITE_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  let origin = (fromEnv || "https://www.dardgo.in").trim().replace(/\/$/, "");
  // Customer-account env may point at *.myshopify.com — sitemap must use the headless storefront domain.
  if (/\.myshopify\.com$/i.test(new URL(origin).hostname)) {
    origin = "https://www.dardgo.in";
  }
  return origin;
}

function toIsoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function storefrontGraphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const domain =
    process.env.VITE_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  const version = process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

  if (!domain || !token) {
    throw new Error("Shopify Storefront API not configured for sitemap");
  }

  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify GraphQL HTTP ${res.status}`);
  }

  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Shopify GraphQL returned no data");
  }
  return json.data;
}

async function fetchAllProductHandles(): Promise<Array<{ handle: string; updatedAt?: string }>> {
  const out: Array<{ handle: string; updatedAt?: string }> = [];
  let cursor: string | null = null;

  const query = `
    query SitemapProducts($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  `;

  for (let i = 0; i < 20; i++) {
    const data = await storefrontGraphql<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: Array<{ node: { handle: string; updatedAt?: string } }>;
      };
    }>(query, { cursor });

    for (const edge of data.products.edges) {
      if (edge.node.handle) out.push(edge.node);
    }

    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
    if (!cursor) break;
  }

  return out;
}

async function fetchAllCollectionHandles(): Promise<Array<{ handle: string; updatedAt?: string }>> {
  const query = `
    query SitemapCollections {
      collections(first: 100) {
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  `;

  const data = await storefrontGraphql<{
    collections: { edges: Array<{ node: { handle: string; updatedAt?: string } }> };
  }>(query);

  return data.collections.edges.map((e) => e.node).filter((n) => n.handle);
}

export async function buildSitemapUrls(): Promise<SitemapUrl[]> {
  const origin = getSiteOrigin();
  const today = new Date().toISOString().slice(0, 10);
  const urls: SitemapUrl[] = [];

  for (const item of STATIC_PATHS) {
    urls.push({
      loc: `${origin}${item.path}`,
      lastmod: today,
      changefreq: item.changefreq,
      priority: item.priority,
    });
  }

  for (const post of dardgoBlogPostsMeta) {
    urls.push({
      loc: `${origin}/blog/${post.slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.6,
    });
  }

  try {
    const [products, collections] = await Promise.all([
      fetchAllProductHandles(),
      fetchAllCollectionHandles(),
    ]);

    for (const product of products) {
      urls.push({
        loc: `${origin}/product/${product.handle}`,
        lastmod: toIsoDate(product.updatedAt) ?? today,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    for (const collection of collections) {
      urls.push({
        loc: `${origin}/collections/${collection.handle}`,
        lastmod: toIsoDate(collection.updatedAt) ?? today,
        changefreq: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    /* Shopify optional at build time — static + blog URLs still emitted */
  }

  return urls;
}

function serializeSitemapXml(urls: SitemapUrl[]): string {
  const body = urls
    .map((u) => {
      const parts = [`    <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`    <lastmod>${escapeXml(u.lastmod)}</lastmod>`);
      if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority != null) parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export async function buildSitemapXml(): Promise<string> {
  const urls = await buildSitemapUrls();
  return serializeSitemapXml(urls);
}

export function buildRobotsTxt(): string {
  const origin = getSiteOrigin();
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /cart",
    "Disallow: /checkout",
    "Disallow: /account",
    "Disallow: /account/callback",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
}

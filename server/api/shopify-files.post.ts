/**
 * Resolve ingredient filenames via Shopify Admin Files API (server-only).
 * POST { filenames: string[] } → { urls: Record<stem, cdnUrl> }
 */
import { defineEventHandler, readBody } from "nitro/h3";

type CacheEntry = { map: Record<string, string>; builtAt: number };

const CACHE_TTL_MS = 30 * 60 * 1000;
let fileStemCache: CacheEntry | null = null;

function normalizeStem(filename: string): { full: string; stem: string } {
  const full = filename.trim().toLowerCase();
  const stem = full
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/(_+\d+x\d+|_\d+x)+$/i, "");
  return { full, stem };
}

function stemFromUrl(url: string): string {
  try {
    const base = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "").toLowerCase();
    return normalizeStem(base).stem;
  } catch {
    return "";
  }
}

function addUrlToMap(map: Record<string, string>, url: string) {
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

async function adminGraphql<T>(
  store: string,
  token: string,
  apiVersion: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`https://${store}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Shopify Admin HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new Error("Shopify Admin returned no data");
  return json.data;
}

const FILES_PAGE_QUERY = `
  query ShopifyFilesPage($after: String) {
    files(first: 250, after: $after, query: "media_type:Image") {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on MediaImage {
            image {
              url
            }
          }
          ... on GenericFile {
            url
            mimeType
          }
        }
      }
    }
  }
`;

async function buildShopifyFilesStemMap(
  store: string,
  token: string,
  apiVersion: string,
): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  let after: string | null = null;
  let pages = 0;

  while (pages < 40) {
    pages += 1;
    const data = await adminGraphql<{
      files: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: Array<{
          node: {
            image?: { url: string | null } | null;
            url?: string | null;
            mimeType?: string | null;
          };
        }>;
      };
    }>(store, token, apiVersion, FILES_PAGE_QUERY, { after });

    for (const edge of data.files.edges) {
      const node = edge.node;
      const imageUrl = node.image?.url ?? null;
      const genericUrl = node.url ?? null;
      const mime = node.mimeType ?? "";
      if (imageUrl) addUrlToMap(map, imageUrl);
      else if (genericUrl && mime.startsWith("image/")) addUrlToMap(map, genericUrl);
    }

    if (!data.files.pageInfo.hasNextPage) break;
    after = data.files.pageInfo.endCursor;
    if (!after) break;
  }

  return map;
}

async function getFilesStemMap(): Promise<Record<string, string>> {
  const now = Date.now();
  if (fileStemCache && now - fileStemCache.builtAt < CACHE_TTL_MS) {
    return fileStemCache.map;
  }

  const store = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const apiVersion =
    process.env.SHOPIFY_API_VERSION || process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

  if (!store || !token) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN on server");
  }

  const map = await buildShopifyFilesStemMap(store, token, apiVersion);
  fileStemCache = { map, builtAt: now };
  return map;
}

function resolveFromMap(filename: string, map: Record<string, string>): string | undefined {
  const { full, stem } = normalizeStem(filename);
  if (map[stem]) return map[stem];
  if (map[full]) return map[full];
  for (const [key, url] of Object.entries(map)) {
    if (key === stem || key.includes(stem) || stem.includes(key)) return url;
  }
  return undefined;
}

export default defineEventHandler(async (event) => {
  let filenames: string[] = [];
  try {
    const body = (await readBody(event)) as { filenames?: unknown };
    if (Array.isArray(body?.filenames)) {
      filenames = body.filenames.filter((f): f is string => typeof f === "string" && f.trim());
    }
  } catch {
    return { error: "Invalid JSON body", urls: {} };
  }

  if (!filenames.length) {
    return { urls: {} };
  }

  try {
    const map = await getFilesStemMap();
    const urls: Record<string, string> = {};
    for (const filename of filenames) {
      const url = resolveFromMap(filename, map);
      if (url) {
        const { stem, full } = normalizeStem(filename);
        urls[stem] = url;
        urls[full] = url;
      }
    }
    return { urls };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load Shopify files";
    event.node.res.statusCode = 503;
    return { error: message, urls: {} };
  }
});

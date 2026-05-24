import type { PdpKeyIngredient, PdpTabsContent } from "@/lib/product-pdp-tabs";
import {
  normalizeIngredientFilename,
  resolveIngredientImageFromStemMap,
} from "@/lib/ingredient-image-match";

/** Filenames still missing a resolved CDN URL after product gallery matching. */
export function getPendingIngredientFilenames(ingredients: PdpKeyIngredient[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ing of ingredients) {
    if (ing.imageUrl || !ing.imageFilename) continue;
    const key = ing.imageFilename.trim();
    if (!key || seen.has(key.toLowerCase())) continue;
    seen.add(key.toLowerCase());
    out.push(key);
  }
  return out;
}

export function applyShopifyContentFileUrls(
  tabs: PdpTabsContent,
  fileUrlMap: Record<string, string>,
): PdpTabsContent {
  if (!Object.keys(fileUrlMap).length) return tabs;

  const keyIngredients = tabs.keyIngredients.map((ing) => {
    if (ing.imageUrl || !ing.imageFilename) return ing;
    const url = resolveIngredientImageFromStemMap(ing.imageFilename, fileUrlMap);
    return url ? { ...ing, imageUrl: url } : ing;
  });

  return { ...tabs, keyIngredients };
}

let manifestCache: Record<string, string> | null = null;
let manifestPromise: Promise<Record<string, string>> | null = null;

async function loadStaticManifest(): Promise<Record<string, string>> {
  if (manifestCache) return manifestCache;
  if (manifestPromise) return manifestPromise;

  manifestPromise = fetch("/shopify-files.json", { cache: "force-cache" })
    .then(async (res) => {
      if (!res.ok) return {};
      const data = (await res.json()) as Record<string, string>;
      manifestCache = data;
      return data;
    })
    .catch(() => ({}))
    .finally(() => {
      manifestPromise = null;
    });

  return manifestPromise;
}

function pickFromMap(filenames: string[], map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const filename of filenames) {
    const url = resolveIngredientImageFromStemMap(filename, map);
    if (url) {
      const { stem } = normalizeIngredientFilename(filename);
      out[stem] = url;
      out[filename.trim().toLowerCase()] = url;
    }
  }
  return out;
}

/**
 * Resolve ingredient image filenames from Shopify Content → Files.
 * Uses static manifest (`public/shopify-files.json`) when present, then `/api/shopify-files`.
 */
export async function fetchShopifyContentFileUrlMap(
  filenames: string[],
): Promise<Record<string, string>> {
  const unique = [...new Set(filenames.map((f) => f.trim()).filter(Boolean))];
  if (!unique.length) return {};

  const manifest = await loadStaticManifest();
  const fromManifest = pickFromMap(unique, manifest);
  const stillMissing = unique.filter(
    (fn) => !resolveIngredientImageFromStemMap(fn, fromManifest),
  );
  if (!stillMissing.length) return fromManifest;

  try {
    const res = await fetch("/api/shopify-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filenames: stillMissing }),
    });
    if (!res.ok) return fromManifest;
    const data = (await res.json()) as { urls?: Record<string, string> };
    return { ...fromManifest, ...(data.urls ?? {}) };
  } catch {
    return fromManifest;
  }
}

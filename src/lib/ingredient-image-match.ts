export const INGREDIENT_IMAGE_FILENAME_RE = /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i;

export function normalizeIngredientFilename(filename: string): { full: string; stem: string } {
  const full = filename.trim().toLowerCase();
  const stem = full
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/(_+\d+x\d+|_\d+x)+$/i, "");
  return { full, stem };
}

export function urlBasename(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function urlStem(url: string): string {
  return normalizeIngredientFilename(urlBasename(url)).stem;
}

export function resolveIngredientImageFromUrls(
  filename: string,
  imageUrls: string[],
): string | undefined {
  const raw = filename.trim();
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("//")) return raw;

  const { full, stem } = normalizeIngredientFilename(raw);
  if (!stem) return undefined;

  for (const url of imageUrls) {
    const base = urlBasename(url);
    const pathStem = urlStem(url);
    if (
      base === full ||
      pathStem === stem ||
      base.startsWith(`${stem}.`) ||
      pathStem.startsWith(stem)
    ) {
      return url;
    }
    try {
      const path = decodeURIComponent(new URL(url).pathname).toLowerCase();
      if (path.includes(stem)) return url;
    } catch {
      if (url.toLowerCase().includes(stem)) return url;
    }
  }
  return undefined;
}

/** Resolve a metafield filename against a stem → CDN URL map (Shopify Files / manifest). */
export function resolveIngredientImageFromStemMap(
  filename: string,
  stemMap: Record<string, string>,
): string | undefined {
  const raw = filename.trim();
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("//")) return raw;

  const { full, stem } = normalizeIngredientFilename(raw);
  if (stemMap[stem]) return stemMap[stem];
  if (stemMap[full]) return stemMap[full];

  for (const [key, url] of Object.entries(stemMap)) {
    if (key === stem || key === full || key.includes(stem) || stem.includes(key)) return url;
  }
  return undefined;
}

export function isIngredientImageFilename(value: string): boolean {
  const t = value.trim();
  return INGREDIENT_IMAGE_FILENAME_RE.test(t) || /^[\w.-]+\.(jpe?g|png|webp|gif|avif|svg)$/i.test(t);
}

/**
 * Product reviews from Shopify Storefront API metafields.
 *
 * 1) Standard aggregate (many review apps sync these — expose to Storefront in Admin → Settings → Custom data → Products):
 *    - namespace `reviews`, key `rating`     (type `rating`, JSON value)
 *    - namespace `reviews`, key `rating_count` (integer as string)
 *
 * 2) Optional list for this headless UI (create a Product metafield definition):
 *    - namespace `custom`, key `dardgo_reviews`, type JSON (list of objects)
 *    Example value:
 *    [
 *      {
 *        "name": "Rahul S.",
 *        "rating": 5,
 *        "title": "Great relief",
 *        "text": "Helped with knee discomfort.",
 *        "date": "2024-11-08",
 *        "helpful": 3,
 *        "verified": true
 *      }
 *    ]
 */

export type ParsedShopifyReview = {
  name: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  helpful: number;
  verified: boolean;
};

export type ProductReviewHistogramRow = { stars: 5 | 4 | 3 | 2 | 1; count: number };

export type ProductReviewState = {
  averageRating: number | null;
  totalCount: number;
  reviews: ParsedShopifyReview[];
  histogram: ProductReviewHistogramRow[];
};

function metafieldMap(metafields: unknown): Map<string, { value: string; type: string }> {
  const map = new Map<string, { value: string; type: string }>();
  if (!Array.isArray(metafields)) return map;
  for (const m of metafields) {
    if (!m || typeof m !== "object") continue;
    const row = m as { namespace?: string; key?: string; value?: string; type?: string };
    if (row.namespace && row.key && row.value != null) {
      map.set(`${row.namespace}.${row.key}`, {
        value: String(row.value),
        type: String(row.type ?? ""),
      });
    }
  }
  return map;
}

function parseStandardRating(value: string): number | null {
  if (!value?.trim()) return null;
  try {
    const j = JSON.parse(value) as { value?: string | number };
    if (j && typeof j.value === "number" && Number.isFinite(j.value)) return j.value;
    if (j && typeof j.value === "string") {
      const n = parseFloat(j.value);
      return Number.isFinite(n) ? n : null;
    }
  } catch {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function parseRatingCount(value: string): number {
  if (!value?.trim()) return 0;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function clampRating(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function parseReviewsJson(raw: string | undefined): ParsedShopifyReview[] {
  if (!raw?.trim()) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    const out: ParsedShopifyReview[] = [];
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const name =
        String(o.name ?? o.author ?? o.author_display_name ?? "Customer").trim() || "Customer";
      const rating = typeof o.rating === "number" ? o.rating : parseFloat(String(o.rating ?? 0));
      const title = String(o.title ?? "").trim();
      const text = String(o.text ?? o.body ?? "").trim();
      const date = String(o.date ?? o.created_at ?? o.submitted_at ?? "").trim();
      const helpful =
        typeof o.helpful === "number" && Number.isFinite(o.helpful)
          ? Math.max(0, Math.floor(o.helpful))
          : 0;
      const verified = Boolean(o.verified ?? o.verified_buyer);
      if (!Number.isFinite(rating) || rating < 1) continue;
      out.push({
        name,
        rating: Math.min(5, Math.max(1, rating)),
        title: title || "Review",
        text: text || "—",
        date: date || "—",
        helpful,
        verified,
      });
    }
    return out;
  } catch {
    return [];
  }
}

function buildHistogram(reviews: ParsedShopifyReview[]): ProductReviewHistogramRow[] {
  const bins = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const k = clampRating(r.rating) as keyof typeof bins;
    bins[k]++;
  }
  return ([5, 4, 3, 2, 1] as const).map((stars) => ({ stars, count: bins[stars] }));
}

/** Derive average from review list when standard rating metafield is missing. */
function averageFromList(reviews: ParsedShopifyReview[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / reviews.length) * 100) / 100;
}

export function parseProductReviewState(
  product: {
    metafields?: unknown;
  } | null,
): ProductReviewState {
  if (!product) {
    return {
      averageRating: null,
      totalCount: 0,
      reviews: [],
      histogram: [5, 4, 3, 2, 1].map((stars) => ({ stars: stars as 5 | 4 | 3 | 2 | 1, count: 0 })),
    };
  }

  const map = metafieldMap(product.metafields);
  const ratingMf = map.get("reviews.rating");
  const countMf = map.get("reviews.rating_count");
  const listMf = map.get("custom.dardgo_reviews");

  const aggregateRating = ratingMf ? parseStandardRating(ratingMf.value) : null;
  let totalCount = countMf ? parseRatingCount(countMf.value) : 0;
  const reviews = parseReviewsJson(listMf?.value);

  if (totalCount === 0 && reviews.length > 0) {
    totalCount = reviews.length;
  }

  const averageRating =
    aggregateRating != null ? Math.round(aggregateRating * 100) / 100 : averageFromList(reviews);

  const histogram = buildHistogram(reviews);
  const histTotal = histogram.reduce((a, h) => a + h.count, 0);

  if (histTotal === 0 && totalCount > 0 && averageRating != null) {
    // Aggregate only (no per-review JSON): show empty histogram — UI can hide bars.
    return {
      averageRating,
      totalCount,
      reviews: [],
      histogram: [5, 4, 3, 2, 1].map((stars) => ({ stars: stars as 5 | 4 | 3 | 2 | 1, count: 0 })),
    };
  }

  return { averageRating, totalCount, reviews, histogram };
}

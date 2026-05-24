import type { ParsedShopifyReview } from "@/lib/shopify-product-reviews";
import { shopifyGidToProductNumericId } from "@/components/JudgeMe";

/** Load review text from Judge.me via server proxy when metafield is empty. */
export async function fetchJudgeMeReviewsForProduct(
  productId: string,
): Promise<ParsedShopifyReview[]> {
  const externalId = shopifyGidToProductNumericId(productId);
  if (!externalId) return [];

  try {
    const res = await fetch(`/api/judgeme-reviews?externalId=${encodeURIComponent(externalId)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { reviews?: ParsedShopifyReview[] };
    return Array.isArray(data.reviews) ? data.reviews : [];
  } catch {
    return [];
  }
}

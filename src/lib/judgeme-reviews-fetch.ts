import type { ParsedShopifyReview } from "@/lib/shopify-product-reviews";
import { shopifyGidToProductNumericId } from "@/components/JudgeMe";

export type JudgeMeReviewsResponse = {
  reviews: ParsedShopifyReview[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/** Load review text from Judge.me via server proxy (works without browser public token). */
export async function fetchJudgeMeReviewsForProduct(
  productId: string,
  options?: { page?: number; perPage?: number; loadAll?: boolean },
): Promise<JudgeMeReviewsResponse> {
  const externalId = shopifyGidToProductNumericId(productId);
  const empty: JudgeMeReviewsResponse = {
    reviews: [],
    total: 0,
    page: 1,
    perPage: options?.perPage ?? 10,
    totalPages: 0,
  };
  if (!externalId) return empty;

  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 10;

  try {
    const params = new URLSearchParams({
      externalId,
      page: String(page),
      perPage: String(perPage),
    });
    if (options?.loadAll) params.set("loadAll", "1");
    const res = await fetch(`/api/judgeme-reviews?${params}`);
    if (!res.ok) return empty;
    const data = (await res.json()) as Partial<JudgeMeReviewsResponse>;
    return {
      reviews: Array.isArray(data.reviews) ? data.reviews : [],
      total: typeof data.total === "number" ? data.total : 0,
      page: typeof data.page === "number" ? data.page : page,
      perPage: typeof data.perPage === "number" ? data.perPage : perPage,
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 0,
    };
  } catch {
    return empty;
  }
}

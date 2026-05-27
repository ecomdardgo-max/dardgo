/**
 * Proxy Judge.me reviews for headless PDP (private token stays server-side).
 * GET /api/judgeme-reviews?externalId=9221650841850&page=1&perPage=10
 */
import { defineEventHandler, getQuery, setResponseStatus } from "nitro/h3";

type ParsedShopifyReview = {
  name: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  helpful: number;
  verified: boolean;
};

type JudgeMeReview = {
  id?: number;
  title?: string | null;
  body?: string | null;
  rating?: number;
  hidden?: boolean;
  curated?: string;
  verified?: string | boolean;
  created_at?: string;
  product_external_id?: number | string;
  reviewer?: { name?: string };
};

function mapReview(r: JudgeMeReview): ParsedShopifyReview | null {
  const rating = Number(r.rating);
  if (!Number.isFinite(rating) || rating < 1) return null;
  const name = String(r.reviewer?.name ?? "Customer").trim() || "Customer";
  const title = String(r.title ?? "").trim() || "Review";
  const text = String(r.body ?? "").trim() || "—";
  const dateRaw = r.created_at ?? "";
  const date = typeof dateRaw === "string" && dateRaw.length >= 10 ? dateRaw.slice(0, 10) : "—";
  return {
    name,
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    title,
    text,
    date,
    helpful: 0,
    verified: r.verified === "buyer" || r.verified === true,
  };
}

function reviewMatchesProduct(r: JudgeMeReview, externalId: string): boolean {
  if (r.product_external_id == null) return false;
  return String(r.product_external_id) === externalId;
}

function isPublishedReview(r: JudgeMeReview): boolean {
  if (!r || r.hidden) return false;
  if (r.curated === "spam") return false;
  return true;
}

async function fetchJudgeMeProductId(
  shop: string,
  token: string,
  externalId: string,
): Promise<number | null> {
  const params = new URLSearchParams({
    shop_domain: shop,
    external_id: externalId,
  });
  const res = await fetch(`https://api.judge.me/api/v1/products/-1?${params}`, {
    headers: { "X-Api-Token": token },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { product?: { id?: number } };
  const id = data.product?.id;
  return typeof id === "number" && Number.isFinite(id) ? id : null;
}

async function fetchAllReviewsForProduct(
  shop: string,
  token: string,
  externalId: string,
  judgeProductId: number | null,
): Promise<JudgeMeReview[]> {
  const all: JudgeMeReview[] = [];
  let page = 1;

  while (page <= 30) {
    const params = new URLSearchParams({
      shop_domain: shop,
      page: String(page),
      per_page: "100",
    });
    if (judgeProductId != null) {
      params.set("product_id", String(judgeProductId));
    } else {
      params.set("product_external_id", externalId);
    }

    const res = await fetch(`https://api.judge.me/api/v1/reviews?${params}`, {
      headers: { "X-Api-Token": token },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Judge.me HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = (await res.json()) as { reviews?: JudgeMeReview[] };
    const batch = Array.isArray(data.reviews) ? data.reviews : [];
    all.push(
      ...batch.filter(
        (r) => isPublishedReview(r) && reviewMatchesProduct(r, externalId),
      ),
    );
    if (batch.length < 100) break;
    page += 1;
  }

  return all;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const externalId = String(query.externalId ?? "").trim();
  const loadAll = String(query.loadAll ?? "") === "1";
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10) || 1);
  const perPage = Math.min(100, Math.max(5, parseInt(String(query.perPage ?? "10"), 10) || 10));

  if (!externalId) {
    setResponseStatus(event, 400);
    return { error: "Missing externalId", reviews: [], total: 0, page: 1, perPage, totalPages: 0 };
  }

  const shop =
    process.env.VITE_JUDGEME_SHOP_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const token = process.env.JUDGEME_API_TOKEN || process.env.JUDGEME_PRIVATE_TOKEN;

  if (!shop || !token) {
    setResponseStatus(event, 503);
    return { error: "Judge.me not configured on server", reviews: [], total: 0, page: 1, perPage, totalPages: 0 };
  }

  try {
    const judgeProductId = await fetchJudgeMeProductId(shop, token, externalId);
    const raw = await fetchAllReviewsForProduct(shop, token, externalId, judgeProductId);
    const mapped = raw
      .map(mapReview)
      .filter((r): r is ParsedShopifyReview => r != null)
      .sort((a, b) => {
        const da = Date.parse(a.date);
        const db = Date.parse(b.date);
        if (Number.isFinite(da) && Number.isFinite(db)) return db - da;
        return String(b.date).localeCompare(String(a.date));
      });

    const total = mapped.length;

    if (loadAll) {
      return { reviews: mapped, total, page: 1, perPage: total, totalPages: total > 0 ? 1 : 0 };
    }

    const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;
    const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
    const start = (safePage - 1) * perPage;
    const reviews = mapped.slice(start, start + perPage);

    return { reviews, total, page: safePage, perPage, totalPages };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Judge.me fetch failed";
    setResponseStatus(event, 500);
    return { error: message, reviews: [], total: 0, page: 1, perPage, totalPages: 0 };
  }
});

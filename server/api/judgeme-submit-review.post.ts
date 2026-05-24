/**
 * Submit a product review to Judge.me (public web review endpoint).
 * POST /api/judgeme-submit-review
 */
import { defineEventHandler, readBody, setResponseStatus } from "nitro/h3";

type SubmitBody = {
  externalId?: string;
  name?: string;
  email?: string;
  rating?: number;
  title?: string;
  reviewBody?: string;
};

export default defineEventHandler(async (event) => {
  const shop =
    process.env.VITE_JUDGEME_SHOP_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN;

  if (!shop) {
    setResponseStatus(event, 503);
    return { ok: false, error: "Shop domain not configured" };
  }

  let body: SubmitBody;
  try {
    body = (await readBody(event)) as SubmitBody;
  } catch {
    setResponseStatus(event, 400);
    return { ok: false, error: "Invalid JSON body" };
  }

  const externalId = String(body.externalId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const title = String(body.title ?? "").trim();
  const reviewBody = String(body.reviewBody ?? "").trim();
  const rating = Number(body.rating);

  if (!externalId) {
    setResponseStatus(event, 400);
    return { ok: false, error: "Missing product id" };
  }
  if (!name || !email) {
    setResponseStatus(event, 400);
    return { ok: false, error: "Name and email are required" };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    setResponseStatus(event, 400);
    return { ok: false, error: "Rating must be 1–5" };
  }
  if (!title) {
    setResponseStatus(event, 400);
    return { ok: false, error: "Review title is required" };
  }
  if (!reviewBody) {
    setResponseStatus(event, 400);
    return { ok: false, error: "Review text is required" };
  }

  const formData = new FormData();
  formData.append("shop_domain", shop);
  formData.append("platform", "shopify");
  formData.append("id", externalId);
  formData.append("email", email);
  formData.append("name", name);
  formData.append("reviewer_name_format", "");
  formData.append("rating", String(rating));
  formData.append("title", title);
  formData.append("body", reviewBody);

  try {
    const res = await fetch("https://api.judge.me/api/v1/reviews", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    let data: { message?: string; error?: string } = {};
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      setResponseStatus(event, 502);
      return {
        ok: false,
        error: data.message || data.error || `Judge.me HTTP ${res.status}`,
      };
    }

    return {
      ok: true,
      message: data.message || "Thank you! Your review was submitted.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submit failed";
    setResponseStatus(event, 500);
    return { ok: false, error: message };
  }
});

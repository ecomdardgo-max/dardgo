/**
 * Shopify order webhook → Meta Conversions API (Purchase).
 * POST /api/shopify-orders-webhook
 *
 * Shopify Admin → Settings → Notifications → Webhooks:
 *   Event: Order payment (orders/paid) — recommended
 *   Format: JSON
 *   URL: https://www.dardgo.in/api/shopify-orders-webhook
 */
import { defineEventHandler, getHeader, setResponseStatus, type H3Event } from "nitro/h3";
import { getShopifyWebhookSecret } from "../lib/shopify-webhook";
import { processShopifyOrderWebhook } from "../lib/shopify-order-webhook-process";
import { readShopifyWebhookRawBody } from "../lib/shopify-webhook";

function clientIpFromHeaders(event: H3Event): string | null {
  const forwarded = getHeader(event, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return getHeader(event, "x-real-ip") ?? null;
}

export default defineEventHandler(async (event) => {
  const secret = getShopifyWebhookSecret();
  if (!secret) {
    setResponseStatus(event, 503);
    return { ok: false, error: "SHOPIFY_WEBHOOK_SECRET not configured" };
  }

  const rawBody = await readShopifyWebhookRawBody(event);
  const result = await processShopifyOrderWebhook(
    rawBody,
    {
      hmac: getHeader(event, "x-shopify-hmac-sha256") ?? null,
      topic: getHeader(event, "x-shopify-topic") ?? null,
      userAgent: getHeader(event, "user-agent") ?? null,
      clientIp: clientIpFromHeaders(event),
    },
    secret,
  );

  if (result.status >= 400) {
    console.warn("[shopify-webhook] Rejected:", result.body.error ?? result.body);
  }

  setResponseStatus(event, result.status);
  return result.body;
});

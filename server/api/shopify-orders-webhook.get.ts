/**
 * Health check for Meta CAPI + Shopify webhook config (no secrets exposed).
 * GET /api/shopify-orders-webhook
 */
import { defineEventHandler } from "nitro/h3";
import { getMetaAccessToken, getMetaPixelId } from "../lib/meta-capi";
import { getShopifyWebhookSecret } from "../lib/shopify-webhook";

export default defineEventHandler(() => {
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  return {
    ok: true,
    handler: "nitro-fallback",
    endpoint: "POST /api/shopify-orders-webhook",
    note: "On Vercel production, api/shopify-orders-webhook.ts handles POST with raw body.",
    meta_pixel_id: getMetaPixelId(),
    meta_access_token_configured: Boolean(getMetaAccessToken()),
    shopify_webhook_secret_configured: Boolean(getShopifyWebhookSecret()),
    meta_test_event_code_configured: Boolean(testCode),
  };
});

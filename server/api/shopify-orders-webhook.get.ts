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
    endpoint: "POST /api/shopify-orders-webhook",
    meta_pixel_id: getMetaPixelId(),
    meta_access_token_configured: Boolean(getMetaAccessToken()),
    shopify_webhook_secret_configured: Boolean(getShopifyWebhookSecret()),
    meta_test_event_code_configured: Boolean(testCode),
    hint: testCode
      ? "Server Purchase events will appear in Meta Test events tab."
      : "Set META_CAPI_TEST_EVENT_CODE=TEST43905 on Vercel to see server Purchase in Test events.",
  };
});

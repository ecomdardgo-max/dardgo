/**
 * Capture Shopify webhook raw body before any handler parses it (Vercel/Nitro).
 */
import { defineEventHandler, readRawBody } from "nitro/h3";

export default defineEventHandler(async (event) => {
  const path = event.path ?? "";
  if (event.method !== "POST" || !path.includes("shopify-orders-webhook")) return;

  const raw = await readRawBody(event, false);
  const ctx = event.context as { shopifyWebhookRawBody?: string };
  if (typeof raw === "string" && raw.length > 0) {
    ctx.shopifyWebhookRawBody = raw;
    return;
  }
  if (Buffer.isBuffer(raw) && raw.length > 0) {
    ctx.shopifyWebhookRawBody = raw.toString("utf8");
  }
});

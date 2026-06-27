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
import { sendMetaPurchaseEvent } from "../lib/meta-capi";
import {
  extractOrderContentIds,
  extractOrderEmail,
  extractOrderPhone,
  orderEventUnixTime,
  readVerifiedShopifyOrderWebhook,
  shouldSendPurchaseForOrder,
} from "../lib/shopify-webhook";

function clientIpFromHeaders(event: H3Event): string | null {
  const forwarded = getHeader(event, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return getHeader(event, "x-real-ip") ?? null;
}

export default defineEventHandler(async (event) => {
  const verified = await readVerifiedShopifyOrderWebhook(event);
  if (!verified.ok) {
    console.warn("[shopify-webhook] Rejected:", verified.error);
    setResponseStatus(event, verified.status);
    return { ok: false, error: verified.error };
  }

  const { order, topic } = verified;
  console.info("[shopify-webhook] Received:", {
    topic,
    orderId: order.id,
    financial_status: order.financial_status,
    test: order.test,
  });

  if (!shouldSendPurchaseForOrder(order, topic)) {
    console.info("[shopify-webhook] Skipped (not a paid order):", order.id, topic);
    return { ok: true, skipped: true, reason: "not_paid", orderId: order.id };
  }

  const value = parseFloat(String(order.total_price ?? "0"));
  const currency = String(order.currency ?? "INR").toUpperCase();

  const capi = await sendMetaPurchaseEvent({
    orderId: order.id,
    value,
    currency,
    contentIds: extractOrderContentIds(order),
    email: extractOrderEmail(order),
    phone: extractOrderPhone(order),
    eventTime: orderEventUnixTime(order),
    clientIp: clientIpFromHeaders(event),
    clientUserAgent: getHeader(event, "user-agent") ?? null,
  });

  if (!capi.ok) {
    setResponseStatus(event, 502);
    return {
      ok: false,
      orderId: order.id,
      eventId: capi.eventId,
      error: capi.error,
      meta: capi.meta,
    };
  }

  return {
    ok: true,
    orderId: order.id,
    eventId: capi.eventId,
    meta: capi.meta,
  };
});

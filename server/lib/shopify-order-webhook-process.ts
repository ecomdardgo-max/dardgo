import { sendMetaPurchaseEvent } from "./meta-capi";
import {
  extractOrderContentIds,
  extractOrderEmail,
  extractOrderPhone,
  orderEventUnixTime,
  shouldSendPurchaseForOrder,
  verifyShopifyWebhookHmac,
  type ShopifyOrderWebhook,
} from "./shopify-webhook";

export type WebhookHeaders = {
  hmac: string | null;
  topic: string | null;
  userAgent: string | null;
  clientIp: string | null;
};

export type WebhookProcessResult = {
  status: number;
  body: Record<string, unknown>;
};

export function processShopifyOrderWebhook(
  rawBody: string,
  headers: WebhookHeaders,
  secret: string,
): Promise<WebhookProcessResult> {
  return Promise.resolve().then(() => {
    if (!rawBody) {
      return { status: 400, body: { ok: false, error: "Empty webhook body" } };
    }

    const hmacHeader = headers.hmac;
    if (!hmacHeader) {
      return { status: 401, body: { ok: false, error: "Missing X-Shopify-Hmac-Sha256 header" } };
    }

    if (!verifyShopifyWebhookHmac(rawBody, hmacHeader, secret)) {
      console.warn("[shopify-webhook] HMAC mismatch");
      return { status: 401, body: { ok: false, error: "Invalid webhook signature" } };
    }

    let order: ShopifyOrderWebhook;
    try {
      order = JSON.parse(rawBody) as ShopifyOrderWebhook;
    } catch {
      return { status: 400, body: { ok: false, error: "Invalid JSON body" } };
    }

    if (!order?.id) {
      return { status: 400, body: { ok: false, error: "Missing order id" } };
    }

    const topic = headers.topic;
    console.info("[shopify-webhook] Received:", {
      topic,
      orderId: order.id,
      financial_status: order.financial_status,
      test: order.test,
      bodyBytes: rawBody.length,
    });

    if (!shouldSendPurchaseForOrder(order, topic)) {
      console.info("[shopify-webhook] Skipped:", {
        orderId: order.id,
        topic,
        financial_status: order.financial_status,
      });
      return {
        status: 200,
        body: {
          ok: true,
          skipped: true,
          reason: "not_eligible",
          orderId: order.id,
          topic,
          financial_status: order.financial_status,
        },
      };
    }

    return sendMetaPurchaseEvent({
      orderId: order.id,
      value: parseFloat(String(order.total_price ?? "0")),
      currency: String(order.currency ?? "INR").toUpperCase(),
      contentIds: extractOrderContentIds(order),
      email: extractOrderEmail(order),
      phone: extractOrderPhone(order),
      eventTime: orderEventUnixTime(order),
      clientIp: headers.clientIp,
      clientUserAgent: headers.userAgent,
    }).then((capi) => {
      if (!capi.ok) {
        console.error("[shopify-webhook] Meta CAPI failed:", {
          orderId: order.id,
          eventId: capi.eventId,
          error: capi.error,
          meta: capi.meta,
        });
        return {
          status: 502,
          body: {
            ok: false,
            orderId: order.id,
            eventId: capi.eventId,
            error: capi.error,
            meta: capi.meta,
          },
        };
      }

      return {
        status: 200,
        body: {
          ok: true,
          orderId: order.id,
          eventId: capi.eventId,
          meta: capi.meta,
        },
      };
    });
  });
}

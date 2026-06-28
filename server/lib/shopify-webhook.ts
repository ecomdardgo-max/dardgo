import { createHmac, timingSafeEqual } from "node:crypto";
import type { H3Event } from "nitro/h3";
import { getHeader, readRawBody } from "nitro/h3";

export type ShopifyOrderWebhook = {
  id: number;
  email?: string | null;
  phone?: string | null;
  currency?: string;
  total_price?: string;
  financial_status?: string | null;
  cancelled_at?: string | null;
  test?: boolean;
  created_at?: string;
  updated_at?: string;
  line_items?: Array<{
    variant_id?: number | null;
    product_id?: number | null;
    quantity?: number;
  }>;
  customer?: {
    email?: string | null;
    phone?: string | null;
  } | null;
  billing_address?: {
    phone?: string | null;
  } | null;
  shipping_address?: {
    phone?: string | null;
  } | null;
};

export function getShopifyWebhookSecret(): string | null {
  return (
    process.env.SHOPIFY_WEBHOOK_SECRET?.trim() ||
    process.env.SHOPIFY_API_SECRET?.trim() ||
    process.env.SHOPIFY_CLIENT_SECRET?.trim() ||
    null
  );
}

/** Raw body must match Shopify's payload byte-for-byte for HMAC verification. */
export async function readShopifyWebhookRawBody(event: H3Event): Promise<string> {
  const raw = await readRawBody(event, false);
  if (typeof raw === "string" && raw.length > 0) return raw;
  if (Buffer.isBuffer(raw) && raw.length > 0) return raw.toString("utf8");

  type NodeReq = { rawBody?: Buffer | string; body?: unknown };
  const nodeReq = (event as { node?: { req?: NodeReq } }).node?.req;
  if (nodeReq?.rawBody) {
    return typeof nodeReq.rawBody === "string" ? nodeReq.rawBody : nodeReq.rawBody.toString("utf8");
  }
  if (typeof nodeReq?.body === "string" && nodeReq.body.length > 0) return nodeReq.body;

  return "";
}

export function verifyShopifyWebhookHmac(rawBody: string, hmacHeader: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function readVerifiedShopifyOrderWebhook(
  event: H3Event,
): Promise<
  | { ok: true; order: ShopifyOrderWebhook; topic: string | null }
  | { ok: false; status: number; error: string }
> {
  const secret = getShopifyWebhookSecret();
  if (!secret) {
    return { ok: false, status: 503, error: "SHOPIFY_WEBHOOK_SECRET not configured" };
  }

  const hmacHeader = getHeader(event, "x-shopify-hmac-sha256");
  if (!hmacHeader) {
    return { ok: false, status: 401, error: "Missing X-Shopify-Hmac-Sha256 header" };
  }

  const rawBody = await readShopifyWebhookRawBody(event);
  if (!rawBody) {
    return { ok: false, status: 400, error: "Empty webhook body" };
  }

  if (!verifyShopifyWebhookHmac(rawBody, hmacHeader, secret)) {
    console.warn("[shopify-webhook] HMAC mismatch — check SHOPIFY_WEBHOOK_SECRET (Custom app → API credentials → Client secret)");
    return { ok: false, status: 401, error: "Invalid webhook signature" };
  }

  let order: ShopifyOrderWebhook;
  try {
    order = JSON.parse(rawBody) as ShopifyOrderWebhook;
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body" };
  }

  if (!order?.id) {
    return { ok: false, status: 400, error: "Missing order id" };
  }

  const topic = getHeader(event, "x-shopify-topic") ?? null;
  return { ok: true, order, topic };
}

export function shouldSendPurchaseForOrder(order: ShopifyOrderWebhook, topic: string | null): boolean {
  if (order.cancelled_at) return false;

  const status = String(order.financial_status ?? "").toLowerCase();
  if (status === "voided" || status === "refunded") return false;

  // Prepaid / captured payment
  if (topic === "orders/paid") return true;
  if (status === "paid" || status === "partially_paid") return true;

  // COD & Shiprocket: checkout completes but financial_status stays "pending".
  // orders/create fires right after thank-you — track Purchase then.
  if (topic === "orders/create") return true;

  if (topic === "orders/updated") {
    return status === "paid" || status === "partially_paid";
  }

  return false;
}

export function orderEventUnixTime(order: ShopifyOrderWebhook): number {
  const raw = order.updated_at || order.created_at;
  if (raw) {
    const ms = Date.parse(raw);
    if (!Number.isNaN(ms)) return Math.floor(ms / 1000);
  }
  return Math.floor(Date.now() / 1000);
}

export function extractOrderContentIds(order: ShopifyOrderWebhook): string[] {
  const ids = new Set<string>();
  for (const item of order.line_items ?? []) {
    if (item.variant_id) ids.add(String(item.variant_id));
    else if (item.product_id) ids.add(String(item.product_id));
  }
  return [...ids];
}

export function extractOrderEmail(order: ShopifyOrderWebhook): string | null {
  return order.email ?? order.customer?.email ?? null;
}

export function extractOrderPhone(order: ShopifyOrderWebhook): string | null {
  return (
    order.phone ??
    order.customer?.phone ??
    order.billing_address?.phone ??
    order.shipping_address?.phone ??
    null
  );
}

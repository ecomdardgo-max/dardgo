import { createHash } from "node:crypto";

const META_GRAPH_VERSION = "v21.0";

export function getMetaPixelId(): string {
  return (
    process.env.META_PIXEL_ID?.trim() ||
    process.env.VITE_META_PIXEL_ID?.trim() ||
    "2036567983884558"
  );
}

export function getMetaAccessToken(): string | null {
  const token = process.env.META_ACCESS_TOKEN?.trim();
  return token || null;
}

export function getMetaCapiSiteUrl(): string {
  const fromEnv = process.env.SITE_URL || process.env.VITE_PUBLIC_APP_URL || "https://www.dardgo.in";
  let origin = fromEnv.trim().replace(/\/$/, "");
  if (/\.myshopify\.com$/i.test(new URL(origin).hostname)) {
    origin = "https://www.dardgo.in";
  }
  return origin;
}

/** Meta requires lowercase hex SHA-256 of normalized PII. */
export function hashMetaPii(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmailForMeta(email: string | null | undefined): string | null {
  const normalized = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!normalized || !normalized.includes("@")) return null;
  return normalized;
}

/** Digits only; prepend India country code for common 10-digit numbers. */
export function normalizePhoneForMeta(phone: string | null | undefined): string | null {
  let digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
}

export type MetaPurchaseInput = {
  orderId: string | number;
  value: number;
  currency: string;
  contentIds: string[];
  email?: string | null;
  phone?: string | null;
  eventTime?: number;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
};

export type MetaCapiResult =
  | { ok: true; eventId: string; meta: unknown }
  | { ok: false; eventId: string; error: string; meta?: unknown };

export async function sendMetaPurchaseEvent(input: MetaPurchaseInput): Promise<MetaCapiResult> {
  const pixelId = getMetaPixelId();
  const accessToken = getMetaAccessToken();
  const eventId = `shopify_order_${input.orderId}`;

  if (!accessToken) {
    return { ok: false, eventId, error: "META_ACCESS_TOKEN not configured" };
  }
  if (!Number.isFinite(input.value) || input.value <= 0) {
    return { ok: false, eventId, error: "Invalid order value" };
  }

  const userData: Record<string, unknown> = {};
  const email = normalizeEmailForMeta(input.email);
  if (email) userData.em = [hashMetaPii(email)];
  const phone = normalizePhoneForMeta(input.phone);
  if (phone) userData.ph = [hashMetaPii(phone)];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: getMetaCapiSiteUrl(),
        user_data: userData,
        custom_data: {
          currency: input.currency,
          value: input.value,
          order_id: String(input.orderId),
          content_ids: input.contentIds,
          content_type: "product",
        },
      },
    ],
    access_token: accessToken,
  };

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const meta = (await res.json()) as { events_received?: number; error?: { message?: string } };

    if (!res.ok) {
      const message = meta.error?.message || `Meta CAPI HTTP ${res.status}`;
      console.error("[meta-capi] Purchase failed:", eventId, message, meta);
      return { ok: false, eventId, error: message, meta };
    }

    console.info("[meta-capi] Purchase sent:", eventId, {
      events_received: meta.events_received,
      value: input.value,
      currency: input.currency,
      test_mode: Boolean(testCode),
    });
    return { ok: true, eventId, meta };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Meta CAPI request failed";
    console.error("[meta-capi] Purchase error:", eventId, message);
    return { ok: false, eventId, error: message };
  }
}

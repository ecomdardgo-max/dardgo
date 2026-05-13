/**
 * Shiprocket Fastrr checkout (Shopify channel) — custom storefront.
 * Docs: inject sellerDomain + shopify.js / shopify.css, then `shiprocketCheckoutEvents.buyDirect`.
 */
import type { CartItem } from "@/lib/shopify";

declare global {
  interface Window {
    shiprocketCheckoutEvents?: {
      buyDirect: (opts: ShiprocketBuyDirectOptions) => void;
    };
  }
}

export type ShiprocketBuyDirectOptions = {
  type: "cart" | "product";
  products: Array<{ variantId: string; quantity: number }>;
  couponCode?: string;
  utmParams?: string;
  cartAttributes?: Record<string, string>;
};

const SHIPROCKET_CSS = "https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css";
const SHIPROCKET_JS = "https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js";

const rawSeller =
  (import.meta.env.VITE_SHIPROCKET_SELLER_DOMAIN as string | undefined)?.trim() ?? "";

function normalizeSellerDomain(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "");
}

const SELLER_DOMAIN = normalizeSellerDomain(rawSeller);

export function isShiprocketCheckoutConfigured(): boolean {
  return Boolean(SELLER_DOMAIN);
}

export function getShiprocketSellerDomain(): string {
  return SELLER_DOMAIN;
}

/** Shiprocket examples use numeric variant id; Storefront uses a GID. */
export function shopifyVariantGidToNumericId(gid: string): string {
  const m = gid.match(/ProductVariant\/(\d+)\s*$/);
  return m?.[1] ?? gid;
}

function collectUtmParams(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
  const parts: string[] = [];
  for (const k of keys) {
    const v = params.get(k);
    if (v) parts.push(`${k}=${encodeURIComponent(v)}`);
  }
  return parts.length ? parts.join("&") : undefined;
}

export function buildShiprocketCartPayload(
  items: CartItem[],
  options?: { couponCode?: string },
): ShiprocketBuyDirectOptions {
  const utmParams = collectUtmParams();
  return {
    type: "cart",
    products: items.map((i) => ({
      variantId: shopifyVariantGidToNumericId(i.variantId),
      quantity: i.quantity,
    })),
    ...(options?.couponCode ? { couponCode: options.couponCode } : {}),
    ...(utmParams ? { utmParams } : {}),
  };
}

export function buildShiprocketProductPayload(
  variantGid: string,
  quantity: number,
  options?: { couponCode?: string },
): ShiprocketBuyDirectOptions {
  const utmParams = collectUtmParams();
  return {
    type: "product",
    products: [{ variantId: shopifyVariantGidToNumericId(variantGid), quantity }],
    ...(options?.couponCode ? { couponCode: options.couponCode } : {}),
    ...(utmParams ? { utmParams } : {}),
  };
}

const READY_POLL_MS = 80;
const READY_TIMEOUT_MS = 15000;

export async function whenShiprocketCheckoutReady(): Promise<boolean> {
  if (!isShiprocketCheckoutConfigured()) return false;
  const start = Date.now();
  while (Date.now() - start < READY_TIMEOUT_MS) {
    if (typeof window !== "undefined" && window.shiprocketCheckoutEvents?.buyDirect) {
      return true;
    }
    await new Promise((r) => setTimeout(r, READY_POLL_MS));
  }
  return false;
}

export async function shiprocketBuyDirect(payload: ShiprocketBuyDirectOptions): Promise<void> {
  if (!isShiprocketCheckoutConfigured()) {
    throw new Error(
      "Shiprocket checkout is not configured (missing VITE_SHIPROCKET_SELLER_DOMAIN).",
    );
  }
  const ready = await whenShiprocketCheckoutReady();
  if (!ready || !window.shiprocketCheckoutEvents?.buyDirect) {
    throw new Error("Shiprocket checkout script did not load. Check your network or ad blockers.");
  }
  window.shiprocketCheckoutEvents.buyDirect(payload);
}

/** Ensures Fastrr assets are present, then opens Shiprocket checkout for the current cart lines. */
export async function initiateShiprocketCartFromItems(
  items: CartItem[],
  options?: { couponCode?: string },
): Promise<void> {
  injectShiprocketCheckoutAssets();
  await shiprocketBuyDirect(buildShiprocketCartPayload(items, options));
}

export function injectShiprocketCheckoutAssets(): void {
  if (!isShiprocketCheckoutConfigured() || typeof document === "undefined") return;

  const cssId = "shiprocket-fastrr-shopify-css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = SHIPROCKET_CSS;
    document.head.appendChild(link);
  }

  const jsId = "shiprocket-fastrr-shopify-js";
  if (!document.getElementById(jsId)) {
    const script = document.createElement("script");
    script.id = jsId;
    script.src = SHIPROCKET_JS;
    script.defer = true;
    document.body.appendChild(script);
  }
}

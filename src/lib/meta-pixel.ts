import type { CartItem } from "@/lib/shopify";

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

export const META_PIXEL_ID =
  (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim() || "2036567983884558";

export function isMetaPixelEnabled(): boolean {
  return Boolean(META_PIXEL_ID);
}

let initialized = false;

/** Loads Meta Pixel bootstrap script and initializes with the shop pixel ID. */
export function initMetaPixel(): void {
  if (typeof window === "undefined" || !isMetaPixelEnabled() || initialized) return;
  if (window.fbq) {
    initialized = true;
    return;
  }

  initialized = true;

  const f = window;
  const b = document;
  const e = "script";
  const v = "https://connect.facebook.net/en_US/fbevents.js";

  const n = (f.fbq = function (...args: unknown[]) {
    if (n.callMethod) {
      n.callMethod.apply(n, args);
    } else {
      n.queue.push(args);
    }
  } as Fbq);

  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const t = b.createElement(e);
  t.async = true;
  t.src = v;
  const s = b.getElementsByTagName(e)[0];
  s?.parentNode?.insertBefore(t, s);

  n("init", META_PIXEL_ID);
}

export function trackMetaPageView(): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
}

export function trackMetaEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.fbq) return;
  if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}

export function trackMetaViewContent(input: {
  id: string;
  title: string;
  price: number;
  currency?: string;
}): void {
  trackMetaEvent("ViewContent", {
    content_name: input.title,
    content_ids: [input.id],
    content_type: "product",
    value: input.price,
    currency: input.currency ?? "INR",
  });
}

export function trackMetaAddToCart(item: Omit<CartItem, "lineId">): void {
  const title = item.product.node.title;
  const value = parseFloat(item.price.amount) * item.quantity;
  trackMetaEvent("AddToCart", {
    content_name: title,
    content_ids: [item.variantId],
    content_type: "product",
    value,
    currency: item.price.currencyCode ?? "INR",
  });
}

export function trackMetaInitiateCheckout(items: CartItem[], value: number): void {
  trackMetaEvent("InitiateCheckout", {
    content_ids: items.map((i) => i.variantId),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value,
    currency: items[0]?.price.currencyCode ?? "INR",
  });
}

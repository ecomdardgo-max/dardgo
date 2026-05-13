/**
 * Judge.me widgets for headless Shopify (TanStack Start + Storefront).
 * Mirrors the official Hydrogen package’s DOM + globals, without @shopify/hydrogen.
 *
 * Setup (Judge.me → Settings → Integrations → Developers → Public API token):
 *   VITE_JUDGEME_PUBLIC_TOKEN=...
 *   VITE_JUDGEME_SHOP_DOMAIN=your-shop.myshopify.com   (optional if same as VITE_SHOPIFY_STORE_DOMAIN)
 *   VITE_JUDGEME_CDN_HOST=https://cdn.judge.me        (optional)
 *
 * “Awesome” / platform-independent widgets may be required for some shops — see Judge.me pricing.
 */

import { useEffect } from "react";

declare global {
  interface Window {
    jdgm?: Record<string, string>;
    jdgm_preloader?: () => void;
    jdgmCacheServer?: { reloadAll?: () => void };
  }
}

export function shopifyGidToProductNumericId(gid: string): string {
  return gid.replace(/^gid:\/\/shopify\/Product\//, "");
}

export type JudgeMeConfig = {
  shopDomain: string;
  publicToken: string;
  cdnHost: string;
};

export function getJudgeMeConfig(): JudgeMeConfig | null {
  const shopDomain = (
    (import.meta.env.VITE_JUDGEME_SHOP_DOMAIN as string | undefined)?.trim() ||
    (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined)?.trim() ||
    ""
  ).replace(/^https?:\/\//, "");
  const publicToken =
    (import.meta.env.VITE_JUDGEME_PUBLIC_TOKEN as string | undefined)?.trim() || "";
  const cdnHost = (
    (import.meta.env.VITE_JUDGEME_CDN_HOST as string | undefined)?.trim() || "https://cdn.judge.me"
  ).replace(/\/$/, "");
  if (!shopDomain || !publicToken) return null;
  return { shopDomain, publicToken, cdnHost };
}

export function ensureJudgeMeLoader(): void {
  const cfg = getJudgeMeConfig();
  if (!cfg || typeof document === "undefined") return;

  window.jdgm = {
    ...(window.jdgm || {}),
    SHOP_DOMAIN: cfg.shopDomain,
    PLATFORM: "shopify",
    PUBLIC_TOKEN: cfg.publicToken,
  };

  const src = `${cfg.cdnHost}/loader.js`;
  if (document.querySelector(`script[src="${src}"]`)) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.body.appendChild(s);
}

export function reloadJudgeMeWidgets(): void {
  if (typeof window === "undefined") return;
  try {
    window.jdgmCacheServer?.reloadAll?.();
  } catch {
    /* noop */
  }
  try {
    window.jdgm_preloader?.();
  } catch {
    /* noop */
  }
}

/** Star snippet near the product title (Judge.me preview badge). */
export function JudgeMePreviewBadge({ productId }: { productId: string }) {
  const id = shopifyGidToProductNumericId(productId);
  return (
    <div
      className="jdgm-widget jdgm-preview-badge inline-flex min-h-[22px] min-w-[100px] max-w-[200px] items-center"
      data-id={id}
      data-template="product"
      data-auto-install="false"
    />
  );
}

/** Full review widget (Judge.me loads content into this container). */
export function JudgeMeReviewWidget({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const id = shopifyGidToProductNumericId(productId);
  return (
    <div
      className="jdgm-widget jdgm-review-widget min-h-[200px] w-full"
      data-id={id}
      data-product-title={productTitle}
    />
  );
}

/** Load / refresh Judge.me after product change (SPA navigation). */
export function useJudgeMeLoader(productId: string | undefined): void {
  const token = (import.meta.env.VITE_JUDGEME_PUBLIC_TOKEN as string | undefined)?.trim() ?? "";
  useEffect(() => {
    if (!token || !productId) return;
    const cfg = getJudgeMeConfig();
    if (!cfg) return;
    ensureJudgeMeLoader();
    const t = window.setTimeout(() => reloadJudgeMeWidgets(), 100);
    return () => window.clearTimeout(t);
  }, [productId, token]);
}

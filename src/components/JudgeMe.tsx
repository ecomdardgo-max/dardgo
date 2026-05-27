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
    jdgmSettings?: Record<string, unknown>;
    jdgm_preloader?: () => void;
    jdgmCacheServer?: { reloadAll?: () => void };
  }
}

let judgeMeSettingsPromise: Promise<void> | null = null;

/** Judge.me shopify_v2.js requires jdgmSettings before loader scripts run. */
export async function ensureJudgeMeSettingsLoaded(): Promise<void> {
  if (typeof document === "undefined") return;
  if (document.querySelector(".jdgm-settings-script") || window.jdgmSettings) return;

  if (!judgeMeSettingsPromise) {
    judgeMeSettingsPromise = (async () => {
      const cfg = getJudgeMeConfig();
      if (!cfg) {
        window.jdgmSettings = window.jdgmSettings ?? {};
        return;
      }

      try {
        const params = new URLSearchParams({
          shop_domain: cfg.shopDomain,
          api_token: cfg.publicToken,
        });
        const res = await fetch(`https://api.judge.me/api/v1/widgets/settings?${params}`);
        if (res.ok) {
          const data = (await res.json()) as { settings?: string };
          if (data.settings) injectJudgeMeSettings(data.settings);
        }
      } catch {
        /* noop */
      }

      window.jdgmSettings = window.jdgmSettings ?? {};
    })();
  }

  await judgeMeSettingsPromise;
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

export async function ensureJudgeMeLoader(): Promise<void> {
  const cfg = getJudgeMeConfig();
  if (!cfg || typeof document === "undefined") return;

  await ensureJudgeMeSettingsLoaded();

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

function waitForJudgeMeReady(timeoutMs = 15_000): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (window.jdgm_preloader || Date.now() - start >= timeoutMs) {
        resolve();
        return;
      }
      window.requestAnimationFrame(tick);
    };
    tick();
  });
}

function injectHtmlOnce(selector: string, html: string, target: ParentNode): void {
  if (!html || document.querySelector(selector)) return;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  target.append(...Array.from(tpl.content.childNodes));
}

function injectJudgeMeSettings(settingsHtml: string): void {
  if (!settingsHtml || document.querySelector(".jdgm-settings-script")) return;
  const tpl = document.createElement("template");
  tpl.innerHTML = settingsHtml;
  const script = tpl.content.querySelector("script");
  if (!script?.textContent) return;
  const el = document.createElement("script");
  el.className = "jdgm-settings-script";
  el.setAttribute("data-cfasync", "false");
  el.textContent = script.textContent;
  document.head.appendChild(el);
}

/** Fetch widget HTML from our API and mount inside a visible container (dialog). */
export async function mountJudgeMeWriteReviewWidget(
  productId: string,
  productTitle: string,
  container: HTMLElement,
): Promise<boolean> {
  const cfg = getJudgeMeConfig();
  if (!cfg || typeof document === "undefined") return false;

  const externalId = shopifyGidToProductNumericId(productId);
  const res = await fetch(`/api/judgeme-widget?externalId=${encodeURIComponent(externalId)}`);
  if (!res.ok) return false;

  const data = (await res.json()) as {
    widget?: string;
    settings?: string;
    htmlMiracle?: string;
  };
  if (!data.widget) return false;

  injectHtmlOnce(".jdgm-miracle-styles", data.htmlMiracle ?? "", document.head);
  injectJudgeMeSettings(data.settings ?? "");

  window.jdgm = {
    ...(window.jdgm || {}),
    SHOP_DOMAIN: cfg.shopDomain,
    PLATFORM: "shopify",
    PUBLIC_TOKEN: cfg.publicToken,
  };

  const safeTitle = productTitle.replace(/"/g, "&quot;");
  container.innerHTML = `<div class="jdgm-widget jdgm-review-widget" data-id="${externalId}" data-product-title="${safeTitle}">${data.widget}</div>`;

  await ensureJudgeMeLoader();
  await waitForJudgeMeReady();
  reloadJudgeMeWidgets();

  for (let i = 0; i < 40; i++) {
    if (container.querySelector(".jdgm-rev-widg, .jdgm-write-rev-link")) {
      return true;
    }
    reloadJudgeMeWidgets();
    await new Promise((r) => window.setTimeout(r, 250));
  }

  return Boolean(container.querySelector(".jdgm-rev-widg"));
}

/** Click Judge.me “Write a review” to open their modal (after mount). */
export async function triggerJudgeMeWriteReviewForm(root: HTMLElement): Promise<boolean> {
  const link =
    root.querySelector<HTMLElement>(".jdgm-write-rev-link") ??
    root.querySelector<HTMLElement>("a.jdgm-write-rev-link");
  if (!link) return false;

  link.style.display = "";
  link.style.visibility = "visible";
  link.removeAttribute("hidden");
  link.click();
  link.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
  );

  for (let i = 0; i < 40; i++) {
    const modal = document.querySelector(
      ".jdgm-form-modal, .jdgm-write-review-modal, .jdgm-rev-widg__modal, .jdgm-widget-modal, .jdgm-modal",
    );
    if (modal) return true;
    await new Promise((r) => window.setTimeout(r, 150));
  }

  return false;
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
  className = "min-h-[200px] w-full",
}: {
  productId: string;
  productTitle: string;
  className?: string;
}) {
  const id = shopifyGidToProductNumericId(productId);
  return (
    <div
      className={`jdgm-widget jdgm-review-widget ${className}`.trim()}
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

    let cancelled = false;
    void (async () => {
      await ensureJudgeMeLoader();
      if (cancelled) return;
      window.setTimeout(() => reloadJudgeMeWidgets(), 100);
    })();

    return () => {
      cancelled = true;
    };
  }, [productId, token]);
}

/**
 * Judge.me product review widget HTML for headless write-review flow.
 * GET /api/judgeme-widget?externalId=9221650841850
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const url = new URL(request.url);
  const externalId = url.searchParams.get("externalId")?.trim();
  const handle = url.searchParams.get("handle")?.trim();

  if (!externalId && !handle) {
    return new Response(JSON.stringify({ error: "Missing externalId or handle" }), { status: 400 });
  }

  const shop =
    process.env.VITE_JUDGEME_SHOP_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const token = (process.env.VITE_JUDGEME_PUBLIC_TOKEN as string | undefined)?.trim();

  if (!shop || !token) {
    return new Response(JSON.stringify({ error: "Judge.me public token not configured" }), {
      status: 503,
    });
  }

  const base = new URLSearchParams({ shop_domain: shop, api_token: token });
  const productParams = new URLSearchParams(base);
  if (externalId) productParams.set("external_id", externalId);
  if (handle) productParams.set("handle", handle);

  try {
    const [settingsRes, widgetRes, miracleRes] = await Promise.all([
      fetch(`https://api.judge.me/api/v1/widgets/settings?${base}`),
      fetch(`https://api.judge.me/api/v1/widgets/product_review?${productParams}`),
      fetch(`https://api.judge.me/api/v1/widgets/html_miracle?${base}`),
    ]);

    if (!widgetRes.ok) {
      const detail = await widgetRes.text();
      return new Response(
        JSON.stringify({
          error: `Judge.me widget HTTP ${widgetRes.status}`,
          detail: detail.slice(0, 300),
        }),
        { status: 502 },
      );
    }

    const widgetJson = (await widgetRes.json()) as { widget?: string };
    const settingsJson = settingsRes.ok
      ? ((await settingsRes.json()) as { settings?: string })
      : {};
    const miracleJson = miracleRes.ok
      ? ((await miracleRes.json()) as { html_miracle?: string })
      : {};

    return new Response(
      JSON.stringify({
        widget: widgetJson.widget ?? "",
        settings: settingsJson.settings ?? "",
        htmlMiracle: miracleJson.html_miracle ?? "",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=600",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Judge.me widget fetch failed";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

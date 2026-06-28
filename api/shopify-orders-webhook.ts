/**
 * Vercel-native webhook (bodyParser: false) — takes precedence over Nitro route on Vercel.
 * Shopify → raw body + HMAC → Meta Conversions API Purchase.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { getShopifyWebhookSecret } from "../server/lib/shopify-webhook";
import { processShopifyOrderWebhook } from "../server/lib/shopify-order-webhook-process";

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const existing = (req as IncomingMessage & { rawBody?: Buffer | string }).rawBody;
    if (existing) {
      resolve(typeof existing === "string" ? existing : existing.toString("utf8"));
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer | string) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function clientIp(req: IncomingMessage): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0]?.trim() || null;
  if (Array.isArray(forwarded)) return forwarded[0]?.split(",")[0]?.trim() || null;
  const realIp = req.headers["x-real-ip"];
  return typeof realIp === "string" ? realIp : null;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: true,
        handler: "vercel-api",
        endpoint: "POST /api/shopify-orders-webhook",
      }),
    );
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  const secret = getShopifyWebhookSecret();
  if (!secret) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "SHOPIFY_WEBHOOK_SECRET not configured" }));
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    const result = await processShopifyOrderWebhook(
      rawBody,
      {
        hmac: typeof req.headers["x-shopify-hmac-sha256"] === "string"
          ? req.headers["x-shopify-hmac-sha256"]
          : null,
        topic: typeof req.headers["x-shopify-topic"] === "string" ? req.headers["x-shopify-topic"] : null,
        userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : null,
        clientIp: clientIp(req),
      },
      secret,
    );

    res.statusCode = result.status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.body));
  } catch (err) {
    console.error("[shopify-webhook] Handler error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Webhook handler failed",
      }),
    );
  }
}

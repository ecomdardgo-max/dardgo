/**
 * Capture Shopify webhook raw body from Node stream before H3/Vercel consumes it.
 */
import { defineEventHandler } from "nitro/h3";
import type { IncomingMessage } from "node:http";

function readNodeReqBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const existing = (req as IncomingMessage & { rawBody?: Buffer | string }).rawBody;
    if (existing) {
      resolve(typeof existing === "string" ? existing : existing.toString("utf8"));
      return;
    }

    if (!req.readable || req.readableEnded) {
      resolve("");
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

export default defineEventHandler(async (event) => {
  const path = event.path ?? "";
  if (event.method !== "POST" || !path.includes("shopify-orders-webhook")) return;

  const ctx = event.context as { shopifyWebhookRawBody?: string };
  if (typeof ctx.shopifyWebhookRawBody === "string") return;

  const req = event.node?.req;
  if (!req) return;

  try {
    const raw = await readNodeReqBody(req);
    if (raw) ctx.shopifyWebhookRawBody = raw;
  } catch (err) {
    console.warn(
      "[shopify-webhook] middleware body capture failed:",
      err instanceof Error ? err.message : String(err),
    );
  }
});

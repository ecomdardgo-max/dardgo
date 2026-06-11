import { defineEventHandler, setHeader } from "nitro/h3";
import { buildSitemapXml } from "../lib/sitemap";

export default defineEventHandler(async (event) => {
  const xml = await buildSitemapXml();
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=86400");
  return xml;
});

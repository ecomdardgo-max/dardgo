import { defineEventHandler, setHeader } from "nitro/h3";
import { buildRobotsTxt } from "../lib/sitemap";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return buildRobotsTxt();
});

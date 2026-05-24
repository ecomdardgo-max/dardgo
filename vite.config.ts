// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
//
// Deploy target: Vercel.
// We disable the Cloudflare Workers plugin so the build output is a standard
// Vite + TanStack Start Node SSR bundle that Vercel can serve natively
// (otherwise the build emits a Cloudflare Worker + assets dir layout that
// Vercel doesn't know how to map, causing 404s for static files like /favicon.ico).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  cloudflare: false,
  vite: {
    plugins: [
      nitro({
        serverDir: "./server",
      }),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        devOptions: {
          /** Avoids dev-worker clashes with Nitro on some setups (503 "nitro env unavailable"). */
          enabled: false,
        },
        includeAssets: ["favicon.svg", "dardgo.png", "dardgo_logo_300x.avif"],
        manifest: {
          name: "DARDGO",
          short_name: "DARDGO",
          description:
            "DARDGO — Ayurvedic-inspired herbal wellness oils, topicals, and comfort products.",
          theme_color: "#2E7D32",
          background_color: "#F8F5EF",
          display: "standalone",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "/dardgo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/dardgo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,avif,json}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-stylesheets",
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
      }),
    ],
  },
});

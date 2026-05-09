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

export default defineConfig({
  cloudflare: false,
  vite: {
    plugins: [nitro()],
  },
});

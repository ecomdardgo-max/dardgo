import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useCartSync } from "@/hooks/useCartSync";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground font-[var(--font-display)]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DARDGO — Ayurvedic Pain Relief | dardgo.in" },
      { name: "description", content: "100% Ayurvedic pain relief solutions by DARDGO (dardgo.in). Natural, safe, and effective — trusted worldwide since 2006." },
      { property: "og:title", content: "DARDGO — Ayurvedic Pain Relief | dardgo.in" },
      { property: "og:description", content: "100% Ayurvedic pain relief solutions by DARDGO (dardgo.in). Natural, safe, and effective — trusted worldwide since 2006." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "DARDGO" },
      { property: "og:url", content: "https://www.dardgo.in" },
      { name: "twitter:title", content: "DARDGO — Ayurvedic Pain Relief | dardgo.in" },
      { name: "twitter:description", content: "100% Ayurvedic pain relief solutions by DARDGO (dardgo.in). Natural, safe, and effective — trusted worldwide since 2006." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Wg1TKFd0cGgle8AcwZEZnZpG1lJ3/social-images/social-1778179279456-dardgo.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Wg1TKFd0cGgle8AcwZEZnZpG1lJ3/social-images/social-1778179279456-dardgo.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://www.dardgo.in" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "any", href: "/dardgo.png" },
      { rel: "shortcut icon", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/dardgo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useCartSync();
  return (
    <>
      <SmoothScrollProvider />
      <ScrollProgress />
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingCart, Store, Users } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { useCartStore } from "@/stores/cartStore";

function NavLink({
  isActive,
  children,
  ...rest
}: { isActive: boolean; children: ReactNode } & Record<string, unknown>) {
  const cls = `relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1 rounded-xl transition-colors ${
    isActive ? "text-primary" : "text-muted-foreground"
  }`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Link {...(rest as any)} className={cls}>{children}</Link>;
}

function NavAnchor({
  isActive,
  href,
  children,
}: {
  isActive: boolean;
  href: string;
  children: ReactNode;
}) {
  const cls = `relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1 rounded-xl transition-colors ${
    isActive ? "text-primary" : "text-muted-foreground"
  }`;
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

function useLocationHash() {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("hashchange", onStoreChange);
      window.addEventListener("popstate", onStoreChange);
      return () => {
        window.removeEventListener("hashchange", onStoreChange);
        window.removeEventListener("popstate", onStoreChange);
      };
    },
    () => (typeof window !== "undefined" ? window.location.hash : ""),
    () => "",
  );
}

export function MobileBottomNav() {
  const location = useLocation();
  const hash = useLocationHash();
  const totalItems = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const path = location.pathname;

  const isHome = path === "/" && hash !== "#products";
  const isProducts = path.startsWith("/collections") || path.startsWith("/product");
  const isCart = path.startsWith("/cart");
  const isCategory = path === "/" && hash === "#products";
  const isAbout = path.startsWith("/about");

  const labelCls = (active: boolean) =>
    `text-[10px] font-medium truncate max-w-full ${active ? "font-semibold" : ""}`;

  const ActiveBar = ({ show }: { show: boolean }) =>
    show ? <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" /> : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around h-16 px-0.5 sm:px-2">
        <NavLink isActive={isHome} to="/">
          <Home className={`w-5 h-5 ${isHome ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isHome)}>Home</span>
          <ActiveBar show={isHome} />
        </NavLink>

        <NavLink isActive={isProducts} to="/collections/$handle" params={{ handle: "all" }}>
          <Store className={`w-5 h-5 ${isProducts ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isProducts)}>Products</span>
          <ActiveBar show={isProducts} />
        </NavLink>

        <NavLink isActive={isCart} to="/cart">
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 ${isCart ? "stroke-[2.5]" : ""}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[9px] font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className={labelCls(isCart)}>Cart</span>
          <ActiveBar show={isCart} />
        </NavLink>

        <NavAnchor isActive={isCategory} href="/#products">
          <LayoutGrid className={`w-5 h-5 ${isCategory ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isCategory)}>Category</span>
          <ActiveBar show={isCategory} />
        </NavAnchor>

        <NavLink isActive={isAbout} to="/about">
          <Users className={`w-5 h-5 ${isAbout ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isAbout)}>About Us</span>
          <ActiveBar show={isAbout} />
        </NavLink>
      </div>
    </nav>
  );
}

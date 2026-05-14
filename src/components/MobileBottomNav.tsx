import { useState, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingCart, Store, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { SHOP_CATEGORIES } from "@/lib/shop-categories";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function tabCls(isActive: boolean) {
  return `relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1 rounded-xl transition-colors ${
    isActive ? "text-primary" : "text-muted-foreground"
  }`;
}

type NavLinkProps = { isActive: boolean; children: ReactNode } & ComponentProps<typeof Link>;

function NavLink({ isActive, children, ...rest }: NavLinkProps) {
  return (
    <Link {...rest} className={tabCls(isActive)}>
      {children}
    </Link>
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
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const totalItems = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const path = location.pathname;

  const isHome = path === "/" && hash !== "#products";
  const isProducts =
    !categorySheetOpen && (path.startsWith("/collections") || path.startsWith("/product"));
  const isCart = path.startsWith("/cart");
  const isCategory = categorySheetOpen || (path === "/" && hash === "#products");
  const isAccount = path.startsWith("/account");

  const labelCls = (active: boolean) =>
    `text-[10px] font-medium truncate max-w-full ${active ? "font-semibold" : ""}`;

  const ActiveBar = ({ show }: { show: boolean }) =>
    show ? (
      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
    ) : null;

  return (
    <>
      <Sheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[min(88dvh,880px)] overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2"
        >
          <SheetHeader className="text-left space-y-1 pr-10">
            <SheetTitle>Shop by category</SheetTitle>
            <SheetDescription>
              Same collections as the header menu — tap to see products.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {SHOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.handle}
                to="/collections/$handle"
                params={{ handle: cat.handle }}
                onClick={() => setCategorySheetOpen(false)}
                className="flex items-start gap-2.5 rounded-2xl border border-border/60 bg-card/80 p-3 text-left shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/5 active:scale-[0.99]"
              >
                <span className="text-xl leading-none" aria-hidden>
                  {cat.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground leading-tight">
                    {cat.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground leading-snug">
                    {cat.desc}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/collections/$handle"
            params={{ handle: "all" }}
            onClick={() => setCategorySheetOpen(false)}
            className="mt-4 block w-full rounded-2xl border border-primary/25 bg-primary/5 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            View all products
          </Link>
        </SheetContent>
      </Sheet>

      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.35)]">
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

          <button
            type="button"
            onClick={() => setCategorySheetOpen(true)}
            className={tabCls(isCategory)}
            aria-expanded={categorySheetOpen}
            aria-haspopup="dialog"
            aria-label="Open shop categories"
          >
            <LayoutGrid className={`w-5 h-5 ${isCategory ? "stroke-[2.5]" : ""}`} />
            <span className={labelCls(isCategory)}>Category</span>
            <ActiveBar show={isCategory} />
          </button>

          <NavLink isActive={isAccount} to="/account">
            <User className={`w-5 h-5 ${isAccount ? "stroke-[2.5]" : ""}`} />
            <span className={labelCls(isAccount)}>Account</span>
            <ActiveBar show={isAccount} />
          </NavLink>
        </div>
      </nav>
    </>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingBag, BookOpen, User } from "lucide-react";
import type { ReactNode } from "react";
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

export function MobileBottomNav() {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const path = location.pathname;

  const isHome = path === "/";
  const isCategories = path.startsWith("/collections");
  const isCart = path.startsWith("/cart");
  const isBlog = path.startsWith("/blog");
  const isAccount = path.startsWith("/about");

  const labelCls = (active: boolean) =>
    `text-[10px] font-medium truncate max-w-full ${active ? "font-semibold" : ""}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around h-16 px-1 sm:px-2">
        <NavLink isActive={isHome} to="/">
          <Home className={`w-5 h-5 ${isHome ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isHome)}>Home</span>
          {isHome && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />}
        </NavLink>

        <NavLink isActive={isCategories} to="/collections/$handle" params={{ handle: "all" }}>
          <LayoutGrid className={`w-5 h-5 ${isCategories ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isCategories)}>Categories</span>
          {isCategories && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />}
        </NavLink>

        <NavLink isActive={isCart} to="/cart">
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isCart ? "stroke-[2.5]" : ""}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[9px] font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className={labelCls(isCart)}>Cart</span>
          {isCart && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />}
        </NavLink>

        <NavLink isActive={isBlog} to="/blog">
          <BookOpen className={`w-5 h-5 ${isBlog ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isBlog)}>Blog</span>
          {isBlog && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />}
        </NavLink>

        <NavLink isActive={isAccount} to="/about">
          <User className={`w-5 h-5 ${isAccount ? "stroke-[2.5]" : ""}`} />
          <span className={labelCls(isAccount)}>Account</span>
          {isAccount && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />}
        </NavLink>
      </div>
    </nav>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingBag, BookOpen, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const navItems = [
  { icon: Home, label: "Home", to: "/" as const },
  { icon: LayoutGrid, label: "Categories", to: "/collections/all" as const },
  { icon: ShoppingBag, label: "Cart", to: "/cart" as const },
  { icon: BookOpen, label: "Blog", to: "/blog" as const },
  { icon: User, label: "Account", to: "/about" as const },
];

export function MobileBottomNav() {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {item.label === "Cart" && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[9px] font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-[var(--font-display)] text-primary tracking-tight">
              DARDGO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <a href="/#products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Products</a>
            <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <CartDrawer />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-foreground"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-foreground/80 hover:text-primary">Home</Link>
            <a href="/#products" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-foreground/80 hover:text-primary">Products</a>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-foreground/80 hover:text-primary">About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-foreground/80 hover:text-primary">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

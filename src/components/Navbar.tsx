import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import dardgoLogo from "@/assets/dardgo-logo.webp";

const shopCategories = [
  { label: "Pain Relief Oils & Roll On", href: "/#products" },
  { label: "Ayurvedic Beauty Products", href: "/#beauty" },
  { label: "Ayurvedic Tablets", href: "/#tablets" },
  { label: "Ayurvedic Halwa Formation", href: "/#halwa" },
  { label: "Ayurvedic Powder Formation", href: "/#powder" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-topbar text-center py-2 px-4 text-sm" style={{ color: '#fff' }}>
        Shop more, save more! Free shipping on orders over <strong>₹249</strong> 🎉
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/98 backdrop-blur-md shadow-sm" : "bg-background"
        } border-b border-border`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={dardgoLogo} alt="DARDGO - Ab raho har pal khush" className="h-12 sm:h-16 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide">Home</Link>
              <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                <button className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide flex items-center gap-1">
                  Shop <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {shopOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
                    {shopCategories.map((cat) => (
                      <a key={cat.label} href={cat.href} className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors">
                        {cat.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/about" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">About Us</Link>
              <Link to="/contact" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">Contact Us</Link>
            </nav>

            <div className="flex items-center gap-3">
              <CartDrawer />
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-md text-foreground">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <nav className="flex flex-col px-4 py-3 gap-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-semibold py-2.5 text-primary uppercase tracking-wide">Home</Link>
              <div className="border-b border-border pb-2 mb-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-1">Shop Categories</p>
                {shopCategories.map((cat) => (
                  <a key={cat.label} href={cat.href} onClick={() => setMobileOpen(false)} className="block text-sm py-2 text-foreground/80 hover:text-primary pl-2">
                    {cat.label}
                  </a>
                ))}
              </div>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-semibold py-2.5 text-foreground/80 uppercase tracking-wide">About Us</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-semibold py-2.5 text-foreground/80 uppercase tracking-wide">Contact Us</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

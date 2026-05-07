import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import dardgoLogo from "@/assets/dardgo-logo.webp";

const shopCategories = [
  { label: "Pain Relief Oils & Roll On", href: "/#products" },
  { label: "Ayurvedic Beauty Products", href: "/#products" },
  { label: "Ayurvedic Tablets", href: "/#products" },
  { label: "Ayurvedic Halwa Formation", href: "/#products" },
  { label: "Ayurvedic Powder Formation", href: "/#products" },
  { label: "Ayurvedic Capsules", href: "/#products" },
];

const announcements = [
  "FREE Shipping on Prepaid Orders Above ₹249",
  "100% Ayurvedic & Natural Products",
  "AYUSH Certified • GMP • FDA Approved",
  "COD Available @ ₹30 Per Order",
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
      {/* Marquee Announcement Bar */}
      <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap">
        <div className="py-2 animate-marquee inline-flex gap-16">
          {[...announcements, ...announcements, ...announcements].map((a, i) => (
            <span key={i} className="text-xs sm:text-sm font-medium inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow inline-block" />
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/98 backdrop-blur-md shadow-md" : "bg-background"
        } border-b border-border`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-[72px] items-center justify-between">
            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-md text-foreground">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo - centered on mobile */}
            <Link to="/" className="flex items-center">
              <img src={dardgoLogo} alt="DARDGO - Ab raho har pal khush" className="h-11 sm:h-14 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link to="/" className="text-[13px] font-bold text-primary tracking-wider uppercase">Home</Link>
              <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                <button className="text-[13px] font-bold text-foreground/80 hover:text-primary tracking-wider uppercase flex items-center gap-1 transition-colors">
                  Shop <ChevronDown className="w-3 h-3" />
                </button>
                {shopOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-card rounded-xl shadow-xl border border-border py-2 z-50">
                    {shopCategories.map((cat) => (
                      <a key={cat.label} href={cat.href} className="block px-5 py-3 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors">
                        {cat.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/about" className="text-[13px] font-bold text-foreground/80 hover:text-primary tracking-wider uppercase transition-colors">About Us</Link>
              <Link to="/contact" className="text-[13px] font-bold text-foreground/80 hover:text-primary tracking-wider uppercase transition-colors">Contact Us</Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <a href="https://wa.me/918430739932" target="_blank" rel="noopener noreferrer" className="hidden sm:flex p-2 rounded-full hover:bg-primary/5 text-primary transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <CartDrawer />
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-background border-t border-border shadow-lg">
            <nav className="flex flex-col px-4 py-4 gap-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-bold py-3 text-primary uppercase tracking-wide">Home</Link>
              <div className="border-b border-border pb-3 mb-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-1">Shop Categories</p>
                {shopCategories.map((cat) => (
                  <a key={cat.label} href={cat.href} onClick={() => setMobileOpen(false)} className="block text-sm py-2.5 text-foreground/80 hover:text-primary pl-3 border-l-2 border-transparent hover:border-primary transition-all">
                    {cat.label}
                  </a>
                ))}
              </div>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-bold py-3 text-foreground/80 uppercase tracking-wide">About Us</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-bold py-3 text-foreground/80 uppercase tracking-wide">Contact Us</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

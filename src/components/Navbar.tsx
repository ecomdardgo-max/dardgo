import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, Search, Heart } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchDrawer } from "@/components/SearchDrawer";
import { motion, AnimatePresence } from "framer-motion";
import dardgoLogo from "@/assets/dardgo-logo.webp";

const shopCategories = [
  { label: "Pain Relief Oils", href: "/#products", emoji: "💧" },
  { label: "Joint Care", href: "/#products", emoji: "🦴" },
  { label: "Immunity Boosters", href: "/#products", emoji: "🛡️" },
  { label: "Digestive Care", href: "/#products", emoji: "🌿" },
  { label: "Beauty & Skin", href: "/#products", emoji: "✨" },
  { label: "Women Wellness", href: "/#products", emoji: "🌸" },
];

const announcements = [
  "🚚 FREE Shipping on Prepaid Orders Above ₹249",
  "🌿 100% Ayurvedic & Natural Products",
  "✅ AYUSH Certified • GMP • FDA Approved",
  "💰 COD Available @ ₹30 Per Order",
  "⭐ Trusted by 10 Lakh+ Happy Customers",
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Marquee Announcement Bar */}
      <div className="bg-gradient-hero text-primary-foreground overflow-hidden whitespace-nowrap">
        <div className="py-2 animate-marquee inline-flex gap-16">
          {[...announcements, ...announcements, ...announcements].map((a, i) => (
            <span key={i} className="text-[11px] sm:text-xs font-medium inline-flex items-center gap-3">
              {a}
              <span className="w-1 h-1 rounded-full bg-brand-yellow-light inline-block opacity-60" />
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass shadow-soft" : "bg-card"
        } border-b border-border/50`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-[68px] items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={dardgoLogo} alt="DARDGO" className="h-10 sm:h-12 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-[13px] font-semibold text-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all"
                activeProps={{ className: "px-4 py-2 text-[13px] font-semibold text-primary bg-primary/5 rounded-xl" }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button className="px-4 py-2 text-[13px] font-semibold text-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all flex items-center gap-1">
                  Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-64 bg-card rounded-2xl shadow-card-hover border border-border/50 py-2 overflow-hidden"
                    >
                      {shopCategories.map((cat) => (
                        <a
                          key={cat.label}
                          href={cat.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <span className="text-base">{cat.emoji}</span>
                          {cat.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                to="/about"
                className="px-4 py-2 text-[13px] font-semibold text-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all"
                activeProps={{ className: "px-4 py-2 text-[13px] font-semibold text-primary bg-primary/5 rounded-xl" }}
              >
                About
              </Link>
              <Link
                to="/blog"
                className="px-4 py-2 text-[13px] font-semibold text-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all"
                activeProps={{ className: "px-4 py-2 text-[13px] font-semibold text-primary bg-primary/5 rounded-xl" }}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-[13px] font-semibold text-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all"
                activeProps={{ className: "px-4 py-2 text-[13px] font-semibold text-primary bg-primary/5 rounded-xl" }}
              >
                Contact
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-foreground hover:bg-muted hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
              <button
                className="hidden sm:flex p-2.5 rounded-xl text-foreground hover:bg-muted hover:text-primary transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
              </button>
              <CartDrawer />
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-card border-t border-border/50 overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-4 gap-0.5">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold py-3 px-4 text-foreground rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <div className="py-2 px-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Shop Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {shopCategories.map((cat) => (
                      <a
                        key={cat.label}
                        href={cat.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-sm py-2.5 px-3 text-foreground/80 hover:text-primary rounded-xl hover:bg-primary/5 transition-colors"
                      >
                        <span>{cat.emoji}</span>
                        <span className="text-xs">{cat.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-semibold py-3 px-4 text-foreground rounded-xl hover:bg-primary/5 transition-colors">About</Link>
                <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-sm font-semibold py-3 px-4 text-foreground rounded-xl hover:bg-primary/5 transition-colors">Blog</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-semibold py-3 px-4 text-foreground rounded-xl hover:bg-primary/5 transition-colors">Contact</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, Search, Heart, Sparkles } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchDrawer } from "@/components/SearchDrawer";
import { motion, AnimatePresence } from "framer-motion";
import dardgoLogo from "@/assets/dardgo-logo.webp";

const shopCategories: Array<{
  label: string;
  handle: string;
  emoji: string;
  desc: string;
}> = [
  { label: "Pain Relief Oils", handle: "pain-relief-oils", emoji: "💧", desc: "Targeted relief" },
  { label: "Joint Care", handle: "ayurvedic-tablets", emoji: "🦴", desc: "Mobility support" },
  { label: "Immunity Boosters", handle: "ayurvedic-capsules", emoji: "🛡️", desc: "Daily defense" },
  { label: "Digestive Care", handle: "ayurvedic-halwa", emoji: "🌿", desc: "Gut wellness" },
  { label: "Beauty & Skin", handle: "ayurvedic-beauty", emoji: "✨", desc: "Glow naturally" },
  { label: "Women Wellness", handle: "ayurvedic-powder", emoji: "🌸", desc: "Hormonal balance" },
];

const announcements = [
  "FREE Shipping on Prepaid Orders Above ₹249",
  "100% Ayurvedic & Natural — No Side Effects",
  "AYUSH Certified · GMP · FDA Approved",
  "COD Available @ ₹30 Per Order",
  "Trusted by 10 Lakh+ Happy Customers",
];

const navLinks = [
  { label: "Home", to: "/" as const, exact: true },
  { label: "About", to: "/about" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    // Pause Lenis (if active) and lock body scroll while the mobile menu is open.
    // We avoid setting body.style.overflow = "hidden" because that fights Lenis's
    // own scroll management and was producing scroll-stuck artefacts near the hero.
    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    if (mobileOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [mobileOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Marquee Announcement Bar */}
      <div className="bg-gradient-hero text-primary-foreground overflow-hidden whitespace-nowrap pt-[env(safe-area-inset-top)] relative">
        <div className="py-2 animate-marquee inline-flex gap-12 sm:gap-16">
          {[...announcements, ...announcements, ...announcements].map((a, i) => (
            <span key={i} className="text-[11px] sm:text-xs font-medium inline-flex items-center gap-3 tracking-wide">
              <Sparkles className="w-3 h-3 text-brand-yellow" />
              {a}
              <span className="w-1 h-1 rounded-full bg-brand-yellow-light/60 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        className="sticky top-0 z-[60] w-full transition-[background,box-shadow,border-color] duration-500"
      >
        <div
          className={`w-full px-3 sm:px-6 lg:px-8 transition-[background,border,border-radius,box-shadow] duration-500 ${
            isScrolled
              ? "bg-background shadow-soft border-b border-border"
              : "bg-background border-b border-border/40"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-2 sm:gap-4 transition-[height] duration-300 ${
              isScrolled ? "h-16 sm:h-[72px]" : "h-[72px] sm:h-[84px]"
            }`}
          >
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-foreground hover:bg-muted active:scale-95 transition-all"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 min-w-0 group" aria-label="DARDGO home">
              <img
                src={dardgoLogo}
                alt="DARDGO"
                className={`w-auto transition-all duration-300 group-hover:scale-[1.03] ${
                  isScrolled ? "h-11 sm:h-12" : "h-12 sm:h-14"
                }`}
              />
            </Link>

            {/* Desktop nav — pill style */}
            <nav className="hidden lg:flex items-center gap-1 bg-muted/55 rounded-full p-1.5 border border-border/45 shadow-sm">
              <Link
                to="/"
                className="relative px-5 py-2.5 text-[15px] font-semibold text-foreground/70 hover:text-foreground rounded-full transition-colors"
                activeProps={{ className: "relative px-5 py-2.5 text-[15px] font-semibold text-primary-foreground rounded-full" }}
                activeOptions={{ exact: true }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute inset-0 bg-foreground rounded-full"
                        transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">Home</span>
                  </>
                )}
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button className="px-5 py-2.5 text-[15px] font-semibold text-foreground/70 hover:text-foreground rounded-full transition-colors flex items-center gap-1.5">
                  Shop
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] bg-card rounded-3xl shadow-card-hover border border-border/50 overflow-hidden"
                    >
                      <div className="px-5 pt-4 pb-2">
                        <p className="text-eyebrow text-muted-foreground">Shop by category</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {shopCategories.map((cat) => (
                          <Link
                            key={cat.label}
                            to="/collections/$handle"
                            params={{ handle: cat.handle }}
                            onClick={() => setShopOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-primary/5 transition-colors group"
                          >
                            <span className="text-xl flex-shrink-0">{cat.emoji}</span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{cat.label}</p>
                              <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-border/50 px-5 py-3 bg-gradient-cream/40">
                        <Link to="/collections/all" className="text-xs font-semibold text-primary hover:underline">
                          View all products →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-5 py-2.5 text-[15px] font-semibold text-foreground/70 hover:text-foreground rounded-full transition-colors"
                  activeProps={{ className: "relative px-5 py-2.5 text-[15px] font-semibold text-primary-foreground rounded-full" }}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="navPill"
                          className="absolute inset-0 bg-foreground rounded-full"
                          transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl text-foreground/80 border border-transparent hover:border-border/60 hover:bg-muted hover:text-primary active:scale-95 transition-all"
                aria-label="Search products"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </button>
              <button
                className="hidden sm:flex p-2.5 rounded-xl text-foreground/80 border border-transparent hover:border-border/60 hover:bg-muted hover:text-primary active:scale-95 transition-all"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" strokeWidth={2.2} />
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
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overflow-hidden border-t border-border/50 bg-card"
            >
              <nav className="flex flex-col px-4 py-4 gap-0.5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold py-3 px-4 text-foreground rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <div className="py-3 px-4">
                  <p className="text-eyebrow text-muted-foreground mb-3">Shop Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.label}
                        to="/collections/$handle"
                        params={{ handle: cat.handle }}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 py-2.5 px-3 text-foreground/80 hover:text-primary rounded-2xl hover:bg-primary/5 transition-colors border border-border/40"
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="text-sm font-semibold leading-tight">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold py-3 px-4 text-foreground rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile-only quick contact strip */}
                <div className="mt-3 mx-1 p-4 rounded-2xl bg-gradient-cream border border-border/40">
                  <p className="text-eyebrow text-foreground/60 mb-2">Need help?</p>
                  <div className="flex items-center gap-2">
                    <a href="https://wa.me/919329912659" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                      WhatsApp
                    </a>
                    <a href="tel:+919329912659" className="flex-1 text-center py-2.5 rounded-xl bg-card border border-border text-foreground text-xs font-bold">
                      Call us
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

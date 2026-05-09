import { Link } from "@tanstack/react-router";
import { Truck, Wallet, ShieldCheck, Calendar, Mail, Phone, MapPin, Clock } from "lucide-react";

// All 8 social platforms from the legacy site, with brand-correct SVG paths.
// Lucide doesn't ship Pinterest / Tumblr / WhatsApp / X icons, so we keep them
// as inline SVGs alongside the Lucide-style strokes for visual consistency.
const socials: { label: string; href: string; path: string }[] = [
  {
    label: "Facebook",
    href: "https://facebook.com/dardgo",
    path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/dardgo",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/dardgo",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/dardgo",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/dardgo",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Tumblr",
    href: "https://dardgo.tumblr.com",
    path: "M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@dardgo",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919329912659",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  },
];

const trustBadges = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹249" },
  { icon: Wallet, title: "COD Available", desc: "₹30 per order" },
  { icon: ShieldCheck, title: "AYUSH Certified", desc: "GMP · FDA · Lab Tested" },
  { icon: Calendar, title: "Trusted Since 2006", desc: "Worldwide service" },
];

const categories = [
  "Pain Relief Oils & Roll On",
  "Ayurvedic Beauty Products",
  "Ayurvedic Tablets",
  "Ayurvedic Halwa Formation",
  "Ayurvedic Powder Formation",
  "Bacterial Vanish Ointment",
  "Ayurvedic Capsules",
];

const information = [
  { label: "FAQs", to: "/faqs" as const },
  { label: "Shipping & Delivery", to: "/shipping-delivery" as const },
  { label: "Returns & Refund", to: "/returns-refund" as const },
  { label: "Privacy Policy", to: "/privacy-policy" as const },
  { label: "Terms & Conditions", to: "/terms-conditions" as const },
  { label: "Track Order", to: "/contact" as const },
  { label: "Points of Sale", to: "/points-of-sale" as const },
];

export function Footer() {
  return (
    <footer className="bg-gradient-hero bg-grain text-primary-foreground relative overflow-hidden">
      {/* ----- Decorative ambient layers ----- */}
      {/* Soft yellow glow at the top-center for warmth */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[80%] h-80 rounded-full bg-brand-yellow/15 blur-[120px] pointer-events-none"
      />
      {/* Light-green orb in the bottom-right for depth */}
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-green-light/15 blur-[120px] pointer-events-none"
      />
      {/* Crisp golden hairline at the very top */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/60 to-transparent z-10"
      />

      {/* ===== Trust badges strip ===== */}
      <div className="relative border-b border-white/12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {trustBadges.map((b) => (
              <div
                key={b.title}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm hover:bg-white/12 hover:border-brand-yellow/30 transition-all"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-yellow/30 to-brand-yellow/10 ring-1 ring-brand-yellow/30 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-brand-yellow" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-sm font-bold text-white leading-tight">
                    {b.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-white/65 mt-0.5 truncate">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Main grid ===== */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-12 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            {/* Brand logo on a soft cream chip so the green/yellow artwork stays
                readable on the green footer background. */}
            <div className="inline-flex items-center justify-center bg-white rounded-2xl p-3 mb-5 shadow-lg ring-1 ring-brand-yellow/20">
              <img
                src="/dardgo.png"
                alt="DARDGO — Ab Raho Har Pal Khush"
                className="h-14 sm:h-16 w-auto"
                width={180}
                height={120}
              />
            </div>
            <p className="text-sm leading-relaxed mb-2 text-white font-bold">
              DardGo Pharma Pvt. Ltd.
            </p>
            <p className="text-sm leading-relaxed mb-3 text-white/75 max-w-sm">
              Trusted worldwide since 2006 for effective Ayurvedic solutions. Honesty
              and commitment define our service.
            </p>
            <a
              href="https://www.dardgo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mb-6 text-sm font-bold text-brand-yellow hover:text-brand-yellow-light transition-colors group"
              aria-label="Visit dardgo.in"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow group-hover:bg-brand-yellow-light transition-colors" />
              www.dardgo.in
            </a>

            <div>
              <p className="text-eyebrow text-brand-yellow/90 mb-3">Stay Connected</p>
              <div className="flex gap-2.5 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-yellow text-white hover:text-foreground flex items-center justify-center transition-all hover:scale-105 ring-1 ring-white/15 hover:ring-brand-yellow"
                  >
                    <svg
                      className="w-[15px] h-[15px]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-eyebrow text-brand-yellow/90 mb-4 sm:mb-5">Categories</h4>
            <nav className="flex flex-col gap-3">
              {categories.map((cat, idx) => (
                <a
                  key={cat}
                  href="/#products"
                  className={`text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5 ${idx > 3 ? "hidden sm:inline-block" : ""}`}
                >
                  {cat}
                </a>
              ))}
              <a
                href="/#products"
                className="sm:hidden inline-flex items-center justify-center mt-1 rounded-xl border border-brand-yellow/40 bg-brand-yellow/15 px-3 py-2 text-xs font-bold text-brand-yellow"
              >
                View all categories
              </a>
            </nav>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-eyebrow text-brand-yellow/90 mb-4 sm:mb-5">Quick links</h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5"
              >
                Home
              </Link>
              <a
                href="/#products"
                className="text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5"
              >
                Shop Products
              </a>
              <Link
                to="/about"
                className="text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5"
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className="text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5"
              >
                Health Blog
              </Link>
              <Link
                to="/contact"
                className="text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Information */}
          <div className="lg:col-span-3">
            <h4 className="text-eyebrow text-brand-yellow/90 mb-4 sm:mb-5">Information</h4>
            <nav className="flex flex-col gap-3">
              {information.map((item, idx) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`text-sm text-white/80 hover:text-brand-yellow transition-colors inline-block w-fit py-0.5 ${idx > 4 ? "hidden sm:inline-block" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact (full-width row on its own) */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-12 mt-2 lg:mt-4">
            <div className="rounded-3xl bg-white/8 border border-white/15 backdrop-blur-sm p-5 sm:p-6 lg:p-7">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <a href="tel:+919329912659" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 group-hover:bg-brand-yellow/30 group-hover:ring-brand-yellow/50 flex items-center justify-center flex-shrink-0 transition-all">
                    <Phone className="w-4 h-4 text-brand-yellow" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-eyebrow text-brand-yellow/85 mb-0.5">Call us</p>
                    <p className="text-sm font-bold text-white group-hover:text-brand-yellow transition-colors">
                      +91 93299 12659
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:care@dardgo.in"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 group-hover:bg-brand-yellow/30 group-hover:ring-brand-yellow/50 flex items-center justify-center flex-shrink-0 transition-all">
                    <Mail className="w-4 h-4 text-brand-yellow" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-eyebrow text-brand-yellow/85 mb-0.5">Email</p>
                    <p className="text-sm font-bold text-white group-hover:text-brand-yellow transition-colors break-all">
                      care@dardgo.in
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-brand-yellow" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-eyebrow text-brand-yellow/85 mb-0.5">Hours</p>
                    <p className="text-sm font-bold text-white">9:00 AM – 9:00 PM</p>
                    <p className="text-xs text-white/65">All days · IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-brand-yellow" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-eyebrow text-brand-yellow/85 mb-0.5">Office</p>
                    <p className="text-sm font-bold text-white leading-snug">
                      Balaghat, Madhya Pradesh
                    </p>
                    <p className="text-xs text-white/65 leading-snug mt-0.5">
                      38/K, Mohan Marg · 481001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-white/65">
            © {new Date().getFullYear()} DardGo Pharma Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/65">
            Website developed by{" "}
            <a
              href="tel:+917581982414"
              className="font-bold text-brand-yellow hover:text-brand-yellow-light underline-offset-4 hover:underline transition-colors"
              aria-label="Call developer Rakesh Nagpure at +91 75819 82414"
            >
              Rakesh Nagpure
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

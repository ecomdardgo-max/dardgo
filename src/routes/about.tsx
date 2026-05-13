import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Leaf,
  Heart,
  Target,
  Shield,
  Award,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Droplet,
  Pill,
  FlaskConical,
} from "lucide-react";
import { FDA_STRUCTURED_CLAIM_DISCLAIMER } from "@/lib/compliance";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About DARDGO Pharma — Ayurvedic-inspired wellness since 2006 | dardgo.in" },
      {
        name: "description",
        content:
          "DardGo Pharma Pvt. Ltd. crafts herbal oils, topicals, and traditional formulations from Balaghat, MP — focused on quality, transparency, and responsible wellness storytelling.",
      },
    ],
  }),
});

const productCategories = [
  {
    icon: Droplet,
    label: "Wellness oils & roll-ons",
    desc: "Topicals designed for massage, daily comfort, and post-activity routines.",
  },
  {
    icon: Sparkles,
    label: "Ayurvedic beauty",
    desc: "Herbal skincare aligned with gentle, botanical self-care.",
  },
  {
    icon: Pill,
    label: "Tablets & capsules",
    desc: "Traditional-format supplements — follow label directions and professional advice.",
  },
  {
    icon: FlaskConical,
    label: "Halwa & restorative foods",
    desc: "Heritage-style preparations for seasonal wellness support.",
  },
  {
    icon: Leaf,
    label: "Herbal powders",
    desc: "Daily-use botanical blends with clear usage guidance.",
  },
  {
    icon: Shield,
    label: "Topical ointments",
    desc: "External-use formulas; not substitutes for medical care.",
  },
  {
    icon: Pill,
    label: "Ayurvedic capsules",
    desc: "Concentrated herbal support in convenient form.",
  },
  {
    icon: Droplet,
    label: "Wellness syrups",
    desc: "Palatable formats for family routines where appropriate.",
  },
];

const comfortUseCases = [
  "Everyday stiffness after desk work or travel",
  "Post-activity muscle tiredness (non-injury)",
  "Seasonal dryness and skin comfort (beauty range)",
  "Households seeking transparent herbal labels",
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Calendar className="w-3.5 h-3.5" />
                Trusted since 2006
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 break-words">
                About <span className="text-gradient-green">DardGo Pharma</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
                From Balaghat, Madhya Pradesh, we formulate Ayurvedic-inspired wellness products for
                people who value heritage, honest labeling, and everyday comfort — without
                overpromising clinical outcomes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-gradient-cream rounded-3xl p-6 sm:p-12 mb-10 sm:mb-12 border border-border/30">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our story</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    DardGo Pharma Pvt. Ltd. began as a family-led effort to bring transparent herbal
                    products to households across India and the diaspora. Today we still manufacture
                    from Balaghat with a focus on batch discipline, supplier traceability, and clear
                    communication about what our products are — and are not.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our catalogue spans oils, roll-ons, tablets, powders, syrups, and beauty
                    formats. Names on packs reflect traditional retail language in Ayurveda;{" "}
                    <strong className="text-foreground/80">
                      we do not market products to diagnose, treat, cure, or prevent disease
                    </strong>
                    . {FDA_STRUCTURED_CLAIM_DISCLAIMER}
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2 flex-shrink-0">
                  <div className="text-5xl sm:text-6xl font-bold text-gradient-gold leading-none">
                    19+
                  </div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Years of craftsmanship
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-5 mb-12 sm:mb-16">
            {[
              {
                icon: Leaf,
                title: "Mission",
                desc: "Make responsible herbal wellness easier to access — with clear directions, fair pricing, and support when you need it.",
              },
              {
                icon: Heart,
                title: "Vision",
                desc: "A brand families associate with integrity: premium feel, earth-toned aesthetics, and zero misleading disease claims.",
              },
              {
                icon: Target,
                title: "Values",
                desc: "Purity-minded sourcing, respectful copy, and listening to customer feedback to improve formulations and service.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="bg-card rounded-3xl p-6 border border-border/30 shadow-card text-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-gradient-hero rounded-3xl p-6 sm:p-12 mb-12 sm:mb-16 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-semibold mb-4">
                  <Droplet className="w-3.5 h-3.5" />
                  Flagship line
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  DARDGO herbal massage &amp; comfort oils
                </h2>
                <p className="text-white/80 leading-relaxed mb-6 max-w-3xl">
                  Our flagship oils blend carrier oils such as mustard with traditional botanicals
                  like camphor, clove, and peppermint for external massage. They are intended to
                  support relaxation and everyday comfort when used as directed —{" "}
                  <strong className="text-brand-yellow-light">
                    not as a replacement for medical care
                  </strong>
                  .
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {comfortUseCases.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-white/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="text-center mb-8">
              <span className="text-eyebrow text-primary mb-2 block">What we make</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our product range</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {productCategories.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 0.05}>
                <div className="bg-card rounded-2xl p-5 border border-border/30 shadow-card hover:shadow-card-hover transition-all h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
              {[
                { icon: Shield, label: "AYUSH-oriented range" },
                { icon: Award, label: "GMP-focused production" },
                { icon: Users, label: "Pan-India & global shoppers" },
                { icon: Leaf, label: "Herbal-first formulas" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="bg-card rounded-2xl p-5 text-center border border-border/30 shadow-card"
                >
                  <b.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{b.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/30 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-eyebrow text-muted-foreground mb-1">Registered office</p>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  DardGo Pharma Pvt. Ltd. · Balaghat, Madhya Pradesh
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  38/K, 33 Abdul Jabbar, Ward No. 09, Mohan Marg, Dr Khan Gali, Balaghat&nbsp;–
                  481001, MP, India
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Get in touch →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About DARDGO Pharma — Trusted Ayurvedic Brand Since 2006 | dardgo.in" },
      {
        name: "description",
        content:
          "DardGo Pharma Pvt. Ltd. (dardgo.in) — trusted worldwide since 2006 for premium Ayurvedic pain relief, beauty, and wellness products. Made in Balaghat, Madhya Pradesh.",
      },
    ],
  }),
});

const productCategories = [
  { icon: Droplet, label: "Pain Relief Oils & Roll On", desc: "Targeted relief for joints, back & muscles" },
  { icon: Sparkles, label: "Ayurvedic Beauty Products", desc: "Glow naturally with herbal care" },
  { icon: Pill, label: "Ayurvedic Tablets", desc: "Sciatica, piles & daily wellness" },
  { icon: FlaskConical, label: "Ayurvedic Halwa Formation", desc: "Traditional restorative formulations" },
  { icon: Leaf, label: "Ayurvedic Powder Formation", desc: "Diabetes care & herbal supplements" },
  { icon: Shield, label: "Bacterial Vanish Ointment", desc: "Antibacterial topical relief" },
  { icon: Pill, label: "Ayurvedic Capsule", desc: "Concentrated herbal goodness" },
  { icon: Droplet, label: "Ayurvedic Health Syrup", desc: "Daily immunity & vitality" },
];

const painReliefBenefits = [
  "Joint pain & arthritis",
  "Knee pain & sprain",
  "Sciatica & back pain",
  "Headache & body pain",
  "Muscle soreness & swelling",
  "Blunt injury & insect bites",
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Calendar className="w-3.5 h-3.5" />
                Trusted Since 2006
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 break-words">
                About <span className="text-gradient-green">DardGo Pharma</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
                For nearly two decades, DardGo Pharma Pvt. Ltd. has been crafting effective Ayurvedic
                solutions from the heart of <strong className="text-foreground/80">Balaghat, Madhya Pradesh</strong> — trusted by
                customers across India and around the world.
              </p>
            </div>
          </ScrollReveal>

          {/* Heritage */}
          <ScrollReveal>
            <div className="bg-gradient-cream rounded-3xl p-6 sm:p-12 mb-10 sm:mb-12 border border-border/30">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Story</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Serving customers from Balaghat, Madhya Pradesh, India — DardGo Pharma is trusted by families
                    all over the world. Our offerings include DARDGO Ayurvedic Pain Relief Oil, Roll-On, Ayurvedic
                    Diabetes Powder, Dissolve Boll Tablet, Sciatica Tablets, Piles Medicine, and Health Syrup.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our brand is preferred owing to the supreme quality of every product. Customers choose us
                    over other companies for our <strong className="text-foreground/80">honesty</strong> and our habit of
                    <strong className="text-foreground/80"> fulfilling commitments</strong> — providing an excellent experience
                    that keeps them returning to DARDGO again and again.
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2 flex-shrink-0">
                  <div className="text-5xl sm:text-6xl font-bold text-gradient-gold leading-none">19+</div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Years of Trust
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Mission · Vision · Values */}
          <div className="grid sm:grid-cols-3 gap-5 mb-12 sm:mb-16">
            {[
              {
                icon: Leaf,
                title: "Mission",
                desc: "Make natural pain relief accessible to every Indian household — replacing harmful chemical painkillers with pure Ayurvedic solutions.",
              },
              {
                icon: Heart,
                title: "Vision",
                desc: "A world that trusts nature's healing power over synthetic drugs, where families live healthier and pain-free lives.",
              },
              {
                icon: Target,
                title: "Values",
                desc: "Authenticity, purity, and transparency in every product. We never compromise on quality or ingredient integrity.",
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

          {/* Pain Relief Oil — flagship product */}
          <ScrollReveal>
            <div className="bg-gradient-hero rounded-3xl p-6 sm:p-12 mb-12 sm:mb-16 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-semibold mb-4">
                  <Droplet className="w-3.5 h-3.5" />
                  Our Flagship
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">DARDGO Ayurvedic Pain Relief Oil</h2>
                <p className="text-white/80 leading-relaxed mb-6 max-w-3xl">
                  A powerful blend of <strong className="text-brand-yellow-light">mustard oil, clove oil, camphor, peppermint</strong> and other carefully selected
                  natural herbs. Strong, effective, and 100% chemical-free — providing fast relief from a wide range of
                  body aches and pains.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {painReliefBenefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-white/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Product Categories */}
          <ScrollReveal>
            <div className="text-center mb-8">
              <span className="text-eyebrow text-primary mb-2 block">What we make</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Product Range</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {productCategories.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 0.05}>
                <div className="bg-card rounded-2xl p-5 border border-border/30 shadow-card hover:shadow-card-hover transition-all h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-tight">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Trust badges */}
          <ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
              {[
                { icon: Shield, label: "AYUSH Certified" },
                { icon: Award, label: "GMP Approved" },
                { icon: Users, label: "Trusted Worldwide" },
                { icon: Leaf, label: "100% Natural" },
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

          {/* Made in Balaghat */}
          <ScrollReveal>
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/30 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-eyebrow text-muted-foreground mb-1">Where we&apos;re based</p>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  DardGo Pharma Pvt. Ltd. · Balaghat, Madhya Pradesh
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  38/K, 33 Abdul Jabbar, Ward No. 09, Mohan Marg, Dr Khan Gali, Balaghat&nbsp;– 481001, MP, India
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Get in touch →
              </a>
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

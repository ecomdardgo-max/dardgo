import { ScrollReveal } from "@/components/ScrollReveal";
import { Truck, Headphones, MessageCircle } from "lucide-react";

export function CustomerCareSection() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-eyebrow text-brand-earth mb-3 block">— Service</span>
            <h2 className="text-display-2 text-foreground mb-3">
              Delivery &amp; <span className="text-gradient-green">support</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Real humans answer calls and WhatsApp during business hours. Ask about orders,
              ingredients, or directions — we&apos;re here to help.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          <ScrollReveal delay={0.05}>
            <div className="rounded-3xl bg-card border border-border/40 p-6 shadow-soft flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pan-India dispatch</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Most prepaid orders above ₹249 ship free. Cash on delivery is available in many
                regions for a small fee — see checkout for your pincode.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="rounded-3xl bg-card border border-border/40 p-6 shadow-soft flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Care team</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Phone <span className="text-foreground font-medium">+91 93299 12659</span> or email{" "}
                <span className="text-foreground font-medium">care@dardgo.in</span> — 9:00 AM – 9:00
                PM IST, all days.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="rounded-3xl bg-gradient-to-br from-primary/12 via-card to-card border border-primary/20 p-6 shadow-soft flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                Prefer chat? Message us for order updates or product questions — we respond as soon
                as we can during staffed hours.
              </p>
              <a
                href="https://wa.me/919329912659?text=Hi%2C%20I%27d%20like%20help%20with%20a%20DARDGO%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold py-2.5 px-4 hover:bg-primary/90 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact DARDGO Pharma — Balaghat, MP | care@dardgo.in" },
      {
        name: "description",
        content:
          "Get in touch with DardGo Pharma Pvt. Ltd. (dardgo.in) — Balaghat, Madhya Pradesh. Call +91 9329912659 or email care@dardgo.in. Available 9:00 AM to 9:00 PM.",
      },
    ],
  }),
});

const socials = [
  { name: "Facebook", href: "https://facebook.com/dardgo", Icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/dardgo", Icon: Instagram },
  { name: "YouTube", href: "https://youtube.com/@dardgo", Icon: Youtube },
  { name: "LinkedIn", href: "https://linkedin.com/company/dardgo", Icon: Linkedin },
];

function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                Get in Touch
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3 break-words">
                Contact <span className="text-gradient-green">DardGo Pharma</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Have questions about our Ayurvedic products? We&apos;d love to hear from you. Reach out by
                phone, email, or WhatsApp — we&apos;re here 9:00 AM to 9:00 PM.
              </p>
            </div>
          </ScrollReveal>

          {/* Quick contact strip */}
          <ScrollReveal>
            <div className="grid sm:grid-cols-3 gap-4 mb-8 sm:mb-10">
              {[
                {
                  icon: Phone,
                  label: "Call us",
                  value: "+91 93299 12659",
                  href: "tel:+919329912659",
                  hint: "Mon – Sun, 9 AM – 9 PM",
                },
                {
                  icon: Mail,
                  label: "Email us",
                  value: "care@dardgo.in",
                  href: "mailto:care@dardgo.in",
                  hint: "Reply within 24 hours",
                },
                {
                  icon: Clock,
                  label: "Working hours",
                  value: "9:00 AM – 9:00 PM",
                  hint: "All days · IST",
                },
              ].map((item) => {
                const Wrap = item.href ? "a" : "div";
                return (
                  <Wrap
                    key={item.label}
                    {...(item.href ? { href: item.href } : {})}
                    className="flex items-start gap-3 p-5 rounded-2xl bg-card border border-border/30 shadow-card hover:shadow-card-hover transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-eyebrow text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.hint}</p>
                    </div>
                  </Wrap>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact form */}
            <ScrollReveal>
              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/30 shadow-card">
                <h2 className="font-semibold text-lg text-foreground mb-1">Send a Message</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Fill the form below and we&apos;ll respond within one business day.
                </p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="+91"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-orange text-white font-bold text-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Send Message →
                  </button>
                </form>
              </div>
            </ScrollReveal>

            <div className="space-y-5">
              {/* Address */}
              <ScrollReveal delay={0.1}>
                <div className="bg-gradient-cream rounded-3xl p-6 border border-border/30">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Visit our office</h3>
                      <p className="text-xs text-muted-foreground">DardGo Pharma Pvt. Ltd.</p>
                    </div>
                  </div>
                  <address className="text-sm text-muted-foreground leading-relaxed not-italic mb-4">
                    38/K, 33 Abdul Jabbar, Ward No. 09,
                    <br />
                    Mohan Marg, Dr Khan Gali,
                    <br />
                    Balaghat&nbsp;– 481001, Madhya Pradesh, India
                  </address>
                  <a
                    href="https://maps.google.com/?q=DardGo+Pharma+Balaghat+Madhya+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </ScrollReveal>

              {/* WhatsApp CTA */}
              <ScrollReveal delay={0.2}>
                <a
                  href="https://wa.me/919329912659?text=Hi%2C%20I%20have%20a%20question%20about%20DARDGO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-3xl border border-border/30 bg-card hover:shadow-card-hover transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Chat on WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Quick response — usually within minutes</p>
                  </div>
                </a>
              </ScrollReveal>

              {/* Map embed */}
              <ScrollReveal delay={0.3}>
                <div className="rounded-3xl overflow-hidden border border-border/30 bg-gradient-cream h-56">
                  <iframe
                    title="DardGo Pharma — Balaghat, Madhya Pradesh"
                    src="https://www.google.com/maps?q=Balaghat,Madhya+Pradesh,India&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </ScrollReveal>

              {/* Social links */}
              <ScrollReveal delay={0.4}>
                <div className="bg-card rounded-3xl p-6 border border-border/30 shadow-card">
                  <h3 className="font-semibold text-foreground mb-1">Stay Connected</h3>
                  <p className="text-xs text-muted-foreground mb-4">Follow us for tips, offers, and stories.</p>
                  <div className="flex gap-2.5 flex-wrap">
                    {socials.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        className="w-10 h-10 rounded-xl bg-muted/60 hover:bg-primary/10 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                      >
                        <s.Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

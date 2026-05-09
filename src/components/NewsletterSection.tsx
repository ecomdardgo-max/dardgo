import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed!", { description: "You'll receive Ayurvedic health tips soon." });
    setEmail("");
  };

  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-mesh-hero bg-grain rounded-[28px] sm:rounded-[36px] p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-white/5">
            {/* Decorative orbs */}
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-brand-yellow/15 blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-green-light/15 blur-3xl translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10 max-w-xl mx-auto">
              <span className="text-eyebrow text-brand-yellow mb-4 block">— Stay healthy</span>
              <h2 className="text-display-2 text-white mb-4">
                Ayurvedic wisdom,{" "}
                <span className="text-gradient-gold">in your inbox</span>
              </h2>
              <p className="text-sm sm:text-base text-white/65 mb-8 sm:mb-10 leading-relaxed">
                Subscribe for exclusive offers, health tips, and new product launches —
                straight to your inbox. No spam, ever.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 sm:gap-2 max-w-md mx-auto p-1.5 sm:bg-white/8 sm:backdrop-blur-md sm:border sm:border-white/15 sm:rounded-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 sm:bg-transparent border border-white/15 sm:border-0 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-full bg-gradient-orange text-white font-bold text-sm shadow-gold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0"
                >
                  Subscribe →
                </button>
              </form>

              <p className="text-[11px] text-white/40 mt-5">
                Trusted by 10 lakh+ readers · Unsubscribe anytime
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

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
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-gradient-hero rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-brand-green-light/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-yellow/8 blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-semibold mb-4">
                🌿 Stay Healthy
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                Get Ayurvedic Health Tips
              </h2>
              <p className="text-sm sm:text-base text-white/70 mb-8 max-w-md mx-auto">
                Subscribe for exclusive offers, health tips, and new product launches
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-orange text-white font-bold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

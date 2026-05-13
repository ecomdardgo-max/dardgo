import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { toast } from "sonner";

type NewsletterSectionProps = {
  /** `split`: cell inside a parent grid (desktop 2-column with secure checkout). */
  layout?: "full" | "split";
};

export function NewsletterSection({ layout = "full" }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const isSplit = layout === "split";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed!", { description: "You'll receive Ayurvedic health tips soon." });
    setEmail("");
  };

  const card = (
    <div
      className={`bg-mesh-hero bg-grain text-center relative overflow-hidden border border-white/5 ${
        isSplit
          ? "h-full min-h-[min(22rem,100%)] rounded-2xl p-6 sm:p-8 lg:p-9 flex flex-col"
          : "rounded-[28px] sm:rounded-[36px] p-8 sm:p-14 lg:p-20"
      }`}
    >
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-brand-yellow/15 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-green-light/15 blur-3xl translate-x-1/4 translate-y-1/4" />

      <div
        className={`relative z-10 mx-auto flex flex-col ${isSplit ? "max-w-md w-full flex-1 justify-center" : "max-w-xl"}`}
      >
        <span className={`text-eyebrow text-brand-yellow block ${isSplit ? "mb-2" : "mb-4"}`}>
          — Stay healthy
        </span>
        <h2
          className={`text-white mb-2 sm:mb-3 ${isSplit ? "text-display-3" : "text-display-2 mb-4"}`}
        >
          Ayurvedic wisdom, <span className="text-gradient-gold">in your inbox</span>
        </h2>
        <p
          className={`text-white/65 leading-relaxed ${isSplit ? "text-xs sm:text-sm mb-5 sm:mb-6" : "text-sm sm:text-base mb-8 sm:mb-10"}`}
        >
          Subscribe for exclusive offers, health tips, and new product launches — straight to your
          inbox. No spam, ever.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 sm:gap-2 mx-auto w-full max-w-md p-1.5 sm:bg-white/8 sm:backdrop-blur-md sm:border sm:border-white/15 sm:rounded-full"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white/10 sm:bg-transparent border border-white/15 sm:border-0 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 text-sm"
            required
          />
          <button
            type="submit"
            className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-gradient-orange text-white font-bold text-sm shadow-gold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0"
          >
            Subscribe →
          </button>
        </form>

        <p className={`text-white/40 ${isSplit ? "text-[10px] mt-3 sm:mt-4" : "text-[11px] mt-5"}`}>
          Trusted by 10 lakh+ readers · Unsubscribe anytime
        </p>
      </div>
    </div>
  );

  if (isSplit) {
    return <div className="h-full min-h-0">{card}</div>;
  }

  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>{card}</ScrollReveal>
      </div>
    </section>
  );
}

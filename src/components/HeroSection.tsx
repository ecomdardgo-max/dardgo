import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero flex items-center">
      {/* Layered background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green-dark via-brand-green-dark/95 to-brand-green-dark/80" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-14 lg:pb-16 w-full">
        <div className="flex flex-col items-center text-center w-full">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 rounded-full bg-white/8 border border-white/15">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow" />
            </span>
            <span className="text-[11px] font-semibold text-white/90 tracking-wider uppercase">
              India&apos;s #1 Ayurvedic Brand
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display-2 text-white mb-3 sm:mb-4 max-w-3xl">
            Pure Ayurvedic{" "}
            <span className="text-gradient-gold">Pain Relief.</span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
            Zero chemicals. Zero side effects. Trusted by 10 lakh+ families.
          </p>

          {/* Hero image — centered, full-size, stable */}
          <div className="relative w-full my-6 sm:my-8 lg:my-10">
            <img
              src="/dardgoheaderimg.webp"
              alt="DARDGO Ayurvedic pain relief products"
              width={1920}
              height={1280}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="relative w-full h-auto mx-auto object-contain"
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="#products"
              className="group inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm tracking-wide bg-gradient-orange text-white shadow-gold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Shop best sellers
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://wa.me/919329912659?text=Hi%2C%20I%20want%20to%20order%20DARDGO%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/8 hover:bg-white/12 border border-white/20 backdrop-blur-md font-bold text-sm text-white active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

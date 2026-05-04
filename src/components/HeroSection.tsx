import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Ayurvedic ingredients" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/90 via-brand-green-dark/70 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold-light text-sm font-medium mb-6 border border-brand-gold/30">
            🌿 100% Ayurvedic Formula
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[var(--font-display)] leading-tight mb-6" style={{ color: '#fff' }}>
            Dard se Azaadi,{" "}
            <span className="text-gradient-gold">Naturally</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Experience the power of ancient Ayurvedic remedies for lasting pain relief. No chemicals, no side effects — just nature's best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-brand-gold font-semibold text-sm tracking-wide transition-all hover:shadow-gold hover:scale-[1.02]"
              style={{ color: '#1a1a1a' }}
            >
              Shop Now
            </a>
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20order%20DARDGO%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 font-semibold text-sm tracking-wide transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Order
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

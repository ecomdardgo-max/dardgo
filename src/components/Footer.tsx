import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-foreground py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-2xl font-bold font-[var(--font-display)] text-brand-gold mb-3">DARDGO</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Premium Ayurvedic pain relief solutions. Natural, safe, and effective.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm hover:text-brand-gold transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link>
              <Link to="/about" className="text-sm hover:text-brand-gold transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>About Us</Link>
              <Link to="/contact" className="text-sm hover:text-brand-gold transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Contact</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>Support</h4>
            <nav className="flex flex-col gap-2">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-brand-gold transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>WhatsApp Support</a>
              <a href="mailto:support@dardgo.com" className="text-sm hover:text-brand-gold transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Email Support</a>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>Contact</h4>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <p>📧 support@dardgo.com</p>
              <p>📞 +91 99999 99999</p>
              <p>📍 India</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} DARDGO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ExternalLink, MapPin, Phone, Store } from "lucide-react";

/**
 * Store locator — content aligned with the legacy page:
 * https://dardgo.com/pages/dardgo-points-of-sale
 */

const regions: Array<{
  name: string;
  outlets: Array<{
    name: string;
    address: string;
    phoneDisplay: string;
    phoneTel: string;
    mapsUrl: string;
    mapsLabel: string;
  }>;
}> = [
  {
    name: "Madhya Pradesh",
    outlets: [
      {
        name: "DARDGO PHARMA PRIVATE LIMITED",
        address: "38/K 33, Abdul Jabbar, Ward Number 09, Balaghat, Madhya Pradesh — 481001",
        phoneDisplay: "+91 93299 12659",
        phoneTel: "+919329912659",
        mapsUrl: "https://maps.app.goo.gl/2nzr5o2MDN2EJmC36",
        mapsLabel: "DARDGO on Google Maps",
      },
      {
        name: "DARDGO PHARMACY",
        address: "Old Mutton Market Chowk, Baihar Road, Balaghat, Madhya Pradesh — 481001",
        phoneDisplay: "+91 89892 19192",
        phoneTel: "+918989219192",
        mapsUrl: "https://maps.app.goo.gl/Ag4QFmJuXWGuQqFV8",
        mapsLabel: "DARDGO Pharmacy on Google Maps",
      },
    ],
  },
  {
    name: "Tamil Nadu",
    outlets: [
      {
        name: "AURONILA",
        address:
          "D1, Flat, Suryodaya Apartment, 29, Pappammal Kovil St., Ramalinga Nagar, Muthiyalpet, Puducherry — 605003",
        phoneDisplay: "+91 97877 77345",
        phoneTel: "+919787777345",
        mapsUrl: "https://maps.app.goo.gl/ntG51JrB8uZHFXR98",
        mapsLabel: "AURONILA on Google Maps",
      },
    ],
  },
];

export const Route = createFileRoute("/points-of-sale")({
  component: PointsOfSalePage,
  head: () => ({
    meta: [
      { title: "DARDGO — Points of Sale | Retail Stores & Partners" },
      {
        name: "description",
        content:
          "Find DARDGO Ayurvedic products at our locations in Balaghat (MP) and Puducherry — addresses, phone numbers, and Google Maps.",
      },
    ],
  }),
});

function PointsOfSalePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Store className="w-3.5 h-3.5" />
                Visit us
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 break-words">
                DARDGO — <span className="text-gradient-green">Points of Sale</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                DARDGO products are available at the stores below. Call ahead for availability or
                directions.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-10 sm:space-y-12">
            {regions.map((region) => (
              <ScrollReveal key={region.name}>
                <section>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/60">
                    {region.name}
                  </h2>
                  <div className="grid gap-4 sm:gap-5">
                    {region.outlets.map((o) => (
                      <div
                        key={o.name + o.address}
                        className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 shadow-card"
                      >
                        <h3 className="font-bold text-foreground text-base sm:text-lg mb-3">
                          {o.name}
                        </h3>
                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground mb-4">
                          <MapPin
                            className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                            strokeWidth={2.2}
                          />
                          <p className="leading-relaxed">{o.address}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                          <a
                            href={`tel:${o.phoneTel}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                          >
                            <Phone className="w-4 h-4" strokeWidth={2.2} />
                            {o.phoneDisplay}
                          </a>
                          <a
                            href={o.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={o.mapsLabel}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" strokeWidth={2.2} />
                            Find us on Map
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p className="mt-10 text-center text-xs text-muted-foreground">
              Prefer shopping online?{" "}
              <Link to="/collections/all" className="font-semibold text-primary hover:underline">
                Browse all products
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

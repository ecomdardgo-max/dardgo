import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Clock, Package, Truck } from "lucide-react";

/**
 * Policy copy aligned with the legacy page:
 * https://dardgo.com/pages/shipping-delivery
 */

export const Route = createFileRoute("/shipping-delivery")({
  component: ShippingDeliveryPage,
  head: () => ({
    meta: [
      { title: "Shipping & Delivery | DARDGO" },
      {
        name: "description",
        content:
          "DARDGO shipping within India: free delivery, estimated timelines for metro and remote areas, and our commitment to on-time, safe orders.",
      },
    ],
  }),
});

function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Truck className="w-3.5 h-3.5" />
                Orders & delivery
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 break-words">
                Shipping & <span className="text-gradient-green">Delivery</span>
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="max-w-none text-foreground/90">
              <p className="leading-relaxed text-muted-foreground mb-6">
                At Dardgo Pharma Private Limited, we strive to provide the best possible customer
                service to all our valued customers. We understand that receiving your order on time
                and in good condition is crucial, and we are committed to making your shopping
                experience with us as smooth and hassle-free as possible.
              </p>

              <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 mb-6 shadow-card">
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" strokeWidth={2.2} />
                  Delivery
                </h2>
                <p className="leading-relaxed text-muted-foreground mb-0">
                  We offer <strong className="text-foreground">free shipping on all orders within India</strong>.
                  We aim to deliver your order within{" "}
                  <strong className="text-foreground">3–5 days in metro cities</strong> and{" "}
                  <strong className="text-foreground">8–10 days in remote areas</strong>. However,
                  please note that delivery times may vary depending on your location and any
                  unforeseen circumstances that may arise.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-muted/40 border border-border/40 px-4 py-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.2} />
                <p className="leading-relaxed mb-0">
                  DardGo Pharma — trusted worldwide since 2006 for effective Ayurvedic solutions.
                  Honesty and commitment define our service.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Questions?{" "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                Contact us
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

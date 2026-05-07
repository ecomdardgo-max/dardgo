import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loader2, Shield, Lock, Truck } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Secure Checkout — DARDGO" },
      { name: "description", content: "Secure checkout for your DARDGO Ayurvedic products." },
    ],
  }),
});

function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-20 sm:py-32">
        <div className="mx-auto max-w-md px-4 text-center">
          <ScrollReveal>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <Loader2 className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Redirecting to Checkout</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Please wait while we redirect you to our secure payment gateway...
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> SSL Secured</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Safe</span>
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Fast Delivery</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loader2, Shield, Lock, Truck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import {
  initiateShiprocketCartFromItems,
  isShiprocketCheckoutConfigured,
} from "@/lib/shiprocket-checkout";
import { toast } from "sonner";

type CheckoutLocationState = { checkoutCoupon?: string };

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Secure Checkout — DARDGO" },
      { name: "description", content: "Encrypted checkout for DARDGO herbal wellness orders." },
    ],
  }),
});

function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const itemKey = items.map((i) => `${i.variantId}:${i.quantity}`).join("|");
  const checkoutCoupon = useRouterState({
    select: (s) => {
      const st = s.location.state;
      if (typeof st === "object" && st !== null && "checkoutCoupon" in st) {
        return String((st as CheckoutLocationState).checkoutCoupon ?? "").trim();
      }
      return "";
    },
  });

  const [phase, setPhase] = useState<"loading" | "empty" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [cartHydrated, setCartHydrated] = useState(() => {
    if (typeof window === "undefined") return true;
    const p = useCartStore.persist;
    return p?.hasHydrated?.() ?? true;
  });

  useEffect(() => {
    const p = useCartStore.persist;
    if (!p) {
      setCartHydrated(true);
      return;
    }
    if (p.hasHydrated()) {
      setCartHydrated(true);
      return;
    }
    const unsub = p.onFinishHydration(() => {
      setCartHydrated(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!cartHydrated) return;

    let cancelled = false;

    async function run() {
      setPhase("loading");
      setErrorMsg("");
      const store = useCartStore.getState();
      const latestItems = store.items;
      const shopifyUrl = store.getCheckoutUrl();

      if (isShiprocketCheckoutConfigured()) {
        if (latestItems.length === 0) {
          if (!cancelled) setPhase("empty");
          return;
        }
        try {
          await initiateShiprocketCartFromItems(latestItems, {
            couponCode: checkoutCoupon || undefined,
          });
        } catch (e) {
          if (cancelled) return;
          const msg = e instanceof Error ? e.message : "Checkout could not start.";
          setErrorMsg(msg);
          setPhase("error");
          toast.error(msg);
        }
        return;
      }

      if (shopifyUrl) {
        window.location.assign(shopifyUrl);
        return;
      }
      if (!cancelled) setPhase("empty");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [cartHydrated, itemKey, checkoutCoupon]);

  const shopifyFallback = () => {
    const url = getCheckoutUrl();
    if (url) window.location.assign(url);
    else toast.error("No checkout link available. Add items to your cart first.");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 text-center">
          <ScrollReveal>
            {phase === "loading" && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
                >
                  <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  {isShiprocketCheckoutConfigured()
                    ? "Opening Shiprocket checkout"
                    : "Redirecting to checkout"}
                </h1>
                <p className="text-muted-foreground text-sm mb-8">
                  {isShiprocketCheckoutConfigured()
                    ? "You’ll be taken to our secure Shiprocket checkout — same flow as on our Shopify storefront."
                    : "Please wait while we redirect you to our secure payment gateway…"}
                </p>
              </>
            )}

            {phase === "empty" && (
              <>
                <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  Cart is empty
                </h1>
                <p className="text-muted-foreground text-sm mb-8">
                  Add products to your cart, then open checkout again.
                </p>
                <Button asChild className="rounded-full">
                  <Link to="/cart">View cart</Link>
                </Button>
              </>
            )}

            {phase === "error" && (
              <>
                <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  Checkout didn&apos;t start
                </h1>
                <p className="text-muted-foreground text-sm mb-2">{errorMsg}</p>
                <p className="text-muted-foreground text-xs mb-8">
                  You can try again or continue with Shopify-hosted checkout if available.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="rounded-full" onClick={() => window.location.reload()}>
                    Try again
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={shopifyFallback}>
                    Shopify checkout
                  </Button>
                </div>
              </>
            )}

            {phase === "loading" && (
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> SSL Secured
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Encrypted checkout
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Fast Delivery
                </span>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

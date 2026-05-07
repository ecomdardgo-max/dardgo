import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useCartStore } from "@/stores/cartStore";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Your Cart — DARDGO" },
      { name: "description", content: "Review your DARDGO Ayurvedic products cart and proceed to checkout." },
    ],
  }),
});

function CartPage() {
  const { items, updateQuantity, removeItem, getCheckoutUrl, isLoading } = useCartStore();
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [coupon, setCoupon] = useState("");
  const freeShipping = totalPrice >= 249;

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground text-sm mb-8">{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>
          </ScrollReveal>

          {items.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground text-sm mb-6">Looks like you haven't added any products yet</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 rounded-3xl bg-card border border-border/30 shadow-card"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-cream rounded-2xl overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{item.product.node.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{item.selectedOptions.map((o) => o.value).join(" • ")}</p>
                        <p className="font-bold text-foreground">₹{parseFloat(item.price.amount).toFixed(0)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <button onClick={() => removeItem(item.variantId)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order summary */}
              <div>
                <div className="sticky top-24 bg-card rounded-3xl p-6 shadow-card border border-border/30">
                  <h3 className="font-semibold text-foreground text-lg mb-5">Order Summary</h3>

                  {/* Coupon */}
                  <div className="flex gap-2 mb-5">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Coupon code"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <button onClick={() => toast.info("Coupon feature coming soon!")} className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                      Apply
                    </button>
                  </div>

                  <div className="space-y-3 mb-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={`font-medium ${freeShipping ? "text-primary" : ""}`}>
                        {freeShipping ? "FREE" : "₹40"}
                      </span>
                    </div>
                    <div className="border-t border-border/50 pt-3 flex justify-between text-base">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">₹{(totalPrice + (freeShipping ? 0 : 40)).toFixed(0)}</span>
                    </div>
                  </div>

                  {!freeShipping && (
                    <p className="text-xs text-primary bg-primary/5 rounded-xl px-3 py-2 mb-4">
                      Add ₹{(249 - totalPrice).toFixed(0)} more for free shipping!
                    </p>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-orange text-white font-bold text-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Proceed to Checkout →
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

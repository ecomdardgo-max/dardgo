import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Package, Send, MessageCircle } from "lucide-react";
import {
  openBulkOrderWhatsApp,
  DARDGO_WHATSAPP_DISPLAY,
  type BulkOrderFormData,
} from "@/lib/whatsapp";

export const Route = createFileRoute("/bulk-order")({
  component: BulkOrderPage,
  head: () => ({
    meta: [
      { title: "Bulk Order — DARDGO Ayurvedic Products | dardgo.in" },
      {
        name: "description",
        content:
          "Request wholesale or bulk pricing for DARDGO herbal wellness products. Submit your details and continue on WhatsApp with our team.",
      },
    ],
  }),
});

const emptyForm: BulkOrderFormData = {
  name: "",
  phone: "",
  email: "",
  company: "",
  city: "",
  products: "",
  quantity: "",
  notes: "",
};

const inputCls =
  "w-full px-4 py-3 rounded-2xl bg-muted/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-transparent";

function BulkOrderPage() {
  const [form, setForm] = useState<BulkOrderFormData>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof BulkOrderFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setError(null);
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const products = form.products.trim();
    const quantity = form.quantity.trim();

    if (!name || !phone || !products || !quantity) {
      setError("Please fill name, phone, products, and approximate quantity.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    openBulkOrderWhatsApp({
      ...form,
      name,
      phone,
      products,
      quantity,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12 pb-24 lg:pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Package className="w-3.5 h-3.5" />
                Wholesale & bulk
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 font-display">
                Bulk <span className="text-gradient-green">order enquiry</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Fill in your requirements below. When you tap send, WhatsApp opens with your
                details pre-filled to {DARDGO_WHATSAPP_DISPLAY} — review and send the message to
                our team.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/30 shadow-card">
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bulk-name" className="block text-sm font-medium text-foreground mb-1.5">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="bulk-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      className={inputCls}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="bulk-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={set("phone")}
                      className={inputCls}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bulk-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      id="bulk-email"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      className={inputCls}
                      placeholder="you@company.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-company" className="block text-sm font-medium text-foreground mb-1.5">
                      Company / store <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      id="bulk-company"
                      type="text"
                      value={form.company}
                      onChange={set("company")}
                      className={inputCls}
                      placeholder="Business or clinic name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bulk-city" className="block text-sm font-medium text-foreground mb-1.5">
                    City / state <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="bulk-city"
                    type="text"
                    value={form.city}
                    onChange={set("city")}
                    className={inputCls}
                    placeholder="e.g. Mumbai, Maharashtra"
                  />
                </div>

                <div>
                  <label htmlFor="bulk-products" className="block text-sm font-medium text-foreground mb-1.5">
                    Product(s) required <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bulk-products"
                    required
                    rows={3}
                    value={form.products}
                    onChange={set("products")}
                    className={`${inputCls} resize-none`}
                    placeholder="e.g. Pain relief oil 200ml, Sciatica tablets, Hair oil — list SKUs or product names"
                  />
                </div>

                <div>
                  <label htmlFor="bulk-qty" className="block text-sm font-medium text-foreground mb-1.5">
                    Approximate quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bulk-qty"
                    type="text"
                    required
                    value={form.quantity}
                    onChange={set("quantity")}
                    className={inputCls}
                    placeholder="e.g. 50 units per SKU, or 200 bottles total"
                  />
                </div>

                <div>
                  <label htmlFor="bulk-notes" className="block text-sm font-medium text-foreground mb-1.5">
                    Additional notes <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="bulk-notes"
                    rows={3}
                    value={form.notes}
                    onChange={set("notes")}
                    className={`${inputCls} resize-none`}
                    placeholder="Delivery timeline, GST invoice, packaging, etc."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200/60 rounded-xl px-4 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Send on WhatsApp
                </button>

                <p className="text-[11px] sm:text-xs text-muted-foreground text-center leading-relaxed flex items-start justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#25D366]" aria-hidden />
                  You will be redirected to WhatsApp ({DARDGO_WHATSAPP_DISPLAY}). Tap send there to
                  submit your enquiry.
                </p>
              </form>
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

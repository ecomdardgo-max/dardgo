import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, Package, ShoppingCart, ChevronLeft, Star, Minus, Plus,
  Truck, Shield, Leaf, CreditCard, Clock, CheckCircle2, ChevronDown, ChevronUp,
  ThumbsUp, User, Quote
} from "lucide-react";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY, STOREFRONT_PRODUCTS_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "Product — DARDGO Ayurvedic Pain Relief" },
      { name: "description", content: "Premium Ayurvedic pain relief product by DARDGO. 100% natural, no side effects." },
    ],
  }),
});

// --- Static data for tabs ---
const PAYMENT_ICONS = [
  { name: "UPI", bg: "bg-green-100", text: "text-green-700" },
  { name: "PhonePe", bg: "bg-purple-100", text: "text-purple-700" },
  { name: "Visa", bg: "bg-blue-100", text: "text-blue-700" },
  { name: "Mastercard", bg: "bg-orange-100", text: "text-orange-700" },
  { name: "RuPay", bg: "bg-sky-100", text: "text-sky-700" },
  { name: "COD", bg: "bg-amber-100", text: "text-amber-700" },
];

const KEY_INGREDIENTS = [
  { name: "Ashwagandha", emoji: "🌿", desc: "Reduces inflammation, supports joint health, and enhances bone strength for natural comfort." },
  { name: "Gandhak", emoji: "🔶", desc: "Promotes anti-inflammatory effects, reduces pain, and supports joint health." },
  { name: "Shallaki", emoji: "🍃", desc: "Helps soothe joint and bone stiffness, promoting mobility and comfort." },
  { name: "Triphala", emoji: "🫐", desc: "Known for mild detoxifying properties, supporting your body's natural cleansing processes." },
];

const BENEFITS_LIST = [
  { title: "Bone Discomfort Relief", desc: "Crafted with natural Ayurvedic herbs to alleviate bone discomfort, stiffness, and minor aches." },
  { title: "Enhanced Joint Flexibility", desc: "Supports healthy joints and promotes ease of movement for daily activities." },
  { title: "Detoxification Support", desc: "Contains Triphala to gently purify the body and support natural detox processes." },
  { title: "100% Natural Formula", desc: "Free from harsh chemicals and synthetic additives, supporting safe, natural use." },
  { title: "Holistic Wellness", desc: "Combines traditional Ayurvedic principles with modern wellness needs." },
  { title: "Improved Mobility", desc: "Eases bone discomfort and supports overall joint health for better mobility." },
];

const HOW_TO_USE_STEPS = [
  "Follow the recommended dosage on the product label or as advised by a healthcare professional.",
  "Swallow the tablets with a full glass of warm water for better absorption.",
  "Take after meals to enhance digestion and nutrient uptake.",
  "Use consistently for optimal results — Ayurvedic supplements work best with regular use.",
  "Consult a healthcare professional if you have existing health conditions or are on medications.",
];

const SUITABLE_FOR = [
  "Adults experiencing mild bone or joint discomfort",
  "Individuals seeking natural Ayurvedic solutions for joint and bone wellness",
  "Those looking to support detoxification and overall vitality",
  "People interested in herbal, chemical-free supplements for long-term support",
];

const FAQS = [
  { q: "What are the key ingredients?", a: "Key ingredients include Ashwagandha, Gandhak, Shallaki, and Triphala, known for their healing and soothing properties." },
  { q: "How should I take these tablets?", a: "Take 1-2 tablets twice a day with warm water, preferably after meals, or as directed by a healthcare professional." },
  { q: "Are there any side effects?", a: "Generally well-tolerated. Consult a healthcare professional if you have existing health conditions or are on medications." },
  { q: "How soon can I expect results?", a: "Results vary. Consistent use for 2-4 weeks is recommended to experience the full benefits." },
  { q: "Can these replace prescribed medications?", a: "These tablets are complementary and not a substitute for prescribed medications. Consult your healthcare provider." },
  { q: "Is it safe for long-term use?", a: "Extended use may be beneficial for sustained results, but consult a healthcare provider for personalized advice." },
];

const MOCK_REVIEWS = [
  { name: "Mohan Nair", date: "21 Nov 2024", rating: 5, title: "Problem Gone", text: "Excellent for joint stiffness and bone discomfort. The herbal ingredients are gentle and effective. I feel healthier overall." },
  { name: "Smita Gupta", date: "09 Nov 2024", rating: 5, title: "Best for use", text: "The best Ayurvedic supplement I've found for bone health. It helps relieve discomfort, and I feel lighter and more active." },
  { name: "Amit Sharma", date: "08 Nov 2024", rating: 5, title: "Best for me", text: "After trying different supplements, these work wonders! The bone discomfort has reduced, and my joints feel more flexible." },
  { name: "Meera Nair", date: "03 Nov 2024", rating: 4, title: "Good Product", text: "These tablets are a blessing for my knee pain! I feel much more flexible, and the Triphala ingredient gives a gentle detox as well." },
  { name: "Rajesh Kumar", date: "28 Oct 2024", rating: 4, title: "Dardgo Tablet", text: "I've been taking these for a month, and I feel a noticeable difference in my joints. Great for anyone seeking a natural solution." },
];

const TABS = ["Key Ingredients", "How to Use", "Benefits", "Suitable For", "FAQs"] as const;

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Key Ingredients");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    async function load() {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
        setProduct(data?.data?.productByHandle);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle]);

  useEffect(() => {
    async function loadRecommended() {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 6 });
        const products = data?.data?.products?.edges || [];
        setRecommendedProducts(products.filter((p: any) => p.node.handle !== handle).slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    }
    loadRecommended();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants.edges[selectedVariant]?.node;
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart!", { description: product.title });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const images = product.images.edges;
  const variant = product.variants.edges[selectedVariant]?.node;
  const comparePrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const price = variant ? parseFloat(variant.price.amount) : 0;
  const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="py-4 sm:py-8 pb-32 lg:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <ScrollReveal>
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
            </nav>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            {/* ===== IMAGE GALLERY ===== */}
            <ScrollReveal>
              <div className="sticky top-24">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-cream mb-4 shadow-lg border border-border/30">
                  <AnimatePresence mode="wait">
                    {images[selectedImage] ? (
                      <motion.img
                        key={selectedImage}
                        src={images[selectedImage].node.url}
                        alt={images[selectedImage].node.altText || product.title}
                        className="w-full h-full object-contain p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-muted-foreground" />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {images.map((img: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          i === selectedImage
                            ? 'border-primary shadow-md ring-2 ring-primary/20'
                            : 'border-border/50 opacity-60 hover:opacity-100 hover:border-primary/40'
                        }`}
                      >
                        <img src={img.node.url} alt="" className="w-full h-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* ===== PRODUCT DETAILS ===== */}
            <ScrollReveal delay={0.1}>
              <div>
                {/* Title & Rating */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 font-display leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-brand-yellow fill-brand-yellow' : 'text-brand-yellow/40 fill-brand-yellow/40'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-primary font-medium">4.48 out of 5</span>
                  <span className="text-xs text-muted-foreground">(25 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="text-3xl font-bold text-foreground">₹{price.toFixed(0)}</p>
                  {comparePrice && comparePrice > price && (
                    <>
                      <p className="text-lg text-muted-foreground line-through">₹{comparePrice.toFixed(0)}</p>
                      <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{discount}% OFF</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4">Tax included. Shipping calculated at checkout.</p>

                {/* SKU */}
                <p className="text-xs text-muted-foreground mb-5">SKU: DARDGO-{handle?.toUpperCase().slice(0, 8)}</p>

                {/* Variants */}
                {product.variants.edges.length > 1 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-foreground mb-2">QTY: <span className="text-muted-foreground font-normal">{variant?.title}</span></h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((v: any, i: number) => (
                        <button
                          key={v.node.id}
                          onClick={() => { setSelectedVariant(i); setQuantity(1); }}
                          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                            i === selectedVariant
                              ? 'bg-primary text-primary-foreground border-primary shadow-md'
                              : 'bg-card border-border hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {v.node.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center border border-border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-12 w-12 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="h-12 w-12 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    disabled={isLoading || !variant?.availableForSale}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>ADD TO CART</>}
                  </motion.button>
                </div>

                {/* Free Shipping + COD */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-primary" />Free Shipping On Orders Above ₹249</span>
                  <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-primary" />COD Available</span>
                </div>

                {/* Buy Now */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="w-full h-12 rounded-lg bg-foreground text-background font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all mb-4"
                >
                  BUY IT NOW
                </motion.button>

                {/* Payment Trust */}
                <div className="text-center mb-6">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Secure and trusted checkout with</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {PAYMENT_ICONS.map((p) => (
                      <span key={p.name} className={`${p.bg} ${p.text} text-[10px] font-bold px-2.5 py-1.5 rounded-md`}>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description with bullet features */}
                <div className="border-t border-border/50 pt-5 mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Bone Discomfort Relief:", text: "Formulated with Shallaki and other Ayurvedic herbs to soothe joint and bone stiffness." },
                      { label: "Detoxification Support:", text: "Contains Triphala for mild detoxifying properties." },
                      { label: "Enhanced Flexibility:", text: "Helps ease discomfort in bones and joints for smoother daily activities." },
                      { label: "Natural & Gentle:", text: "100% herbal ingredients, free from harsh chemicals." },
                      { label: "Holistic Wellness:", text: "Combines traditional Ayurvedic principles with modern wellness needs." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{item.label}</span> {item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust badges row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Leaf, label: "100% Ayurvedic", sub: "Natural Herbs" },
                    { icon: Shield, label: "Lab Tested", sub: "Quality Assured" },
                    { icon: Clock, label: "150+ Years", sub: "Ayurvedic Heritage" },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <badge.icon className="w-5 h-5 text-primary mb-1" />
                      <span className="text-xs font-semibold text-foreground">{badge.label}</span>
                      <span className="text-[10px] text-muted-foreground">{badge.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ===== TABS SECTION ===== */}
          <ScrollReveal className="mt-12">
            <div className="border border-border/50 rounded-2xl overflow-hidden bg-card">
              {/* Tab Headers */}
              <div className="flex overflow-x-auto scrollbar-hide border-b border-border/50">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition-all relative whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {tab.toUpperCase()}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8"
                >
                  {activeTab === "Key Ingredients" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {KEY_INGREDIENTS.map((ing) => (
                        <div key={ing.name} className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <span className="text-3xl">{ing.emoji}</span>
                          <div>
                            <h4 className="font-bold text-foreground mb-1">{ing.name}</h4>
                            <p className="text-sm text-muted-foreground">{ing.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "How to Use" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" /> Directions for Use
                      </h3>
                      <ol className="space-y-3">
                        {HOW_TO_USE_STEPS.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {activeTab === "Benefits" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {BENEFITS_LIST.map((b, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-cream border border-border/30">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-0.5">{b.title}</h4>
                            <p className="text-xs text-muted-foreground">{b.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "Suitable For" && (
                    <div className="space-y-3">
                      {SUITABLE_FOR.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          </span>
                          <p className="text-sm text-foreground">{item}</p>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground italic mt-3">
                        ⚕️ Consult a qualified healthcare professional to ensure suitability based on individual health conditions.
                      </p>
                    </div>
                  )}

                  {activeTab === "FAQs" && (
                    <div className="space-y-2">
                      {FAQS.map((faq, i) => (
                        <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                          >
                            <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                            {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          </button>
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollReveal>

          {/* ===== CUSTOMER REVIEWS ===== */}
          <ScrollReveal className="mt-12">
            <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 font-display">Customer Reviews</h2>

              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b border-border/50">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">4.48</p>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-brand-yellow fill-brand-yellow' : 'text-brand-yellow/40 fill-brand-yellow/40'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on 25 reviews</p>
                </div>
                <div className="flex-1 space-y-1.5 w-full">
                  {[
                    { stars: 5, count: 14 },
                    { stars: 4, count: 9 },
                    { stars: 3, count: 2 },
                    { stars: 2, count: 0 },
                    { stars: 1, count: 0 },
                  ].map((r) => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-3">{r.stars}</span>
                      <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-brand-yellow rounded-full transition-all" style={{ width: `${(r.count / 25) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-5 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-5">
                {MOCK_REVIEWS.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{review.name}</p>
                          <p className="text-[10px] text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-border'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">{review.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ===== RECOMMENDED PRODUCTS ===== */}
          {recommendedProducts.length > 0 && (
            <ScrollReveal className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-6 font-display">Recommended Products</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedProducts.map((edge: any) => {
                  const p = edge.node;
                  const img = p.images?.edges?.[0]?.node?.url;
                  const pPrice = p.variants?.edges?.[0]?.node?.price?.amount;
                  return (
                    <Link
                      key={p.id}
                      to="/product/$handle"
                      params={{ handle: p.handle }}
                      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-square bg-gradient-cream overflow-hidden">
                        {img ? (
                          <img src={img} alt={p.title} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-muted-foreground" /></div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 mb-1">{p.title}</h3>
                        {pPrice && <p className="text-sm font-bold text-primary">₹{parseFloat(pPrice).toFixed(0)}</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-border/50 p-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-lg font-bold text-foreground">₹{price.toFixed(0)}</p>
            {discount > 0 && <p className="text-[10px] text-red-500 font-semibold">{discount}% OFF</p>}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 uppercase tracking-wider"
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </motion.button>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

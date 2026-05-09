import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Package,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  Leaf,
  CreditCard,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  Heart,
  Share2,
  MapPin,
  Eye,
  Award,
  RotateCcw,
  Zap,
  ThumbsUp,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ZoomIn,
} from "lucide-react";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCT_BY_HANDLE_QUERY,
  STOREFRONT_PRODUCTS_QUERY,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

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

// Visual highlights row shown right under the description — quick-glance USPs.
const TRUST_HIGHLIGHTS = [
  { icon: Truck, label: "Free Shipping", sub: "Above ₹249" },
  { icon: CreditCard, label: "Cash on Delivery", sub: "All over India" },
  { icon: RotateCcw, label: "7-Day Returns", sub: "Hassle-free" },
  { icon: Shield, label: "Secure Checkout", sub: "100% safe" },
  { icon: Award, label: "AYUSH Certified", sub: "Govt. approved" },
  { icon: Leaf, label: "100% Natural", sub: "Zero chemicals" },
] as const;

// Names used by the rotating "Recently bought by ..." social proof toast strip.
const RECENT_BUYERS = [
  "Priya from Mumbai",
  "Rahul from Delhi",
  "Anjali from Bengaluru",
  "Vikram from Pune",
  "Sneha from Hyderabad",
  "Arjun from Jaipur",
  "Kavita from Lucknow",
  "Manish from Indore",
] as const;

// Helpful counts seeded per review (mock — looks lived-in, not all zeroes).
const REVIEW_HELPFUL_SEED = [12, 8, 15, 5, 3];

// Pincode checker — purely client-side mock. Any 6-digit pincode is "deliverable",
// 4-5 days lead time. We highlight a couple of metro pincodes as 1-2 days.
function checkPincode(pin: string): { available: boolean; days: number } {
  const fastPins = new Set(["110001", "400001", "560001", "411001", "500001", "700001", "600001"]);
  if (!/^\d{6}$/.test(pin)) return { available: false, days: 0 };
  return { available: true, days: fastPins.has(pin) ? 2 : 4 };
}

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mobileGalleryApi, setMobileGalleryApi] = useState<CarouselApi | null>(
    null,
  );
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Key Ingredients");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // New UX state — wishlist toggle, lightbox, pincode checker, review filter,
  // social-proof rotation, FBT bundle selection, and a sticky-CTA visibility flag.
  const [wishlisted, setWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<null | {
    available: boolean;
    days: number;
  }>(null);
  const [reviewFilter, setReviewFilter] = useState<number | "all">("all");
  const [reviewSort, setReviewSort] = useState<"recent" | "helpful">("recent");
  const [recentBuyerIdx, setRecentBuyerIdx] = useState(0);
  const [fbtSelection, setFbtSelection] = useState<Record<string, boolean>>({});
  const [showStickyCta, setShowStickyCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  // Rotate the "Recently bought by ..." chip every few seconds.
  useEffect(() => {
    const id = window.setInterval(() => {
      setRecentBuyerIdx((i) => (i + 1) % RECENT_BUYERS.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  // Show a slim desktop sticky CTA when the user scrolls past the in-page ATC.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When the in-page CTA scrolls fully out of view, surface the docked one.
        setShowStickyCta(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [handle]);

  useEffect(() => {
    if (!mobileGalleryApi) return;
    const onSelect = () => {
      setSelectedImage(mobileGalleryApi.selectedScrollSnap());
    };
    mobileGalleryApi.on("select", onSelect);
    mobileGalleryApi.on("reInit", onSelect);
    return () => {
      mobileGalleryApi.off("select", onSelect);
      mobileGalleryApi.off("reInit", onSelect);
    };
  }, [mobileGalleryApi]);

  useEffect(() => {
    if (!mobileGalleryApi) return;
    if (mobileGalleryApi.selectedScrollSnap() !== selectedImage) {
      mobileGalleryApi.scrollTo(selectedImage);
    }
  }, [selectedImage, mobileGalleryApi]);

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

  // Add the FBT bundle (this product + every selected recommended product)
  // to the cart in one click. Each bundled product uses its first variant.
  const handleAddBundle = async () => {
    if (!product) return;
    const variant = product.variants.edges[selectedVariant]?.node;
    if (variant) {
      await addItem({
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
    }
    const picked = recommendedProducts.filter((edge: any) => fbtSelection[edge.node.id]);
    for (const edge of picked) {
      const p = edge.node;
      const v = p.variants?.edges?.[0]?.node;
      if (!v) continue;
      await addItem({
        product: { node: p },
        variantId: v.id,
        variantTitle: v.title,
        price: v.price,
        quantity: 1,
        selectedOptions: v.selectedOptions || [],
      });
    }
    toast.success(`${picked.length + 1} items added to cart!`, {
      description: "Bundle applied — happy savings 🎉",
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: product?.title,
      text: `Check out ${product?.title} on DARDGO`,
      url,
    };
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        return;
      } catch {
        // user cancelled — fall through to clipboard.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", { description: "Share it with anyone." });
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkPincode(pincode.trim());
    setPincodeStatus(result);
  };

  // -------------------------------------------------------------------------
  // Derived values & memos — IMPORTANT: these must be declared *before* any
  // early `return` below, otherwise React will see a different number of
  // hooks across renders ("Rendered more hooks than during the previous
  // render"). Each value is null-safe so that it works during the first
  // render when `product` is still null.
  // -------------------------------------------------------------------------
  const images: any[] = product?.images?.edges ?? [];
  const variant = product?.variants?.edges?.[selectedVariant]?.node;
  const comparePrice = variant?.compareAtPrice
    ? parseFloat(variant.compareAtPrice.amount)
    : null;
  const price = variant ? parseFloat(variant.price.amount) : 0;
  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;
  const savings = comparePrice && comparePrice > price ? comparePrice - price : 0;
  const inStock = variant ? variant.availableForSale !== false : true;

  // Pseudo-stock indicator: faux "X left" when low. Memoised so the same
  // product always shows the same number on re-renders (no flicker).
  const lowStockCount = useMemo(() => {
    if (!product || !inStock) return 0;
    const seed = (product.id || "x").length;
    return 3 + (seed % 7);
  }, [product, inStock]);
  const isLowStock = lowStockCount > 0 && lowStockCount <= 7;

  // FBT companions = first 2 recommended products. Memoised so the array
  // identity is stable for the bundle-total useMemo below.
  const fbtCompanions = useMemo(
    () => recommendedProducts.slice(0, 2),
    [recommendedProducts],
  );
  const fbtBundleTotal = useMemo(() => {
    let sum = price;
    fbtCompanions.forEach((edge: any) => {
      if (fbtSelection[edge.node.id]) {
        const p = parseFloat(edge.node.variants?.edges?.[0]?.node?.price?.amount ?? "0");
        sum += p;
      }
    });
    return sum;
  }, [price, fbtCompanions, fbtSelection]);

  // -------------------------------------------------------------------------
  // Early returns (loading / not found) — declared *after* all hooks above
  // so the hook order stays consistent across renders.
  // -------------------------------------------------------------------------
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
          <Link to="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="py-3 sm:py-6 lg:py-8 pb-40 lg:pb-10 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 w-full min-w-0">
          {/* Breadcrumb */}
          <ScrollReveal>
            <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground mb-4 sm:mb-6 min-w-0">
              <Link
                to="/"
                className="hover:text-primary transition-colors flex-shrink-0"
              >
                Home
              </Link>
              <span className="flex-shrink-0">/</span>
              <span className="text-foreground font-medium truncate min-w-0">
                {product.title}
              </span>
            </nav>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-14 min-w-0">
            {/* ===== IMAGE GALLERY ===== */}
            <ScrollReveal>
              <div className="lg:sticky lg:top-24 min-w-0">
                {/* Desktop: vertical thumbnails + single main image */}
                <div className="hidden lg:flex gap-3 sm:gap-4 min-w-0">
                  {images.length > 1 && (
                    <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto scrollbar-hide pr-1">
                      {images.map((img: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          aria-label={`View image ${i + 1}`}
                          className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                            i === selectedImage
                              ? "border-primary shadow-md ring-2 ring-primary/20"
                              : "border-border/50 opacity-60 hover:opacity-100 hover:border-primary/40"
                          }`}
                        >
                          <img
                            src={img.node.url}
                            alt=""
                            className="w-full h-full object-contain p-1"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="relative min-w-0 flex-1 group">
                    <button
                      type="button"
                      onClick={() => images[selectedImage] && setLightboxOpen(true)}
                      className="block w-full max-w-full aspect-square rounded-2xl overflow-hidden bg-gradient-cream shadow-lg border border-border/30 cursor-zoom-in"
                      aria-label="Zoom image"
                    >
                      <AnimatePresence mode="wait">
                        {images[selectedImage] ? (
                          <motion.img
                            key={selectedImage}
                            src={images[selectedImage].node.url}
                            alt={images[selectedImage].node.altText || product.title}
                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
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
                    </button>

                    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-1.5 pointer-events-none">
                      {discount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-red-500 text-white text-[10px] sm:text-[11px] font-bold shadow-md">
                          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {discount}% OFF
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-brand-yellow text-foreground text-[10px] sm:text-[11px] font-bold shadow-md">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Bestseller
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-foreground text-[11px] font-bold shadow-md border border-border/40">
                        <BadgeCheck className="w-3 h-3 text-primary" />
                        AYUSH Certified
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 flex flex-col gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWishlisted((v) => !v);
                          toast.success(
                            wishlisted ? "Removed from wishlist" : "Added to wishlist",
                          );
                        }}
                        aria-label="Toggle wishlist"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur shadow-md border border-border/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] ${
                            wishlisted
                              ? "fill-red-500 text-red-500"
                              : "text-foreground/70"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Share product"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur shadow-md border border-border/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] text-foreground/70" />
                      </button>
                      <button
                        type="button"
                        onClick={() => images[selectedImage] && setLightboxOpen(true)}
                        aria-label="Zoom image"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/95 backdrop-blur shadow-md border border-border/40 items-center justify-center hover:scale-110 transition-transform"
                      >
                        <ZoomIn className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground/70" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile / tablet: swipe carousel + dots — avoids wide thumbnail strip */}
                <div className="lg:hidden w-full min-w-0 max-w-full">
                  <div className="relative w-full min-w-0">
                    <Carousel
                      setApi={setMobileGalleryApi}
                      opts={{ align: "start", loop: false }}
                      className="w-full min-w-0"
                    >
                      <CarouselContent className="-ml-0 ml-0">
                        {(images.length ? images : [null]).map((img: any, i: number) => (
                          <CarouselItem
                            key={img?.node?.id ?? img?.node?.url ?? `gallery-${i}`}
                            className="basis-full pl-0"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImage(i);
                                setLightboxOpen(true);
                              }}
                              className="block w-full max-w-full aspect-square cursor-zoom-in touch-manipulation rounded-2xl border border-border/30 bg-gradient-cream shadow-lg overflow-hidden"
                              aria-label={`Zoom image ${i + 1}`}
                            >
                              {img ? (
                                <img
                                  src={img.node.url}
                                  alt={img.node.altText || product.title}
                                  draggable={false}
                                  className="pointer-events-none h-full w-full select-none object-contain p-4"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package className="h-20 w-20 text-muted-foreground" />
                                </div>
                              )}
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>

                    <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
                      {discount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                          <Zap className="h-2.5 w-2.5" />
                          {discount}% OFF
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold text-foreground shadow-md">
                        <Sparkles className="h-2.5 w-2.5" />
                        Bestseller
                      </span>
                    </div>

                    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setWishlisted((v) => !v);
                          toast.success(
                            wishlisted ? "Removed from wishlist" : "Added to wishlist",
                          );
                        }}
                        aria-label="Toggle wishlist"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-white/95 shadow-md backdrop-blur transition-transform hover:scale-110 active:scale-95"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            wishlisted ? "fill-red-500 text-red-500" : "text-foreground/70"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Share product"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-white/95 shadow-md backdrop-blur transition-transform hover:scale-110 active:scale-95"
                      >
                        <Share2 className="h-3.5 w-3.5 text-foreground/70" />
                      </button>
                      <button
                        type="button"
                        onClick={() => images[selectedImage] && setLightboxOpen(true)}
                        aria-label="Zoom image"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-white/95 shadow-md backdrop-blur transition-transform hover:scale-110"
                      >
                        <ZoomIn className="h-4 w-4 text-foreground/70" />
                      </button>
                    </div>
                  </div>

                  {images.length > 1 && (
                    <div
                      role="tablist"
                      aria-label="Product images"
                      className="mt-3 flex max-w-full flex-wrap justify-center gap-x-0.5 gap-y-2 px-1"
                    >
                      {images.map((_: any, i: number) => (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          aria-selected={i === selectedImage}
                          aria-label={`Go to image ${i + 1}`}
                          onClick={() => {
                            setSelectedImage(i);
                            mobileGalleryApi?.scrollTo(i);
                          }}
                          className={cn(
                            "flex min-h-10 min-w-10 touch-manipulation items-center justify-center rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          )}
                        >
                          <span
                            className={cn(
                              "block rounded-full transition-all duration-200",
                              i === selectedImage
                                ? "h-2 w-6 bg-primary"
                                : "h-2 w-2 bg-muted-foreground/40",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* ===== PRODUCT DETAILS ===== */}
            <ScrollReveal delay={0.1}>
              <div>
                {/* Tiny pill row: Verified, Bestseller, etc. */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                    <BadgeCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Verified
                  </span>
                  {isLowStock && inStock && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      Only {lowStockCount} left
                    </span>
                  )}
                  {!inStock && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      Sold out
                    </span>
                  )}
                </div>

                {/* Title & Rating */}
                <h1 className="text-xl min-[400px]:text-[22px] sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 font-display leading-snug break-words hyphens-auto">
                  {product.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= 4
                            ? "text-brand-yellow fill-brand-yellow"
                            : "text-brand-yellow/40 fill-brand-yellow/40"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-primary font-semibold">4.48</span>
                  <a
                    href="#reviews"
                    className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                  >
                    (25 verified reviews)
                  </a>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
                    <Eye className="w-3.5 h-3.5" />
                    {12 + (selectedVariant + recentBuyerIdx) * 3} viewing now
                  </span>
                </div>

                {/* Price block (with savings + tax line) */}
                <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-brand-yellow/5 to-transparent border border-primary/10 p-3.5 sm:p-5 mb-4">
                  <div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-1">
                    <p className="text-2xl min-[400px]:text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
                      ₹{price.toFixed(0)}
                    </p>
                    {comparePrice && comparePrice > price && (
                      <>
                        <p className="text-sm sm:text-lg text-muted-foreground line-through">
                          ₹{comparePrice.toFixed(0)}
                        </p>
                        <span className="text-[10px] sm:text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-green-700 dark:text-green-500">
                      You save ₹{savings.toFixed(0)} on this order
                    </p>
                  )}
                  {/* SKU + tax — compact two-line on mobile, single line on sm+ */}
                  <p className="text-[10.5px] sm:text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Tax included • Free shipping ₹249+
                    <span className="hidden sm:inline">
                      {" "}
                      • SKU: DARDGO-{handle?.toUpperCase().slice(0, 8)}
                    </span>
                  </p>
                </div>

                {/* Variants */}
                {product.variants.edges.length > 1 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Pack:{" "}
                      <span className="text-muted-foreground font-normal">
                        {variant?.title}
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((v: any, i: number) => (
                        <button
                          key={v.node.id}
                          onClick={() => {
                            setSelectedVariant(i);
                            setQuantity(1);
                          }}
                          className={`max-w-full break-words px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                            i === selectedVariant
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-card border-border hover:border-primary/50 text-foreground"
                          }`}
                        >
                          {v.node.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div ref={ctaRef} className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2 sm:gap-3 mb-3">
                  <div className="inline-flex items-center justify-center border border-border rounded-xl flex-shrink-0 bg-card self-center min-[380px]:self-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="h-12 min-h-[48px] w-11 sm:w-12 flex items-center justify-center hover:bg-muted transition-colors rounded-l-xl active:bg-muted"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-11 sm:w-12 text-center font-semibold text-foreground tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="h-12 min-h-[48px] w-11 sm:w-12 flex items-center justify-center hover:bg-muted transition-colors rounded-r-xl active:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    disabled={isLoading || !variant?.availableForSale}
                    className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 min-h-[48px] h-12 rounded-xl bg-primary text-primary-foreground font-bold text-[11px] sm:text-sm uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 px-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>ADD TO CART</>
                    )}
                  </motion.button>
                </div>

                {/* Buy Now */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="w-full min-h-[48px] h-12 rounded-xl bg-foreground text-background font-bold text-xs sm:text-sm uppercase tracking-wider hover:opacity-90 transition-all mb-4 inline-flex items-center justify-center gap-2 px-3"
                >
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  BUY IT NOW
                </motion.button>

                {/* Pincode checker + estimated delivery */}
                <div className="rounded-2xl border border-border/50 bg-card p-3 sm:p-4 mb-4">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] sm:text-sm font-semibold text-foreground">
                        Check delivery to your area
                      </p>
                      <form
                        onSubmit={handlePincodeCheck}
                        className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2"
                      >
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) =>
                            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          placeholder="6-digit pincode"
                          className="w-full min-w-0 flex-1 px-2.5 sm:px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                        />
                        <button
                          type="submit"
                          disabled={pincode.length !== 6}
                          className="w-full sm:w-auto sm:min-w-[88px] px-4 py-2.5 min-h-[44px] rounded-lg bg-primary text-primary-foreground text-[11px] sm:text-xs font-bold uppercase tracking-wider disabled:opacity-50 hover:bg-primary/90 transition flex-shrink-0"
                        >
                          Check
                        </button>
                      </form>
                      {pincodeStatus && (
                        <div className="mt-2 flex items-start gap-2 text-[11px] sm:text-xs">
                          {pincodeStatus.available ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-foreground leading-snug">
                                Delivery available — reaches in{" "}
                                <span className="font-bold text-green-700">
                                  {pincodeStatus.days} days
                                </span>
                                .
                              </p>
                            </>
                          ) : (
                            <p className="text-red-600">
                              Please enter a valid 6-digit Indian pincode.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live "recently bought" social-proof toast strip */}
                <div className="rounded-xl bg-green-50 border border-green-200/70 px-3 py-2 mb-5 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={recentBuyerIdx}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center gap-2 text-[12px] sm:text-xs text-green-800"
                    >
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                      </span>
                      <span className="font-medium truncate">
                        {RECENT_BUYERS[recentBuyerIdx]} just bought this · a few minutes ago
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Visual trust highlights — premium bordered cards.
                    Crisp 2-tone design with a tinted icon plate, bold label
                    and subtle subtitle. 2 cols on tiny phones, 3 from sm,
                    6 from lg so each card stays roomy and readable. */}
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
                  {TRUST_HIGHLIGHTS.map((h) => (
                    <div
                      key={h.label}
                      className="group relative flex flex-col items-center justify-center text-center px-2 py-3 sm:px-2.5 sm:py-3.5 rounded-xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 min-h-[88px] sm:min-h-[96px]"
                    >
                      {/* Icon plate — subtle gradient that intensifies on hover */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/10 to-brand-yellow/10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-brand-yellow/20 transition-colors">
                        <h.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-primary" strokeWidth={2.2} />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
                        {h.label}
                      </span>
                      <span className="text-[9.5px] sm:text-[10.5px] text-muted-foreground leading-tight mt-0.5">
                        {h.sub}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Payment Trust — single branded strip image with all
                    accepted methods (Secure Checkout · PhonePe · Visa ·
                    Mastercard · RuPay · COD). */}
                <div className="text-center mb-6">
                  <img
                    src="/securecheckoutwith.png"
                    alt="Secure checkout with PhonePe, Visa, Mastercard, RuPay and Cash on Delivery"
                    className="mx-auto w-full max-w-md h-auto"
                    loading="lazy"
                    width={1024}
                    height={120}
                  />
                </div>

                {/* Product description (from Shopify) */}
                <div className="border-t border-border/50 pt-4 sm:pt-5 mb-2">
                  <h2 className="text-[15px] sm:text-base font-bold text-foreground mb-2.5 sm:mb-3">
                    Why this product?
                  </h2>
                  <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed break-words [overflow-wrap:anywhere]">
                    {product.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ===== FREQUENTLY BOUGHT TOGETHER =====
              Mobile: vertical row of compact "checkbox + thumb + name + price"
              line items — much easier to scan and tap than a horizontally
              scrolling product chain.
              Desktop (lg+): the classic horizontal chain with "+" between
              cards plus a side-pinned bundle total card. */}
          {fbtCompanions.length > 0 && (
            <ScrollReveal className="mt-8 sm:mt-12 lg:mt-14">
              <div className="rounded-2xl border border-border/50 bg-card p-4 sm:p-6 lg:p-7">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-brand-yellow" />
                  <span className="text-eyebrow text-primary">— Bundle & save</span>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-5 font-display">
                  Frequently bought together
                </h2>

                {/* MOBILE / TABLET layout: vertical stack of items */}
                <div className="lg:hidden space-y-2.5">
                  {/* Anchor product (this item, locked-in) */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/30">
                    <div className="w-14 h-14 rounded-lg bg-gradient-cream border border-primary/30 overflow-hidden p-1 flex-shrink-0">
                      {images[0] ? (
                        <img
                          src={images[0].node.url}
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-primary mb-0.5">
                        This item
                      </span>
                      <p className="text-[12px] font-semibold text-foreground line-clamp-2 leading-tight">
                        {product.title}
                      </p>
                      <p className="text-[12px] text-primary font-bold mt-0.5">
                        ₹{price.toFixed(0)}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>

                  {/* Companion products as toggleable list rows */}
                  {fbtCompanions.map((edge: any) => {
                    const p = edge.node;
                    const img = p.images?.edges?.[0]?.node?.url;
                    const pPrice = parseFloat(
                      p.variants?.edges?.[0]?.node?.price?.amount ?? "0",
                    );
                    const checked = !!fbtSelection[p.id];
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          checked
                            ? "bg-primary/5 border-primary/40 shadow-sm"
                            : "bg-card border-border/60 hover:border-primary/30"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg bg-gradient-cream border border-border/40 overflow-hidden p-1 flex-shrink-0">
                          {img ? (
                            <img
                              src={img}
                              alt={p.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground m-auto" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                            Add to bundle
                          </span>
                          <p className="text-[12px] font-semibold text-foreground line-clamp-2 leading-tight">
                            {p.title}
                          </p>
                          <p className="text-[12px] text-primary font-bold mt-0.5">
                            ₹{pPrice.toFixed(0)}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setFbtSelection((prev) => ({
                              ...prev,
                              [p.id]: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 accent-primary cursor-pointer flex-shrink-0"
                        />
                      </label>
                    );
                  })}

                  {/* Bundle total card */}
                  <div className="rounded-xl bg-gradient-to-br from-primary/5 via-brand-yellow/5 to-transparent border border-primary/15 p-3.5 flex items-center justify-between gap-3 mt-3">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        Bundle total
                      </p>
                      <p className="text-xl font-extrabold text-foreground tabular-nums leading-none mt-0.5">
                        ₹{fbtBundleTotal.toFixed(0)}
                      </p>
                      <p className="text-[10.5px] text-green-700 font-semibold mt-0.5">
                        {Object.values(fbtSelection).filter(Boolean).length} extras selected
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddBundle}
                      disabled={isLoading}
                      className="px-3 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-wider hover:bg-primary/90 transition disabled:opacity-50 inline-flex items-center justify-center gap-1 flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add bundle
                    </motion.button>
                  </div>
                </div>

                {/* DESKTOP layout: horizontal product chain + side bundle card */}
                <div className="hidden lg:flex lg:items-stretch gap-5">
                  {/* Product chain */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0 w-40">
                      <div className="aspect-square rounded-xl bg-gradient-cream border-2 border-primary/40 overflow-hidden p-2 relative">
                        {images[0] ? (
                          <img
                            src={images[0].node.url}
                            alt={product.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px] font-bold uppercase">
                          This item
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-foreground line-clamp-2">
                        {product.title}
                      </p>
                      <p className="text-xs text-primary font-bold">₹{price.toFixed(0)}</p>
                    </div>

                    {fbtCompanions.map((edge: any) => {
                      const p = edge.node;
                      const img = p.images?.edges?.[0]?.node?.url;
                      const pPrice = parseFloat(
                        p.variants?.edges?.[0]?.node?.price?.amount ?? "0",
                      );
                      const checked = !!fbtSelection[p.id];
                      return (
                        <div key={p.id} className="flex items-center flex-shrink-0 gap-3">
                          <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <label className="cursor-pointer flex-shrink-0 w-40 group">
                            <div
                              className={`aspect-square rounded-xl bg-gradient-cream border-2 overflow-hidden p-2 relative transition-all ${
                                checked
                                  ? "border-primary shadow-md"
                                  : "border-border/50 hover:border-primary/40"
                              }`}
                            >
                              {img ? (
                                <img
                                  src={img}
                                  alt={p.title}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  setFbtSelection((prev) => ({
                                    ...prev,
                                    [p.id]: e.target.checked,
                                  }))
                                }
                                className="absolute top-1.5 right-1.5 w-4 h-4 accent-primary cursor-pointer"
                              />
                            </div>
                            <p className="mt-2 text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {p.title}
                            </p>
                            <p className="text-xs text-primary font-bold">
                              ₹{pPrice.toFixed(0)}
                            </p>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bundle total */}
                  <div className="w-72 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/5 via-brand-yellow/5 to-transparent border border-primary/15 p-4 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Bundle total
                      </p>
                      <p className="text-3xl font-extrabold text-foreground tabular-nums mt-1">
                        ₹{fbtBundleTotal.toFixed(0)}
                      </p>
                      <p className="text-xs text-green-700 font-semibold mt-0.5">
                        {Object.values(fbtSelection).filter(Boolean).length} extras selected
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddBundle}
                      disabled={isLoading}
                      className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add bundle to cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* ===== TABS SECTION ===== */}
          <ScrollReveal className="mt-8 sm:mt-12">
            <div className="border border-border/50 rounded-2xl overflow-hidden bg-card">
              {/* Tab Headers — horizontal scroll on mobile with smaller pills */}
              <div
                className="flex overflow-x-auto scrollbar-hide border-b border-border/50 snap-x snap-mandatory sm:snap-none -mx-1 px-1 sm:mx-0 sm:px-0"
                data-lenis-prevent
              >
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 snap-start px-3.5 sm:px-5 py-3 sm:py-3.5 text-[11px] sm:text-sm font-semibold transition-all relative whitespace-nowrap tracking-wider ${
                      activeTab === tab
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tab.toUpperCase()}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
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
                  className="p-4 sm:p-6 lg:p-8"
                >
                  {activeTab === "Key Ingredients" && (
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {KEY_INGREDIENTS.map((ing) => (
                        <div
                          key={ing.name}
                          className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10"
                        >
                          <span className="text-2xl sm:text-3xl flex-shrink-0">
                            {ing.emoji}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">
                              {ing.name}
                            </h4>
                            <p className="text-[12px] sm:text-sm text-muted-foreground leading-relaxed">
                              {ing.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "How to Use" && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        Directions for Use
                      </h3>
                      <ol className="space-y-2.5 sm:space-y-3">
                        {HOW_TO_USE_STEPS.map((step, i) => (
                          <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">
                              {step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {activeTab === "Benefits" && (
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {BENEFITS_LIST.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-cream border border-border/30"
                        >
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-foreground text-[13px] sm:text-sm mb-0.5">
                              {b.title}
                            </h4>
                            <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed">
                              {b.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "Suitable For" && (
                    <div className="space-y-2.5 sm:space-y-3">
                      {SUITABLE_FOR.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/40"
                        >
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                          </span>
                          <p className="text-[13px] sm:text-sm text-foreground leading-relaxed">
                            {item}
                          </p>
                        </div>
                      ))}
                      <p className="text-[11px] sm:text-xs text-muted-foreground italic mt-3 leading-relaxed">
                        ⚕️ Consult a qualified healthcare professional to ensure
                        suitability based on individual health conditions.
                      </p>
                    </div>
                  )}

                  {activeTab === "FAQs" && (
                    <div className="space-y-2">
                      {FAQS.map((faq, i) => (
                        <div
                          key={i}
                          className="border border-border/50 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 text-left hover:bg-muted/30 transition-colors"
                          >
                            <span className="text-[13px] sm:text-sm font-medium text-foreground">
                              {faq.q}
                            </span>
                            {openFaq === i ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
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
                                <p className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-[12.5px] sm:text-sm text-muted-foreground leading-relaxed">
                                  {faq.a}
                                </p>
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
          <ScrollReveal className="mt-8 sm:mt-12">
            <div
              id="reviews"
              className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6 lg:p-8 scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="min-w-0">
                  <span className="text-eyebrow text-primary">— Real users, real results</span>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground font-display">
                    Customer reviews
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Review form coming soon!")}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-foreground text-background text-[11px] sm:text-sm font-bold uppercase tracking-wider hover:opacity-90 transition flex-shrink-0"
                >
                  <span className="hidden sm:inline">Write a review</span>
                  <span className="sm:hidden">Write</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-5 sm:mb-7 pb-5 sm:pb-7 border-b border-border/50">
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 flex-shrink-0">
                  <p className="text-4xl sm:text-6xl font-extrabold text-foreground tabular-nums leading-none">
                    4.48
                  </p>
                  <div className="flex flex-col gap-0.5 sm:gap-0 items-start sm:items-start">
                    <div className="flex items-center gap-0.5 sm:mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            s <= 4
                              ? "text-brand-yellow fill-brand-yellow"
                              : "text-brand-yellow/40 fill-brand-yellow/40"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
                      Based on 25 verified reviews
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-1 sm:space-y-1.5 w-full">
                  {[
                    { stars: 5, count: 14 },
                    { stars: 4, count: 9 },
                    { stars: 3, count: 2 },
                    { stars: 2, count: 0 },
                    { stars: 1, count: 0 },
                  ].map((r) => (
                    <button
                      key={r.stars}
                      onClick={() =>
                        setReviewFilter(reviewFilter === r.stars ? "all" : r.stars)
                      }
                      className={`flex items-center gap-2 w-full text-left rounded-lg px-1.5 py-1 transition-colors ${
                        reviewFilter === r.stars
                          ? "bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-[11px] sm:text-xs text-muted-foreground w-3">
                        {r.stars}
                      </span>
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-yellow fill-brand-yellow flex-shrink-0" />
                      <div className="flex-1 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-yellow rounded-full transition-all"
                          style={{ width: `${(r.count / 25) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs text-muted-foreground w-5 text-right">
                        {r.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter + sort row — split into two flex rows on mobile so the
                  filter pills can scroll horizontally without crowding the
                  sort dropdown. Single row on tablet+. */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-2 mb-4 sm:mb-5">
                <div
                  className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0"
                  data-lenis-prevent
                >
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-muted-foreground mr-1 flex-shrink-0">
                    Filter:
                  </span>
                  {(["all", 5, 4, 3] as Array<number | "all">).map((f) => (
                    <button
                      key={String(f)}
                      onClick={() => setReviewFilter(f)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold transition flex-shrink-0 ${
                        reviewFilter === f
                          ? "bg-foreground text-background"
                          : "bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {f === "all" ? "All" : `${f}★`}
                    </button>
                  ))}
                </div>
                <span className="sm:ml-auto text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  Sort by
                  <select
                    value={reviewSort}
                    onChange={(e) =>
                      setReviewSort(e.target.value as "recent" | "helpful")
                    }
                    className="px-2 py-1 rounded-md border border-border/50 bg-background text-[10px] sm:text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="recent">Most recent</option>
                    <option value="helpful">Most helpful</option>
                  </select>
                </span>
              </div>

              {/* Individual reviews — filtered + sorted */}
              <div className="space-y-3 sm:space-y-5">
                {(() => {
                  const list = MOCK_REVIEWS.map((r, i) => ({
                    ...r,
                    helpful: REVIEW_HELPFUL_SEED[i] ?? 0,
                  }))
                    .filter((r) => reviewFilter === "all" || r.rating === reviewFilter)
                    .sort((a, b) =>
                      reviewSort === "helpful" ? b.helpful - a.helpful : 0,
                    );
                  if (list.length === 0) {
                    return (
                      <p className="text-center text-xs sm:text-sm text-muted-foreground py-8">
                        No reviews match this filter yet.
                      </p>
                    );
                  }
                  return list.map((review, i) => (
                    <motion.div
                      key={review.name + review.date}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[13px] sm:text-sm font-semibold text-foreground truncate">
                                {review.name}
                              </p>
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[8.5px] sm:text-[9px] font-bold uppercase">
                                <BadgeCheck className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                s <= review.rating
                                  ? "text-brand-yellow fill-brand-yellow"
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] sm:text-sm font-semibold text-foreground mb-1">
                        {review.title}
                      </p>
                      <p className="text-[12.5px] sm:text-sm text-muted-foreground leading-relaxed mb-2.5 sm:mb-3">
                        {review.text}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-muted-foreground">
                        <button
                          type="button"
                          onClick={() => toast.success("Thanks for your feedback!")}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          Helpful · {review.helpful}
                        </button>
                      </div>
                    </motion.div>
                  ));
                })()}
              </div>
            </div>
          </ScrollReveal>

          {/* ===== RECOMMENDED PRODUCTS ===== */}
          {recommendedProducts.length > 0 && (
            <ScrollReveal className="mt-8 sm:mt-12">
              <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
                <div className="min-w-0">
                  <span className="text-eyebrow text-primary">— You may also like</span>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground font-display">
                    Recommended for you
                  </h2>
                </div>
                <Link
                  to="/collections/$handle"
                  params={{ handle: "all" }}
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4 flex-shrink-0"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 items-stretch">
                {recommendedProducts.map((edge: any) => {
                  const p = edge.node;
                  const img = p.images?.edges?.[0]?.node?.url;
                  const variantNode = p.variants?.edges?.[0]?.node;
                  const pPrice = parseFloat(variantNode?.price?.amount ?? "0");
                  const pCompare = variantNode?.compareAtPrice
                    ? parseFloat(variantNode.compareAtPrice.amount)
                    : null;
                  const pDiscount =
                    pCompare && pCompare > pPrice
                      ? Math.round(((pCompare - pPrice) / pCompare) * 100)
                      : 0;
                  return (
                    <Link
                      key={p.id}
                      to="/product/$handle"
                      params={{ handle: p.handle }}
                      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-2 border-border/90 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card-hover sm:rounded-2xl"
                    >
                      <div className="relative aspect-square shrink-0 overflow-hidden bg-gradient-cream">
                        {img ? (
                          <img
                            src={img}
                            alt={p.title}
                            className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                          </div>
                        )}
                        {pDiscount > 0 && (
                          <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-bold shadow">
                            {pDiscount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col p-2.5 sm:p-3.5">
                        <div className="flex items-center gap-0.5 sm:gap-1 mb-1 shrink-0">
                          {[1, 2, 3, 4].map((s) => (
                            <Star
                              key={s}
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-yellow fill-brand-yellow"
                            />
                          ))}
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-yellow/40 fill-brand-yellow/40" />
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground ml-0.5 sm:ml-1">
                            (4.5)
                          </span>
                        </div>
                        <h3
                          title={p.title}
                          className="mb-1 line-clamp-3 text-[12px] font-semibold leading-snug text-foreground break-words hyphens-auto sm:mb-1.5 sm:text-sm group-hover:text-primary transition-colors"
                        >
                          {p.title}
                        </h3>
                        <div className="mt-auto flex flex-wrap items-baseline gap-1.5 sm:gap-2 pt-1">
                          <p className="text-[13px] sm:text-base font-bold text-foreground">
                            ₹{pPrice.toFixed(0)}
                          </p>
                          {pCompare && pCompare > pPrice && (
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground line-through">
                              ₹{pCompare.toFixed(0)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Sticky mobile CTA — adds product thumb + price + ATC.
          Uses tight spacing so it works comfortably even at 320px width. */}
      <div className="fixed bottom-16 lg:hidden left-0 right-0 z-40 glass border-t border-border/50 px-2.5 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-lg bg-gradient-cream flex-shrink-0 overflow-hidden border border-border/40">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage].node.url}
                alt={product.title}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-shrink-0 min-w-0">
            <p className="text-[15px] font-bold text-foreground leading-none tabular-nums">
              ₹{price.toFixed(0)}
            </p>
            {discount > 0 ? (
              <p className="text-[9.5px] text-red-500 font-bold mt-0.5">
                {discount}% OFF
              </p>
            ) : (
              comparePrice &&
              comparePrice > price && (
                <p className="text-[9.5px] text-muted-foreground line-through mt-0.5">
                  ₹{comparePrice.toFixed(0)}
                </p>
              )
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isLoading || !inStock}
            className="flex-1 min-w-0 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-[11px] disabled:opacity-50 uppercase tracking-wider inline-flex items-center justify-center gap-1"
          >
            {isLoading ? "Adding…" : inStock ? "Add to Cart" : "Sold out"}
          </motion.button>
        </div>
      </div>

      {/* Sticky desktop CTA — only appears once the in-page ATC scrolls out. */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border/50 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-cream flex-shrink-0 overflow-hidden border border-border/40">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={product.title}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {product.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    ₹{price.toFixed(0)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{comparePrice.toFixed(0)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="inline-flex items-center border border-border rounded-xl bg-card flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-9 flex items-center justify-center hover:bg-muted transition-colors rounded-l-xl"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center font-semibold text-foreground text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="h-10 w-9 flex items-center justify-center hover:bg-muted transition-colors rounded-r-xl"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={isLoading || !inStock}
                className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Add to cart</>
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!inStock}
                className="h-10 px-6 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                Buy now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image lightbox modal */}
      <AnimatePresence>
        {lightboxOpen && images[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(
                      (selectedImage - 1 + images.length) % images.length,
                    );
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((selectedImage + 1) % images.length);
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
            <motion.img
              key={selectedImage}
              src={images[selectedImage].node.url}
              alt={images[selectedImage].node.altText || product.title}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl"
            />
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-xs font-semibold">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

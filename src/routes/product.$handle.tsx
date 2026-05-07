import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingCart, ChevronLeft, Star, Minus, Plus, Truck, Shield, Leaf } from "lucide-react";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "Product — DARDGO Ayurvedic Pain Relief" },
      { name: "description", content: "Premium Ayurvedic pain relief product by DARDGO. 100% natural, no side effects." },
    ],
  }),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
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
      <div className="min-h-screen">
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
      <div className="min-h-screen">
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-6 sm:py-10 pb-28 lg:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to products
            </Link>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Images */}
            <ScrollReveal>
              <div>
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-cream mb-4 shadow-card">
                  {images[selectedImage] ? (
                    <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package className="w-20 h-20 text-muted-foreground" /></div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {images.map((img: any, i: number) => (
                      <button key={i} onClick={() => setSelectedImage(i)} className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === selectedImage ? 'border-primary shadow-brand' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                        <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Details */}
            <ScrollReveal delay={0.1}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />)}
                  </div>
                  <span className="text-xs text-muted-foreground">(4.8 • 120 reviews)</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{product.title}</h1>
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-4">₹{variant ? parseFloat(variant.price.amount).toFixed(0) : ""}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

                {/* Variants */}
                {product.variants.edges.length > 1 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-foreground mb-2">Select Option</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((v: any, i: number) => (
                        <button
                          key={v.node.id}
                          onClick={() => setSelectedVariant(i)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            i === selectedVariant ? 'bg-primary text-primary-foreground shadow-brand' : 'bg-muted hover:bg-primary/10 text-foreground'
                          }`}
                        >
                          {v.node.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-2">Quantity</h3>
                  <div className="inline-flex items-center gap-1 bg-muted/60 rounded-xl p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3 mb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={isLoading || !variant?.availableForSale}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-brand"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
                  </motion.button>
                  <a
                    href={`https://wa.me/918430739932?text=Hi%2C%20I%20want%20to%20order%20${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-6 rounded-2xl bg-gradient-orange text-white font-bold text-sm hover:shadow-lg transition-all"
                  >
                    Buy Now
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-5 text-xs text-muted-foreground mb-8">
                  <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-primary" /> Free Shipping</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary" /> Secure</span>
                  <span className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-primary" /> 100% Natural</span>
                </div>

                {/* Benefits & How to Use */}
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                    <h3 className="font-semibold text-foreground mb-3">Benefits</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✅ 100% Natural Ayurvedic Formula</li>
                      <li>✅ Fast Acting Pain Relief</li>
                      <li>✅ No Side Effects</li>
                      <li>✅ Suitable for All Ages</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-cream rounded-3xl p-6 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-3">How to Use</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Clean the affected area</li>
                      <li>Apply a small amount of product</li>
                      <li>Massage gently for 2-3 minutes</li>
                      <li>Use 2-3 times daily for best results</li>
                    </ol>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-border/50 p-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-lg font-bold text-foreground">₹{variant ? parseFloat(variant.price.amount).toFixed(0) : ""}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50"
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

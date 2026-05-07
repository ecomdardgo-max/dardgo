import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingCart, SlidersHorizontal, Star, Heart, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/collections/$handle")({
  component: CollectionPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle === "all" ? "All Products" : params.handle} — DARDGO` },
      { name: "description", content: "Browse DARDGO's premium Ayurvedic wellness products. 100% natural, AYUSH certified, and doctor recommended." },
    ],
  }),
});

const sortOptions = ["Best Selling", "Price: Low to High", "Price: High to Low", "Newest"];

function CollectionPage() {
  const { handle } = Route.useParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    async function load() {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 24 });
        setProducts(data?.data?.products?.edges || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle]);

  const handleAddToCart = async (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart!", { description: product.node.title });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1">
                  {handle === "all" ? "All Products" : handle}
                </h1>
                <p className="text-sm text-muted-foreground">{products.length} products</p>
              </div>
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </ScrollReveal>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-3">Sort By</h3>
                  <div className="space-y-1.5">
                    {sortOptions.map((opt) => (
                      <button key={opt} className="block text-sm text-muted-foreground hover:text-primary py-1.5 transition-colors w-full text-left">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-3">Categories</h3>
                  <div className="space-y-1.5">
                    {["All", "Pain Relief", "Joint Care", "Immunity", "Digestive", "Beauty"].map((cat) => (
                      <button key={cat} className="block text-sm text-muted-foreground hover:text-primary py-1.5 transition-colors w-full text-left">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                  {products.map((product, i) => {
                    const image = product.node.images.edges[0]?.node;
                    const price = product.node.priceRange.minVariantPrice;
                    return (
                      <ScrollReveal key={product.node.id} delay={i * 0.03}>
                        <Link
                          to="/product/$handle"
                          params={{ handle: product.node.handle }}
                          className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 block"
                        >
                          <div className="aspect-square bg-gradient-cream overflow-hidden relative">
                            {image ? (
                              <img src={image.url} alt={image.altText || product.node.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-muted-foreground" /></div>
                            )}
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Heart className="w-4 h-4 text-foreground/60" />
                            </button>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 text-[10px] font-semibold shadow-soft">
                              <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />4.8
                            </div>
                          </div>
                          <div className="p-3.5 sm:p-4">
                            <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-2 line-clamp-2">{product.node.title}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-base font-bold text-foreground">₹{parseFloat(price.amount).toFixed(0)}</span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={isLoading}
                                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </Link>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm lg:hidden"
                onClick={() => setFilterOpen(false)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-foreground">Filters & Sort</h3>
                    <button onClick={() => setFilterOpen(false)} className="p-2 rounded-xl hover:bg-muted"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-4">
                    {sortOptions.map((opt) => (
                      <button key={opt} className="block text-sm text-muted-foreground hover:text-primary py-2 w-full text-left">{opt}</button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

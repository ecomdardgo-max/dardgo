import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart, Package, Star, Heart } from "lucide-react";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export function ProductShowcase() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    async function load() {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 12 });
        setProducts(data?.data?.products?.edges || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
    <section id="products" className="py-16 sm:py-24 lg:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
            <span className="text-eyebrow text-brand-orange mb-4 block">— Best sellers</span>
            <h2 className="text-display-2 text-foreground mb-4">
              Our most loved{" "}
              <span className="text-gradient-green">products</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Premium Ayurvedic wellness products trusted by thousands of families across India.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Products will appear here once they are added to the store.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product, i) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              return (
                <ScrollReveal key={product.node.id} delay={i * 0.05}>
                  <Link
                    to="/product/$handle"
                    params={{ handle: product.node.handle }}
                    className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 block"
                  >
                    <div className="aspect-square bg-gradient-cream overflow-hidden relative">
                      {image ? (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                      )}
                      {/* Wishlist button */}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-soft"
                      >
                        <Heart className="w-4 h-4 text-foreground/60" />
                      </button>
                      {/* Rating badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-semibold shadow-soft">
                        <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-1.5 line-clamp-2 leading-snug">
                        {product.node.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 line-clamp-1 hidden sm:block">
                        {product.node.description}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-base sm:text-lg font-bold text-foreground">
                            ₹{parseFloat(price.amount).toFixed(0)}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-[11px] sm:text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add</span>
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
    </section>
  );
}

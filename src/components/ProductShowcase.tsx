import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart, Package, Star, Heart } from "lucide-react";
import { CUSTOMER_FAVOURITES, fetchCatalogProducts } from "@/lib/product-catalog";
import type { ShopifyProduct } from "@/lib/shopify";
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
        setProducts(await fetchCatalogProducts(CUSTOMER_FAVOURITES, 8));
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
            <span className="text-eyebrow text-brand-orange mb-4 block">— Shop the range</span>
            <h2 className="text-display-2 text-foreground mb-4">
              Customer <span className="text-gradient-green">favourites</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Ayurvedic-inspired oils, topicals, and daily wellness staples — curated for quality
              and transparent labeling.
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            {products.map((product, i) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              const displayPrice = parseFloat(price.amount);
              return (
                <ScrollReveal key={product.node.id} delay={i * 0.05} className="h-full min-w-0">
                  <Link
                    to="/product/$handle"
                    params={{ handle: product.node.handle }}
                    className="group flex h-full w-full min-h-0 flex-col overflow-hidden rounded-3xl border-2 border-border/90 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-square shrink-0 overflow-hidden bg-gradient-cream">
                      {image ? (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Package className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                      )}
                      {/* Wishlist button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-soft backdrop-blur-sm transition-opacity hover:bg-white group-hover:opacity-100"
                      >
                        <Heart className="h-4 w-4 text-foreground/60" />
                      </button>
                      {/* Rating badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold shadow-soft backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
                      <h3
                        title={product.node.title}
                        className="mb-1.5 line-clamp-4 min-h-0 shrink-0 text-[13px] font-semibold leading-[1.35] text-foreground break-words hyphens-auto sm:text-[15px] sm:leading-snug"
                      >
                        {product.node.title}
                      </h3>
                      <div className="min-h-[2px] flex-1" aria-hidden />
                      <div className="flex shrink-0 items-end justify-between gap-2 border-t border-border/50 pt-3">
                        <div>
                          <span className="text-base font-bold text-foreground sm:text-lg">
                            ₹{displayPrice.toFixed(0)}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={isLoading}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-xs"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>Add</span>
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

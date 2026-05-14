import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingCart, SlidersHorizontal, Star, Heart, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { SHOP_CATEGORIES } from "@/lib/shop-categories";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/collections/$handle")({
  component: CollectionPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle === "all" ? "All Products" : params.handle} — DARDGO` },
      {
        name: "description",
        content:
          "Browse DARDGO Ayurvedic-inspired herbal wellness products — oils, topicals, and daily comfort essentials with transparent labeling.",
      },
    ],
  }),
});

const sortOptions = ["Best Selling", "Price: Low to High", "Price: High to Low", "Newest"] as const;

type SortOption = (typeof sortOptions)[number];

const SORT_TO_STOREFRONT: Record<SortOption, { sortKey: string; reverse: boolean }> = {
  "Best Selling": { sortKey: "BEST_SELLING", reverse: false },
  "Price: Low to High": { sortKey: "PRICE", reverse: false },
  "Price: High to Low": { sortKey: "PRICE", reverse: true },
  Newest: { sortKey: "CREATED_AT", reverse: true },
};

function CollectionPage() {
  const { handle } = Route.useParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("Best Selling");
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        // For category pages we filter by the `category-<handle>` tag that the
        // CSV importer stamps on every product. The "all" handle returns the
        // full catalogue (no filter applied).
        const sort = SORT_TO_STOREFRONT[sortBy];
        const variables: Record<string, unknown> = {
          first: 50,
          sortKey: sort.sortKey,
          reverse: sort.reverse,
        };
        if (handle && handle !== "all") {
          variables.query = `tag:category-${handle}`;
        }
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, variables);
        if (!cancelled) {
          setProducts(data?.data?.products?.edges || []);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [handle, sortBy]);

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
      <div className="py-6 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-start justify-between gap-3 mb-6 sm:mb-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-4xl font-bold text-foreground mb-1 capitalize break-words">
                  {handle === "all"
                    ? "All Products"
                    : handle === "pain-relief-oils"
                      ? "Wellness oils & roll-ons"
                      : handle === "ayurvedic-tablets"
                        ? "Ayurvedic Tablets"
                        : handle === "ayurvedic-beauty"
                          ? "Ayurvedic Beauty Products"
                          : handle === "ayurvedic-halwa"
                            ? "Ayurvedic Halwa Formation"
                            : handle === "ayurvedic-powder"
                              ? "Ayurvedic Powder Formation"
                              : handle.replace(/-/g, " ")}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {products.length} products
                </p>
              </div>
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-muted text-xs sm:text-sm font-medium flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </ScrollReveal>

          <div className="flex gap-6 lg:gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-3">Sort By</h3>
                  <div className="space-y-1.5">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSortBy(opt)}
                        className={cn(
                          "block w-full py-1.5 text-left text-sm transition-colors",
                          sortBy === opt
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-3">Categories</h3>
                  <div className="space-y-1.5">
                    <Link
                      to="/collections/$handle"
                      params={{ handle: "all" }}
                      className={cn(
                        "block py-1.5 text-sm transition-colors",
                        handle === "all"
                          ? "font-semibold text-primary"
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      All products
                    </Link>
                    {SHOP_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.handle}
                        to="/collections/$handle"
                        params={{ handle: cat.handle }}
                        className={cn(
                          "block py-1.5 text-sm transition-colors",
                          handle === cat.handle
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
                  {products.map((product, i) => {
                    const image = product.node.images.edges[0]?.node;
                    const price = product.node.priceRange.minVariantPrice;
                    const displayPrice = parseFloat(price.amount);
                    return (
                      <ScrollReveal
                        key={product.node.id}
                        delay={i * 0.03}
                        className="h-full min-w-0"
                      >
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-soft backdrop-blur-sm transition-opacity hover:bg-white group-hover:opacity-100"
                            >
                              <Heart className="h-4 w-4 text-foreground/60" />
                            </button>
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
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="p-2 rounded-xl hover:bg-muted"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Sort
                      </p>
                      {sortOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSortBy(opt);
                            setFilterOpen(false);
                          }}
                          className={cn(
                            "block w-full py-2 text-left text-sm transition-colors",
                            sortBy === opt
                              ? "font-semibold text-primary"
                              : "text-muted-foreground hover:text-primary",
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Categories
                      </p>
                      <Link
                        to="/collections/$handle"
                        params={{ handle: "all" }}
                        onClick={() => setFilterOpen(false)}
                        className={cn(
                          "block py-2 text-sm transition-colors",
                          handle === "all"
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        All products
                      </Link>
                      {SHOP_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.handle}
                          to="/collections/$handle"
                          params={{ handle: cat.handle }}
                          onClick={() => setFilterOpen(false)}
                          className={cn(
                            "block py-2 text-sm transition-colors",
                            handle === cat.handle
                              ? "font-semibold text-primary"
                              : "text-muted-foreground hover:text-primary",
                          )}
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
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

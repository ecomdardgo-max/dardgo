import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  CATALOG_SECTIONS,
  CUSTOMER_FAVOURITES,
  fetchCatalogProducts,
  type CatalogSection,
} from "@/lib/product-catalog";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowRight, Loader2, Package, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { MouseEvent } from "react";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Shop by Category — DARDGO Ayurvedic Products" },
      {
        name: "description",
        content:
          "Browse all DARDGO products by category — wellness oils, tablets, capsules, beauty, and more.",
      },
    ],
  }),
});

type CategoryRow = {
  category: {
    label: string;
    handle: string;
    emoji: string;
    desc: string;
  };
  products: ShopifyProduct[];
};

const MOBILE_CATEGORY_SECTIONS: Array<{
  section: CatalogSection | null;
  label: string;
  handle: string;
  emoji: string;
  desc: string;
  products: typeof CUSTOMER_FAVOURITES;
}> = [
  {
    section: null,
    label: "Customer Favourites",
    handle: "customer-favourites",
    emoji: "⭐",
    desc: "Top picks",
    products: CUSTOMER_FAVOURITES,
  },
  ...CATALOG_SECTIONS.map((section) => ({
    section,
    label: section.title,
    handle: section.collectionHandle,
    emoji: section.emoji,
    desc: section.desc,
    products: section.products,
  })),
];

function CategoriesPage() {
  const [sections, setSections] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const results = await Promise.all(
          MOBILE_CATEGORY_SECTIONS.map(async (row) => {
            try {
              const products = await fetchCatalogProducts(row.products, 50);
              return {
                category: {
                  label: row.label,
                  handle: row.handle,
                  emoji: row.emoji,
                  desc: row.desc,
                },
                products,
              };
            } catch (err) {
              console.error(`Failed to load ${row.handle}:`, err);
              return {
                category: {
                  label: row.label,
                  handle: row.handle,
                  emoji: row.emoji,
                  desc: row.desc,
                },
                products: [] as ShopifyProduct[],
              };
            }
          }),
        );
        if (!cancelled) {
          setSections(results.filter((s) => s.products.length > 0));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToCategory = (handle: string) => {
    const el = document.getElementById(`category-${handle}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pb-24 lg:pb-12">
        <div className="border-b border-border/50 bg-gradient-cream/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <ScrollReveal>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display mb-1">
                Shop by category
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                All products grouped by category — scroll or tap a category below.
              </p>
            </ScrollReveal>
            {!loading && sections.length > 0 && (
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1"
                data-lenis-prevent
              >
                {sections.map(({ category }) => (
                  <button
                    key={category.handle}
                    type="button"
                    onClick={() => scrollToCategory(category.handle)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/60 bg-card text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <span aria-hidden>{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
                <Link
                  to="/collections/$handle"
                  params={{ handle: "all" }}
                  className="flex-shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                >
                  All products
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found in categories yet.</p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {sections.map(({ category, products }, sectionIdx) => (
                <section
                  key={category.handle}
                  id={`category-${category.handle}`}
                  className="scroll-mt-36 sm:scroll-mt-40"
                >
                  <ScrollReveal delay={sectionIdx * 0.03}>
                    <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
                      <div className="min-w-0">
                        <span className="text-2xl sm:text-3xl mr-2" aria-hidden>
                          {category.emoji}
                        </span>
                        <h2 className="inline text-xl sm:text-2xl font-bold text-foreground font-display align-middle">
                          {category.label}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">{category.desc}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {products.length} product{products.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Link
                        to="/collections/$handle"
                        params={{ handle: category.handle }}
                        className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        View all
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                      {products.map((product, i) => (
                        <ScrollReveal key={product.node.id} delay={i * 0.02}>
                          <CategoryProductCard product={product} />
                        </ScrollReveal>
                      ))}
                    </div>
                  </ScrollReveal>
                </section>
              ))}
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

function CategoryProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const soldOut = variant ? !variant.availableForSale : false;

  async function handleAddToCart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!variant?.availableForSale) {
      toast.error("Out of stock");
      return;
    }
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Added to cart!", { description: node.title });
  }

  return (
    <Link
      to="/product/$handle"
      params={{ handle: node.handle }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border/50 bg-card shadow-sm hover:shadow-card-hover hover:border-primary/30 transition-all"
    >
      <div className="relative aspect-square bg-gradient-cream overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="px-2 py-1 rounded-full bg-white text-xs font-bold">Sold out</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/90 text-[10px] font-semibold">
          <Star className="w-3 h-3 fill-brand-yellow text-brand-yellow" />
          4.8
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-3 leading-snug mb-2 flex-1">
          {node.title}
        </h3>
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border/40">
          <span className="text-sm sm:text-base font-bold">₹{parseFloat(price.amount).toFixed(0)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading || soldOut}
            className="inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

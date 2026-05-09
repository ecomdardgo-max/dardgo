import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Loader2, Package, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ScrollReveal } from "@/components/ScrollReveal";

// The exact homepage layout used on dardgo.com — categories appear in this
// order, each surfacing the first 4 products from the matching collection
// followed by a "View More" link to the full collection page.
const FEATURED_COLLECTIONS: Array<{
  handle: string;
  title: string;
  tagline: string;
  accent: "primary" | "yellow" | "orange" | "green";
}> = [
  {
    handle: "pain-relief-oils",
    title: "Pain Relief Oils & Roll On",
    tagline: "Natural comfort support for everyday wellness and relaxation.",
    accent: "primary",
  },
  {
    handle: "ayurvedic-tablets",
    title: "Ayurvedic Tablets",
    tagline: "Nature's wellness in every tablet — naturally effective, purely Ayurvedic.",
    accent: "yellow",
  },
  {
    handle: "ayurvedic-beauty",
    title: "Ayurvedic Beauty Products",
    tagline: "Pure Ayurveda for pure beauty. Glow naturally with Ayurveda.",
    accent: "orange",
  },
  {
    handle: "ayurvedic-halwa",
    title: "Ayurvedic Halwa Formation",
    tagline: "Wholesome Halwa, holistic health. Ancient recipes, modern wellness.",
    accent: "green",
  },
  {
    handle: "ayurvedic-powder",
    title: "Ayurvedic Powder Formation",
    tagline: "Pure power of Ayurveda — ancient wisdom in every spoon.",
    accent: "primary",
  },
  {
    handle: "ayurvedic-capsules",
    title: "Ayurvedic Capsules",
    tagline: "Concentrated herbal goodness in every capsule.",
    accent: "orange",
  },
];

const PRODUCTS_PER_COLLECTION = 4;

const accentClasses: Record<string, { eyebrow: string; gradient: string }> = {
  primary: { eyebrow: "text-primary", gradient: "text-gradient-green" },
  yellow: { eyebrow: "text-brand-orange", gradient: "text-gradient-gold" },
  orange: { eyebrow: "text-brand-orange", gradient: "text-gradient-orange" },
  green: { eyebrow: "text-primary", gradient: "text-gradient-green" },
};

export function CollectionShowcases() {
  // Each section loads products via Storefront `tag:category-<handle>` — same tags as CSV import.
  // Shopify smart collections (npm run seed:smart-collections) use the same tags so collection pages stay in sync.
  const [productsByCategory, setProductsByCategory] = useState<
    Array<ShopifyProduct[] | null>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const results = await Promise.all(
          FEATURED_COLLECTIONS.map(async (c) => {
            try {
              // Storefront API supports `tag:<value>` in the products `query`
              // argument. The CSV importer adds `category-<handle>` to every
              // product so this filter perfectly mirrors the category sections.
              const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, {
                first: PRODUCTS_PER_COLLECTION,
                query: `tag:category-${c.handle}`,
              });
              const edges = (data?.data?.products?.edges as ShopifyProduct[] | undefined) ?? [];
              return edges;
            } catch (err) {
              console.error(`Failed to load category ${c.handle}:`, err);
              return null;
            }
          }),
        );
        if (!cancelled) setProductsByCategory(results);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-16 sm:py-24 scroll-mt-20">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Skip categories that returned no products so visitors never see an empty
  // header with nothing underneath.
  const populated = FEATURED_COLLECTIONS.map((meta, i) => ({
    meta,
    products: productsByCategory[i] ?? [],
  })).filter(({ products }) => products.length > 0);

  if (populated.length === 0) {
    return (
      <section id="products" className="py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4 mx-auto">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground text-sm">
            Make sure the imported products carry the <code className="px-1.5 py-0.5 rounded bg-muted text-xs">category-*</code> tags.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="scroll-mt-20">
      {populated.map(({ meta, products }, i) => (
        <CollectionBlock
          key={meta.handle}
          meta={meta}
          products={products}
          alternate={i % 2 === 1}
        />
      ))}
    </section>
  );
}

interface CollectionBlockProps {
  meta: (typeof FEATURED_COLLECTIONS)[number];
  products: ShopifyProduct[];
  alternate: boolean;
}

function CollectionBlock({ meta, products, alternate }: CollectionBlockProps) {
  const accent = accentClasses[meta.accent];
  return (
    <div className={alternate ? "bg-gradient-cream/40" : "bg-background"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
            <div className="max-w-2xl">
              <span className={`text-eyebrow ${accent.eyebrow} mb-3 block`}>— {meta.title}</span>
              <h2 className="text-display-3 text-foreground mb-3">
                Discover our <span className={accent.gradient}>{shortTitle(meta.title)}</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{meta.tagline}</p>
            </div>
            <Link
              to="/collections/$handle"
              params={{ handle: meta.handle }}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto"
            >
              View More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product, idx) => (
            <ScrollReveal key={product.node.id} delay={idx * 0.05}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile-only "View More" link below the grid */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/collections/$handle"
            params={{ handle: meta.handle }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold"
          >
            View More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const soldOut = variant ? !variant.availableForSale : false;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || !variant.availableForSale) {
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
      className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 block"
    >
      <div className="aspect-square bg-gradient-cream overflow-hidden relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Package className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        )}

        {soldOut && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-white text-foreground text-xs font-bold tracking-wide">
              Sold Out
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-soft"
        >
          <Heart className="w-4 h-4 text-foreground/60" />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-semibold shadow-soft">
          <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
          <span>4.8</span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4">
        <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-1.5 line-clamp-2 leading-snug">
          {node.title}
        </h3>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="text-base sm:text-lg font-bold text-foreground">
            ₹{parseFloat(price.amount).toFixed(0)}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={isLoading || soldOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-[11px] sm:text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{soldOut ? "Sold" : "Add"}</span>
          </motion.button>
        </div>
      </div>
    </Link>
  );
}

// "Pain Relief Oils & Roll On" → "pain relief oils" (drops the leading
// adjective like "Ayurvedic" so the second half can be styled as gradient).
function shortTitle(title: string): string {
  const lower = title.toLowerCase();
  return lower.replace(/^ayurvedic\s+/, "").replace(/&\s*roll on$/i, "& roll on");
}

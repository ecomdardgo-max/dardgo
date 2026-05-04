import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart, Package } from "lucide-react";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export function ProductShowcase() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);

  useEffect(() => {
    async function load() {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 8 });
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
    <section id="products" className="py-16 sm:py-24 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-4">
            Our <span className="text-primary">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium Ayurvedic pain relief solutions crafted with care
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-md">
              Products will appear here once they are added to the store.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              return (
                <Link
                  key={product.node.id}
                  to="/product/$handle"
                  params={{ handle: product.node.handle }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-brand transition-all duration-300 hover:-translate-y-1 border border-border/50"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-1 truncate">{product.node.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.node.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ₹{parseFloat(price.amount).toFixed(0)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

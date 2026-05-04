import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingCart, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { toast } from "sonner";

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
  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);

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
      quantity: 1,
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
      </div>
    );
  }

  const images = product.images.edges;
  const variant = product.variants.edges[selectedVariant]?.node;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to products
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                {images[selectedImage] ? (
                  <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-20 h-20 text-muted-foreground" /></div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img: any, i: number) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}>
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-primary mb-6">₹{variant ? parseFloat(variant.price.amount).toFixed(0) : ""}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Variants */}
              {product.variants.edges.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Select Option</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v: any, i: number) => (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariant(i)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          i === selectedVariant ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart - Sticky on mobile */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !variant?.availableForSale}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all disabled:opacity-50 shadow-brand"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-10 space-y-6">
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="font-semibold font-[var(--font-display)] text-foreground mb-3">Benefits</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ 100% Natural Ayurvedic Formula</li>
                    <li>✅ Fast Acting Pain Relief</li>
                    <li>✅ No Side Effects</li>
                    <li>✅ Suitable for All Ages</li>
                  </ul>
                </div>
                <div className="bg-brand-cream rounded-xl p-6">
                  <h3 className="font-semibold font-[var(--font-display)] text-foreground mb-3">How to Use</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Clean the affected area</li>
                    <li>Apply a small amount of product</li>
                    <li>Massage gently for 2-3 minutes</li>
                    <li>Use 2-3 times daily for best results</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

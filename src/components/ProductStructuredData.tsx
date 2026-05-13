import { SITE_URL } from "@/lib/compliance";

type Props = {
  product: {
    title: string;
    description?: string | null;
    handle: string;
    images?: { edges: { node: { url: string } }[] };
    variants?: {
      edges: {
        node: { price: { amount: string; currencyCode: string }; availableForSale?: boolean };
      }[];
    };
  };
};

export function ProductStructuredData({ product }: Props) {
  const img = product.images?.edges?.[0]?.node?.url;
  const variant = product.variants?.edges?.[0]?.node;
  const price = variant?.price;
  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description?.replace(/<[^>]+>/g, " ").slice(0, 5000) || product.title,
    image: img ? [img] : undefined,
    brand: {
      "@type": "Brand",
      name: "DARDGO",
    },
    sku: product.handle,
    offers: price
      ? {
          "@type": "Offer",
          url: `${SITE_URL}/product/${product.handle}`,
          priceCurrency: price.currencyCode || "INR",
          price: price.amount,
          availability: variant?.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "DardGo Pharma Pvt. Ltd.",
          },
        }
      : undefined,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

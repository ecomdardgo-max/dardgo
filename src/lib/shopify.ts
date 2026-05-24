import { toast } from "sonner";

const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION ?? "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string;

if (!SHOPIFY_STORE_PERMANENT_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  // Surface a clear error during dev/build instead of failing silently at runtime.
  throw new Error(
    "Missing Shopify env vars. Define VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in .env.local",
  );
}

const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
          image?: {
            url: string;
            altText: string | null;
          } | null;
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs to be upgraded to a paid plan.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

/** Match a variant image URL to an index in the product gallery (ignores query params). */
export function findProductImageIndexForVariant(
  images: Array<{ node: { url: string } }>,
  variantImageUrl: string | undefined | null,
): number {
  if (!variantImageUrl || images.length === 0) return 0;
  const normalize = (url: string) => url.split("?")[0].split("#")[0];
  const target = normalize(variantImageUrl);
  const exact = images.findIndex((e) => normalize(e.node.url) === target);
  if (exact >= 0) return exact;
  const file = target.split("/").pop();
  if (file) {
    const partial = images.findIndex((e) => e.node.url.includes(file));
    if (partial >= 0) return partial;
  }
  return 0;
}

/** Lightweight product fetch for grids — same `node` shape as `STOREFRONT_PRODUCTS_QUERY`. */
export const STOREFRONT_PRODUCT_CARD_BY_HANDLE_QUERY = `
  query CatalogProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export async function fetchShopifyProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCT_CARD_BY_HANDLE_QUERY, {
    handle,
  });
  const node = data?.data?.productByHandle;
  if (!node?.id) return null;
  return { node };
}

export const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

/**
 * Loads a single collection by handle along with its first N products.
 * Used by the homepage `CollectionShowcases` block (category × 4 products).
 */
export const STOREFRONT_COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 2) {
              edges { node { url altText } }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyCollectionWithProducts {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        description: string;
        handle: string;
        availableForSale: boolean;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
        images: { edges: Array<{ node: { url: string; altText: string | null } }> };
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              price: { amount: string; currencyCode: string };
              selectedOptions: Array<{ name: string; value: string }>;
            };
          }>;
        };
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
}

/** Handles used by CSV import tags (`category-<handle>`) + homepage category cards (same order as smart collections). */
export const CATEGORY_COLLECTION_HANDLES = [
  "pain-relief-oils",
  "ayurvedic-tablets",
  "ayurvedic-beauty",
  "ayurvedic-halwa",
  "ayurvedic-powder",
  "ayurvedic-capsules",
] as const;

/** Loads exactly those collections by handle so the grid matches CSV/category tagging order (not arbitrary first-N). */
export const STOREFRONT_CATEGORY_CARDS_QUERY = `
  fragment CategoryCardCollection on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
    }
  }
  query CategoryCardsCollections {
    col0: collection(handle: "pain-relief-oils") {
      ...CategoryCardCollection
    }
    col1: collection(handle: "ayurvedic-tablets") {
      ...CategoryCardCollection
    }
    col2: collection(handle: "ayurvedic-beauty") {
      ...CategoryCardCollection
    }
    col3: collection(handle: "ayurvedic-halwa") {
      ...CategoryCardCollection
    }
    col4: collection(handle: "ayurvedic-powder") {
      ...CategoryCardCollection
    }
    col5: collection(handle: "ayurvedic-capsules") {
      ...CategoryCardCollection
    }
  }
`;

export const STOREFRONT_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 50) {
        edges {
          node {
            url
            altText
          }
        }
      }
      media(first: 50) {
        edges {
          node {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      onlineStoreUrl
      dardgoNsPdpTabsMf: metafield(namespace: "dardgo", key: "pdp_tabs") {
        value
        type
      }
      dardgoNsKeyIngredientsMf: metafield(namespace: "dardgo", key: "key_ingredients") {
        value
        type
      }
      dardgoNsHowToUseMf: metafield(namespace: "dardgo", key: "how_to_use") {
        value
        type
      }
      dardgoNsBenefitsMf: metafield(namespace: "dardgo", key: "benefits") {
        value
        type
      }
      dardgoNsSuitableForMf: metafield(namespace: "dardgo", key: "suitable_for") {
        value
        type
      }
      dardgoNsStorageSafetyMf: metafield(namespace: "dardgo", key: "storage_safety") {
        value
        type
      }
      dardgoNsFaqsMf: metafield(namespace: "dardgo", key: "faqs") {
        value
        type
      }
      dardgoPdpTabsMetafield: metafield(namespace: "custom", key: "dardgo_pdp_tabs") {
        value
        type
      }
      dardgoKeyIngredientsMf: metafield(namespace: "custom", key: "dardgo_key_ingredients") {
        value
        type
      }
      dardgoHowToUseMf: metafield(namespace: "custom", key: "dardgo_how_to_use") {
        value
        type
      }
      dardgoBenefitsMf: metafield(namespace: "custom", key: "dardgo_benefits") {
        value
        type
      }
      dardgoSuitableForMf: metafield(namespace: "custom", key: "dardgo_suitable_for") {
        value
        type
      }
      dardgoStorageSafetyMf: metafield(namespace: "custom", key: "dardgo_storage_safety") {
        value
        type
      }
      dardgoFaqsMf: metafield(namespace: "custom", key: "dardgo_faqs") {
        value
        type
      }
      merchantKeyIngredientsLineMf: metafield(namespace: "custom", key: "key_ingredients") {
        value
        type
      }
      merchantHowToUseRichMf: metafield(namespace: "custom", key: "how_to_use") {
        value
        type
      }
      merchantDirectionRichMf: metafield(namespace: "custom", key: "direction") {
        value
        type
      }
      merchantSuitableForRichMf: metafield(namespace: "custom", key: "suitable_for") {
        value
        type
      }
      dardgoReviewsMf: metafield(namespace: "custom", key: "dardgo_reviews") {
        value
        type
      }
      metafields(
        identifiers: [
          { namespace: "reviews", key: "rating" },
          { namespace: "reviews", key: "rating_count" },
          { namespace: "custom", key: "dardgo_reviews" }
        ]
      ) {
        namespace
        key
        value
        type
      }
    }
  }
`;

// Cart mutations
export const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>,
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

export async function createShopifyCart(
  item: CartItem,
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });
  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error("Cart creation failed:", data.data.cartCreate.userErrors);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: CartItem,
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: { node: { id: string; merchandise: { id: string } } }) =>
      l.node.merchandise.id === item.variantId,
  );
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

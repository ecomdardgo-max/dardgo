import { CATALOG_SECTIONS, CUSTOMER_FAVOURITES, type CatalogSection } from "@/lib/product-catalog";

/** Navbar, /categories, and collection sidebars — main shop departments. */
export const SHOP_CATEGORIES = CATALOG_SECTIONS.map((s) => ({
  label: s.title,
  handle: s.collectionHandle,
  emoji: s.emoji,
  desc: s.desc,
}));

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export { CUSTOMER_FAVOURITES, CATALOG_SECTIONS, type CatalogSection };

/** Footer category links */
export const FOOTER_SHOP_CATEGORIES = [
  { label: "Customer favourites", handle: "customer-favourites" },
  ...CATALOG_SECTIONS.map((s) => ({
    label: s.title,
    handle: s.collectionHandle,
  })),
] as const;

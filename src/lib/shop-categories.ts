/** Same list as Navbar “Shop” mega-menu — collection handles must exist in Shopify. */
export const SHOP_CATEGORIES = [
  { label: "Wellness oils", handle: "pain-relief-oils", emoji: "💧", desc: "Massage & comfort" },
  { label: "Joint care", handle: "ayurvedic-tablets", emoji: "🦴", desc: "Mobility routines" },
  { label: "Immunity support", handle: "ayurvedic-capsules", emoji: "🛡️", desc: "Daily balance" },
  { label: "Digestive care", handle: "ayurvedic-halwa", emoji: "🌿", desc: "Gentle wellness" },
  { label: "Beauty & skin", handle: "ayurvedic-beauty", emoji: "✨", desc: "Botanical care" },
  { label: "Women's wellness", handle: "ayurvedic-powder", emoji: "🌸", desc: "Holistic support" },
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

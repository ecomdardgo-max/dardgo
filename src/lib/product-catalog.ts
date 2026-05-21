import type { ShopifyProduct } from "@/lib/shopify";
import { fetchShopifyProductByHandle } from "@/lib/shopify";

/** Shopify product handle — include legacy + CSV import variants for lookup resilience. */
export type ProductHandle = string;

export type CatalogProduct = {
  label: string;
  /** First matching published product is used on the storefront. */
  handles: ProductHandle[];
};

export type CatalogSection = {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  desc: string;
  collectionHandle: string;
  products: CatalogProduct[];
  accent: "primary" | "yellow" | "orange" | "green";
};

const H = {
  painOil: [
    "dardgo-herbal-pain-relief-massage-oil-supports-muscle-relaxation-care",
    "dardgo-herbal-pain-relief-massage-oil",
  ],
  rollOn: [
    "dardgo-ayurvedic-pain-relief-roll-on-joint-muscle-support-60-ml",
    "dardgo-ayurvedic-pain-relief-roll-on",
  ],
  sciatica: [
    "dardgo-ayurvedic-sciatica-tablets-for-joint-comfort-flexibility-60-tablets",
    "dardgo-ayurvedic-sciatica-tablets",
  ],
  skinGlow: [
    "dardgo-ayurvedic-skin-glow-syrup-natural-blood-purifier-for-healthy-skin-200-ml",
    "dardgo-ayurvedic-skin-glow-syrup",
  ],
  sugarPowder: [
    "dardgo-ayurvedic-sugar-control-powder-diabetes-care-support-100-natural-formulation-120-gm",
    "dardgo-ayurvedic-sugar-control-powder",
  ],
  goldenPowder: [
    "dardgo-golden-powder-weight-management-digestion-obesity-control-gastric-problems",
    "dardgo-golden-powder",
  ],
  pilesHalwa: [
    "dardgo-ayurvedic-piles-fighter-halwa-natural-herbal-remedy-for-hemorrhoid-relief-digestive-welln",
    "dardgo-ayurvedic-piles-fighter-halwa",
  ],
  hairOil: [
    "dardgo-ayurvedic-hair-oil-for-hair-fall-dandruff-hair-growth-100-natural-non-sticky-15-herb-nour",
    "dardgo-ayurvedic-hair-oil",
  ],
  stoneFree: [
    "dardgo-ayurvedic-stone-free-tablets-for-kidney-stone-care-urinary-tract-wellness",
    "dardgo-ayurvedic-stone-free-tablets",
  ],
  dissolveBall: [
    "dardgo-dissolve-boll-tablets-ayurvedic-bone-comfort-detox-support",
    "dardgo-dissolve-boll-tablets",
  ],
  halwa9in1: [
    "dardgo-immunity-booster-9-in-1-halwa-ayurvedic-herbal-formula-for-wellness-vitality",
    "dardgo-immunity-booster-9-in-1-halwa",
  ],
  extraPowerHalwa: [
    "dardgo-ayurvedic-extra-power-halwa-natural-energy-vitality-booster",
    "dardgo-ayurvedic-extra-power-halwa",
  ],
  manjan: [
    "dardgo-ayurvedic-dant-manjan-powder-herbal-tooth-powder-for-healthy-gums-fresh-breath-natural-de",
    "dardgo-ayurvedic-dant-manjan-powder",
  ],
  shampoo: [
    "onion-hair-fall-control-shampoo-boosts-hair-thickness-reduces-breakage-prevents-hair-loss-adds-s",
    "onion-hair-fall-control-shampoo",
  ],
  itchFree: [
    "dardgo-anti-itch-free-cream-ayurvedic-relief-for-itching-skin-irritations-30gm",
    "dardgo-anti-itch-free-cream",
  ],
  extraPowerCapsule: [
    "dardgo-ayurvedic-extra-power-capsules-natural-energy-vitality-booster-herbal-supplement-for-stre",
  ],
  damaSwas: [
    "dardgo-ayurvedic-dama-swas-halwa-natural-respiratory-wellness-lung-support-herbal-breathing-aid",
  ],
} as const;

/** Homepage hero grid + first showcase block */
export const CUSTOMER_FAVOURITES: CatalogProduct[] = [
  { label: "Pain Relief Oil", handles: [...H.painOil] },
  { label: "Roll On", handles: [...H.rollOn] },
  { label: "Sciatica Tablet", handles: [...H.sciatica] },
  { label: "Skin Glow", handles: [...H.skinGlow] },
  { label: "Sugar Control Powder", handles: [...H.sugarPowder] },
  { label: "Golden Powder", handles: [...H.goldenPowder] },
  { label: "Piles Fighter Halwa", handles: [...H.pilesHalwa] },
  { label: "Hair Oil", handles: [...H.hairOil] },
];

export const CATALOG_SECTIONS: CatalogSection[] = [
  {
    id: "wellness-oil-balm",
    title: "Wellness Oil & Balm",
    tagline: "Massage oils and roll-ons for everyday comfort and relaxation.",
    emoji: "💧",
    desc: "Oils & roll-ons",
    collectionHandle: "wellness-oil-balm",
    accent: "primary",
    products: [
      { label: "Pain Relief Oil", handles: [...H.painOil] },
      { label: "Roll On", handles: [...H.rollOn] },
    ],
  },
  {
    id: "joint-mobility",
    title: "Joint & Mobility Care",
    tagline: "Tablet support for joint comfort and mobility routines.",
    emoji: "🦴",
    desc: "Joint & bone care",
    collectionHandle: "joint-mobility",
    accent: "yellow",
    products: [
      { label: "Sciatica Tablet", handles: [...H.sciatica] },
      { label: "Stone Free Tablet", handles: [...H.stoneFree] },
      { label: "Dissolve Ball Tablet", handles: [...H.dissolveBall] },
    ],
  },
  {
    id: "immunity-wellness",
    title: "Immunity & Wellness",
    tagline: "Traditional halwa formats for vitality and daily balance.",
    emoji: "🛡️",
    desc: "Immunity halwa",
    collectionHandle: "immunity-wellness",
    accent: "green",
    products: [
      { label: "9 in 1 Halwa", handles: [...H.halwa9in1] },
      { label: "Energy Halwa", handles: [...H.extraPowerHalwa] },
      { label: "Extra Power Halwa", handles: [...H.extraPowerHalwa] },
    ],
  },
  {
    id: "digestive-wellness",
    title: "Digestive Wellness",
    tagline: "Herbal powders for digestion and metabolic comfort.",
    emoji: "🌿",
    desc: "Digestive care",
    collectionHandle: "digestive-wellness",
    accent: "primary",
    products: [{ label: "Golden Powder", handles: [...H.goldenPowder] }],
  },
  {
    id: "beauty-personal-care",
    title: "Beauty & Personal Care",
    tagline: "Skin, hair, and daily personal care from botanical Ayurveda.",
    emoji: "✨",
    desc: "Beauty range",
    collectionHandle: "beauty-personal-care",
    accent: "orange",
    products: [
      { label: "Skin Glow", handles: [...H.skinGlow] },
      { label: "Hair Oil", handles: [...H.hairOil] },
      { label: "Manjan", handles: [...H.manjan] },
      { label: "Shampoo", handles: [...H.shampoo] },
      { label: "Itch Free", handles: [...H.itchFree] },
    ],
  },
  {
    id: "health-wellness-support",
    title: "Health & Wellness Support",
    tagline: "Targeted support for sugar balance, digestion, energy, and respiratory comfort.",
    emoji: "💚",
    desc: "Health support",
    collectionHandle: "health-wellness-support",
    accent: "orange",
    products: [
      { label: "Sugar Control Powder", handles: [...H.sugarPowder] },
      { label: "Piles Fighter Halwa", handles: [...H.pilesHalwa] },
      { label: "Extra Power Capsule", handles: [...H.extraPowerCapsule] },
      { label: "Dama Swas Halwa", handles: [...H.damaSwas] },
    ],
  },
];

const SECTION_BY_HANDLE = new Map(
  CATALOG_SECTIONS.map((s) => [s.collectionHandle, s] as const),
);

export function getCatalogSectionByHandle(handle: string): CatalogSection | undefined {
  return SECTION_BY_HANDLE.get(handle);
}

export function isCatalogCollectionHandle(handle: string): boolean {
  return SECTION_BY_HANDLE.has(handle);
}

export function sectionAllHandles(section: CatalogSection): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of section.products) {
    for (const h of p.handles) {
      if (!seen.has(h)) {
        seen.add(h);
        out.push(h);
      }
    }
  }
  return out;
}

export function favouritesAllHandles(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of CUSTOMER_FAVOURITES) {
    for (const h of p.handles) {
      if (!seen.has(h)) {
        seen.add(h);
        out.push(h);
      }
    }
  }
  return out;
}

export function handlesToStorefrontQuery(handles: string[]): string {
  return handles.map((h) => `handle:${h}`).join(" OR ");
}

/** Resolve one catalog row — tries each handle until a published product is found. */
async function fetchCatalogProductEntry(item: CatalogProduct): Promise<ShopifyProduct | null> {
  for (const handle of item.handles) {
    const product = await fetchShopifyProductByHandle(handle);
    if (product) return product;
  }
  return null;
}

/** Fetch products and preserve catalog order (one card per catalog product entry). */
export async function fetchCatalogProducts(
  catalogProducts: CatalogProduct[],
  maxTotal = 24,
): Promise<ShopifyProduct[]> {
  const slice = catalogProducts.slice(0, maxTotal);
  const results = await Promise.all(slice.map((item) => fetchCatalogProductEntry(item)));
  return results.filter((p): p is ShopifyProduct => p !== null);
}

/** Fetch many handles in order (for collection pages). */
export async function fetchProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  const unique = [...new Set(handles)];
  const pairs = await Promise.all(
    unique.map(async (h) => [h, await fetchShopifyProductByHandle(h)] as const),
  );
  const byHandle = new Map(pairs.filter(([, p]) => p).map(([h, p]) => [h, p!]));
  const result: ShopifyProduct[] = [];
  const usedIds = new Set<string>();
  for (const h of handles) {
    const product = byHandle.get(h);
    if (product && !usedIds.has(product.node.id)) {
      usedIds.add(product.node.id);
      result.push(product);
    }
  }
  return result;
}

export const COLLECTION_PAGE_TITLES: Record<string, string> = {
  "customer-favourites": "Customer Favourites",
  "wellness-oil-balm": "Wellness Oil & Balm",
  "joint-mobility": "Joint & Mobility Care",
  "immunity-wellness": "Immunity & Wellness",
  "digestive-wellness": "Digestive Wellness",
  "beauty-personal-care": "Beauty & Personal Care",
  "health-wellness-support": "Health & Wellness Support",
  "pain-relief-oils": "Wellness Oil & Balm",
  "ayurvedic-tablets": "Joint & Mobility Care",
  "ayurvedic-halwa": "Immunity & Wellness",
  "ayurvedic-powder": "Digestive & Health Powders",
  "ayurvedic-beauty": "Beauty & Personal Care",
  "ayurvedic-capsules": "Health & Wellness Support",
};

/**
 * PDP tab content from Shopify metafields.
 *
 * **Preferred (API-friendly namespace)** — `dardgo.*` (works with `npm run ensure:pdp-metafields`):
 *   - `dardgo.pdp_tabs` (JSON) — one object with keys: keyIngredients, howToUse, benefits, suitableFor, storageSafety, faqs
 *   - Or separate: `dardgo.key_ingredients`, `dardgo.how_to_use`, `dardgo.benefits`, `dardgo.suitable_for`, `dardgo.storage_safety`, `dardgo.faqs`
 *
 * **Legacy** — `custom.dardgo_*` keys still supported if you created those in Admin manually.
 *
 * **Admin “Product metafield definitions” (common setup)** — namespace `custom`, Storefront readable:
 *   - `key_ingredients` — single line text (comma / `;` / `|` separated names → ingredient cards)
 *   - `how_to_use` — rich text → “How to Use” steps (paragraphs + list items)
 *   - `direction` — rich text → merged into “How to Use” after `how_to_use` when present
 *   - `suitable_for` — rich text → “Suitable for” bullets
 *
 * If your definition keys differ, open each definition in Admin and align keys with the above,
 * or tell us the exact namespace.key to add.
 *
 * Enable **Storefront** access on each definition. Omitted keys in combined JSON → default for that section.
 */

export type PdpKeyIngredient = { name: string; emoji: string; desc: string };
export type PdpBenefit = { title: string; desc: string };
export type PdpStorageRow = { title: string; body: string };
export type PdpFaq = { q: string; a: string };

export type PdpTabsContent = {
  keyIngredients: PdpKeyIngredient[];
  howToUse: string[];
  benefits: PdpBenefit[];
  suitableFor: string[];
  storageSafety: PdpStorageRow[];
  faqs: PdpFaq[];
};

type Metafield = { namespace: string; key: string; value: string };

/** Metafield node as returned by Storefront `metafield { value }` (value may be null). */
type MfVal = { value?: string | null } | null | undefined;

export type ProductForPdpTabs = {
  metafields?: (Metafield | null)[] | null;
  /** Legacy combined JSON — `custom.dardgo_pdp_tabs` */
  dardgoPdpTabsMetafield?: MfVal;
  dardgoNsPdpTabsMf?: MfVal;
  dardgoKeyIngredientsMf?: MfVal;
  dardgoNsKeyIngredientsMf?: MfVal;
  dardgoHowToUseMf?: MfVal;
  dardgoNsHowToUseMf?: MfVal;
  dardgoBenefitsMf?: MfVal;
  dardgoNsBenefitsMf?: MfVal;
  dardgoSuitableForMf?: MfVal;
  dardgoNsSuitableForMf?: MfVal;
  dardgoStorageSafetyMf?: MfVal;
  dardgoNsStorageSafetyMf?: MfVal;
  dardgoFaqsMf?: MfVal;
  dardgoNsFaqsMf?: MfVal;
  /** Merchant definitions in Admin — `custom` (see file header). */
  merchantKeyIngredientsLineMf?: MfVal;
  merchantHowToUseRichMf?: MfVal;
  merchantDirectionRichMf?: MfVal;
  merchantSuitableForRichMf?: MfVal;
} | null;

export const DEFAULT_PDP_TABS: PdpTabsContent = {
  keyIngredients: [
    {
      name: "Ashwagandha",
      emoji: "🌿",
      desc: "Traditionally valued in Ayurveda for adaptogenic wellness support and general vitality when used as directed.",
    },
    {
      name: "Gandhak",
      emoji: "🔶",
      desc: "Mineral component used in classical formulations; intended for external or internal formats per label only.",
    },
    {
      name: "Shallaki",
      emoji: "🍃",
      desc: "Herb often chosen in mobility-focused traditional formulas to complement massage and movement routines.",
    },
    {
      name: "Triphala",
      emoji: "🫐",
      desc: "Blend of three fruits traditionally associated with gentle digestive balance in Ayurvedic lifestyle texts.",
    },
  ],
  howToUse: [
    "Read the entire product label before first use.",
    "Follow the directions for amount, frequency, and route (oral vs external) printed on the pack.",
    "If the product is a tablet or capsule, swallow with water unless the label states otherwise.",
    "For oils and roll-ons, apply only to intact skin; wash hands after use unless applying to hands.",
    "Discontinue use and consult a healthcare professional if irritation occurs or if you are pregnant, nursing, or on medication.",
  ],
  benefits: [
    {
      title: "Comfort-forward routine",
      desc: "Crafted to support everyday ease of movement and relaxation when paired with sensible activity and rest.",
    },
    {
      title: "Joint-friendly habits",
      desc: "Designed to align with stretching, hydration, and professional guidance — not as a substitute for care.",
    },
    {
      title: "Mindful formulation",
      desc: "Herb selection reflects traditional texts and modern quality checks; individual response may vary.",
    },
    {
      title: "Botanical-first formula",
      desc: "Prioritises herbal actives and avoids unnecessary synthetic fillers where the format allows.",
    },
    {
      title: "Holistic wellness lens",
      desc: "Encourages balanced nutrition, sleep, and stress care alongside any supplement or topical.",
    },
    {
      title: "Mobility support mindset",
      desc: "Supports active lifestyles with transparent expectations — results are personal and not guaranteed.",
    },
  ],
  suitableFor: [
    "Adults seeking traditional-format herbal wellness as part of a balanced lifestyle",
    "Shoppers who read labels carefully and follow directions",
    "Households combining movement, rest, and professional guidance for comfort",
    "Those looking for transparent Ayurvedic-inspired options without disease-cure messaging",
  ],
  storageSafety: [
    {
      title: "Storage",
      body: "Keep the container tightly closed in a cool, dry place away from direct sunlight and out of reach of children unless supervising an adult application.",
    },
    {
      title: "Safety",
      body: "For external products, avoid eyes, mucosa, and broken skin. For ingestible formats, do not exceed the stated dose. This product is not intended to diagnose, treat, cure, or prevent any disease.",
    },
    {
      title: "Allergies",
      body: "Review the full ingredient list for personal allergens. Discontinue if rash or swelling occurs and seek urgent care for breathing difficulty.",
    },
  ],
  faqs: [
    {
      q: "What are the key ingredients?",
      a: "Representative herbs may include Ashwagandha, Gandhak, Shallaki, and Triphala depending on the SKU. Always confirm the exact list on your product label.",
    },
    {
      q: "How should I use this product?",
      a: "Follow the printed label for dose, timing, and whether the product is for external or internal use. When in doubt, ask a qualified professional.",
    },
    {
      q: "Are side effects possible?",
      a: "Any wellness product can cause sensitivity in some individuals. Stop use if you notice irritation or discomfort and seek medical advice if symptoms persist.",
    },
    {
      q: "When might I notice a difference?",
      a: "Experiences vary widely. Consistency, sleep, nutrition, and activity all influence outcomes — we do not promise timelines.",
    },
    {
      q: "Can this replace my prescription?",
      a: "No. Our products are not substitutes for prescribed therapy. Never change medications without your prescriber’s guidance.",
    },
    {
      q: "Is long-term use appropriate?",
      a: "That depends on your health profile. Periodic review with a healthcare provider is the safest approach for any ongoing supplement or topical.",
    },
  ],
};

function cloneTabs(d: PdpTabsContent): PdpTabsContent {
  return {
    keyIngredients: d.keyIngredients.map((x) => ({ ...x })),
    howToUse: [...d.howToUse],
    benefits: d.benefits.map((x) => ({ ...x })),
    suitableFor: [...d.suitableFor],
    storageSafety: d.storageSafety.map((x) => ({ ...x })),
    faqs: d.faqs.map((x) => ({ ...x })),
  };
}

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function safeJsonParse(raw: string | null | undefined): unknown | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function mfString(m: MfVal): string | null {
  const v = m?.value;
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function normalizeIngredients(v: unknown): PdpKeyIngredient[] | null {
  if (!Array.isArray(v)) return null;
  const out: PdpKeyIngredient[] = [];
  for (const item of v) {
    const o = asRecord(item);
    if (!o) continue;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) continue;
    out.push({
      name,
      emoji: typeof o.emoji === "string" && o.emoji.trim() ? o.emoji.trim() : "🌿",
      desc: typeof o.desc === "string" ? o.desc.trim() : "",
    });
  }
  return out;
}

function normalizeStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out = v
    .filter((x): x is string => typeof x === "string" && Boolean(x.trim()))
    .map((x) => x.trim());
  return out;
}

function normalizeBenefits(v: unknown): PdpBenefit[] | null {
  if (!Array.isArray(v)) return null;
  const out: PdpBenefit[] = [];
  for (const item of v) {
    const o = asRecord(item);
    if (!o) continue;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    if (!title) continue;
    out.push({
      title,
      desc: typeof o.desc === "string" ? o.desc.trim() : "",
    });
  }
  return out;
}

function normalizeStorage(v: unknown): PdpStorageRow[] | null {
  if (!Array.isArray(v)) return null;
  const out: PdpStorageRow[] = [];
  for (const item of v) {
    const o = asRecord(item);
    if (!o) continue;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const body = typeof o.body === "string" ? o.body.trim() : "";
    if (!title || !body) continue;
    out.push({ title, body });
  }
  return out;
}

function normalizeFaqs(v: unknown): PdpFaq[] | null {
  if (!Array.isArray(v)) return null;
  const out: PdpFaq[] = [];
  for (const item of v) {
    const o = asRecord(item);
    if (!o) continue;
    const q = typeof o.q === "string" ? o.q.trim() : "";
    const a = typeof o.a === "string" ? o.a.trim() : "";
    if (!q || !a) continue;
    out.push({ q, a });
  }
  return out;
}

function pickSection<T>(
  raw: Record<string, unknown>,
  key: string,
  normalize: (v: unknown) => T[] | null,
  fallback: T[],
): T[] {
  if (!Object.prototype.hasOwnProperty.call(raw, key)) return fallback;
  const n = normalize(raw[key]);
  if (n === null) return fallback;
  return n;
}

function tabsFromParsedRecord(o: Record<string, unknown>, d: PdpTabsContent): PdpTabsContent {
  return {
    keyIngredients: pickSection(o, "keyIngredients", normalizeIngredients, d.keyIngredients),
    howToUse: pickSection(o, "howToUse", normalizeStringArray, d.howToUse),
    benefits: pickSection(o, "benefits", normalizeBenefits, d.benefits),
    suitableFor: pickSection(o, "suitableFor", normalizeStringArray, d.suitableFor),
    storageSafety: pickSection(o, "storageSafety", normalizeStorage, d.storageSafety),
    faqs: pickSection(o, "faqs", normalizeFaqs, d.faqs),
  };
}

function getCombinedJsonRaw(product: ProductForPdpTabs): string | null {
  const fromDardgoNs = mfString(product?.dardgoNsPdpTabsMf);
  if (fromDardgoNs) return fromDardgoNs;

  const fromLegacySingular = mfString(product?.dardgoPdpTabsMetafield);
  if (fromLegacySingular) return fromLegacySingular;

  const fromList = product?.metafields?.find(
    (m) =>
      m != null &&
      ((m.namespace === "dardgo" && m.key === "pdp_tabs") ||
        (m.namespace === "custom" && m.key === "dardgo_pdp_tabs")),
  )?.value;
  if (typeof fromList === "string" && fromList.trim()) return fromList.trim();

  return null;
}

function linesFromText(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Shopify rich_text_field JSON (root → paragraph / heading / list → list-item → text). */
type RichTextNode = {
  type?: string;
  value?: string;
  children?: RichTextNode[];
};

function collectRichTextLeaf(node: RichTextNode | null | undefined): string {
  if (!node || typeof node !== "object") return "";
  const t = node.type;
  if (t === "text" && typeof node.value === "string") return node.value;
  if (t === "line-break" || t === "soft-break") return "\n";
  if (!Array.isArray(node.children)) return "";
  return node.children.map((c) => collectRichTextLeaf(c)).join("");
}

/** One string per paragraph, heading, or list item (for PDP steps / bullets). */
function richTextToSegments(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  const trimmed = raw.trim();
  const parsed = safeJsonParse(trimmed);
  const root = asRecord(parsed);
  if (!root || root.type !== "root") {
    if (trimmed.startsWith("{")) return [];
    return linesFromText(trimmed);
  }
  const children = root.children;
  if (!Array.isArray(children)) return [];

  const segments: string[] = [];
  for (const child of children as RichTextNode[]) {
    const typ = child?.type;
    if (typ === "paragraph" || typ === "heading") {
      const s = collectRichTextLeaf(child).replace(/\s+\n/g, "\n").trim();
      if (s) segments.push(s);
    } else if (typ === "list" && Array.isArray(child.children)) {
      for (const item of child.children) {
        if (item?.type === "list-item") {
          const s = collectRichTextLeaf(item).trim();
          if (s) segments.push(s);
        }
      }
    }
  }
  return segments;
}

function dedupeConsecutiveStrings(xs: string[]): string[] {
  const out: string[] = [];
  let prev = "";
  for (const x of xs) {
    const t = x.trim();
    if (!t) continue;
    if (t.toLowerCase() === prev.toLowerCase()) continue;
    out.push(t);
    prev = t.toLowerCase();
  }
  return out;
}

function singleLineKeyIngredients(raw: string): PdpKeyIngredient[] | null {
  const t = raw.trim();
  if (!t) return null;
  const parts = t
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!parts.length) return null;
  return parts.map((name) => ({
    name,
    emoji: "🌿",
    desc: "",
  }));
}

/** Overrides from merchant-created definitions in Admin (`custom` namespace — see file header). */
function overlayMerchantAdminMetafields(product: ProductForPdpTabs): Partial<PdpTabsContent> {
  const out: Partial<PdpTabsContent> = {};

  const kiLine = mfString(product?.merchantKeyIngredientsLineMf);
  if (kiLine) {
    const n = singleLineKeyIngredients(kiLine);
    if (n?.length) out.keyIngredients = n;
  }

  const howRaw = mfString(product?.merchantHowToUseRichMf);
  const dirRaw = mfString(product?.merchantDirectionRichMf);
  const howSegs = howRaw ? richTextToSegments(howRaw) : [];
  const dirSegs = dirRaw ? richTextToSegments(dirRaw) : [];
  const mergedHt = dedupeConsecutiveStrings([...howSegs, ...dirSegs]);
  if (mergedHt.length) out.howToUse = mergedHt;

  const sfRaw = mfString(product?.merchantSuitableForRichMf);
  if (sfRaw) {
    const segs = richTextToSegments(sfRaw);
    if (segs.length) out.suitableFor = segs;
  }

  return out;
}

/** Per-tab metafields override sections when they contain valid data. */
function overlayFromSeparateMetafields(product: ProductForPdpTabs): Partial<PdpTabsContent> {
  const out: Partial<PdpTabsContent> = {};

  const kiRaw = mfString(product?.dardgoNsKeyIngredientsMf) || mfString(product?.dardgoKeyIngredientsMf);
  if (kiRaw) {
    const parsed = safeJsonParse(kiRaw);
    const n = normalizeIngredients(parsed ?? null);
    if (n && n.length) out.keyIngredients = n;
  }

  const htRaw = mfString(product?.dardgoNsHowToUseMf) || mfString(product?.dardgoHowToUseMf);
  if (htRaw) {
    const parsed = safeJsonParse(htRaw);
    let steps = normalizeStringArray(parsed);
    if (!steps?.length) steps = linesFromText(htRaw);
    if (steps.length) out.howToUse = steps;
  }

  const benRaw = mfString(product?.dardgoNsBenefitsMf) || mfString(product?.dardgoBenefitsMf);
  if (benRaw) {
    const n = normalizeBenefits(safeJsonParse(benRaw));
    if (n && n.length) out.benefits = n;
  }

  const sfRaw = mfString(product?.dardgoNsSuitableForMf) || mfString(product?.dardgoSuitableForMf);
  if (sfRaw) {
    const parsed = safeJsonParse(sfRaw);
    let lines = normalizeStringArray(parsed);
    if (!lines?.length) lines = linesFromText(sfRaw);
    if (lines.length) out.suitableFor = lines;
  }

  const stRaw = mfString(product?.dardgoNsStorageSafetyMf) || mfString(product?.dardgoStorageSafetyMf);
  if (stRaw) {
    const n = normalizeStorage(safeJsonParse(stRaw));
    if (n && n.length) out.storageSafety = n;
  }

  const fqRaw = mfString(product?.dardgoNsFaqsMf) || mfString(product?.dardgoFaqsMf);
  if (fqRaw) {
    const n = normalizeFaqs(safeJsonParse(fqRaw));
    if (n && n.length) out.faqs = n;
  }

  return out;
}

export function resolvePdpTabsFromProduct(product: ProductForPdpTabs | null): PdpTabsContent {
  const d = DEFAULT_PDP_TABS;
  if (!product) return cloneTabs(d);

  const base = cloneTabs(d);

  const combinedRaw = getCombinedJsonRaw(product);
  if (combinedRaw) {
    const parsed = safeJsonParse(combinedRaw);
    const o = asRecord(parsed);
    if (o) {
      const merged = tabsFromParsedRecord(o, d);
      base.keyIngredients = merged.keyIngredients;
      base.howToUse = merged.howToUse;
      base.benefits = merged.benefits;
      base.suitableFor = merged.suitableFor;
      base.storageSafety = merged.storageSafety;
      base.faqs = merged.faqs;
    }
  }

  const overlay = overlayFromSeparateMetafields(product);
  if (overlay.keyIngredients?.length) base.keyIngredients = overlay.keyIngredients;
  if (overlay.howToUse?.length) base.howToUse = overlay.howToUse;
  if (overlay.benefits?.length) base.benefits = overlay.benefits;
  if (overlay.suitableFor?.length) base.suitableFor = overlay.suitableFor;
  if (overlay.storageSafety?.length) base.storageSafety = overlay.storageSafety;
  if (overlay.faqs?.length) base.faqs = overlay.faqs;

  const merchant = overlayMerchantAdminMetafields(product);
  if (merchant.keyIngredients?.length) base.keyIngredients = merchant.keyIngredients;
  if (merchant.howToUse?.length) base.howToUse = merchant.howToUse;
  if (merchant.suitableFor?.length) base.suitableFor = merchant.suitableFor;

  return base;
}

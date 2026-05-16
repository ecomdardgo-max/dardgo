/** DARDGO WhatsApp business line (E.164 without +). */
export const DARDGO_WHATSAPP_PHONE = "919329912659";

export const DARDGO_WHATSAPP_DISPLAY = "+91 93299 12659";

/** Bulk-order enquiries only — other pages keep DARDGO_WHATSAPP_PHONE. */
export const DARDGO_BULK_ORDER_WHATSAPP_PHONE = "918517960888";

export const DARDGO_BULK_ORDER_WHATSAPP_DISPLAY = "+91 8517960888";

export function buildWhatsAppUrl(message: string, phone = DARDGO_WHATSAPP_PHONE): string {
  const text = message.trim();
  const base = `https://wa.me/${phone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type BulkOrderFormData = {
  name: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  products: string;
  quantity: string;
  notes: string;
};

export function buildBulkOrderWhatsAppMessage(data: BulkOrderFormData): string {
  const lines = [
    "Hello DARDGO, I would like to place a *bulk order*.",
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
  ];
  if (data.email.trim()) lines.push(`*Email:* ${data.email.trim()}`);
  if (data.company.trim()) lines.push(`*Company / Store:* ${data.company.trim()}`);
  if (data.city.trim()) lines.push(`*City:* ${data.city.trim()}`);
  lines.push(`*Products:* ${data.products}`);
  lines.push(`*Approx. quantity:* ${data.quantity}`);
  if (data.notes.trim()) lines.push(`*Notes:* ${data.notes.trim()}`);
  lines.push("", "Sent from dardgo.in bulk order form");
  return lines.join("\n");
}

export function openBulkOrderWhatsApp(data: BulkOrderFormData): void {
  const url = buildWhatsAppUrl(
    buildBulkOrderWhatsAppMessage(data),
    DARDGO_BULK_ORDER_WHATSAPP_PHONE,
  );
  window.open(url, "_blank", "noopener,noreferrer");
}

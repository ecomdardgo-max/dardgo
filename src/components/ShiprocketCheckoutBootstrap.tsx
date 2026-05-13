import { useEffect } from "react";
import {
  getShiprocketSellerDomain,
  injectShiprocketCheckoutAssets,
  isShiprocketCheckoutConfigured,
} from "@/lib/shiprocket-checkout";

/**
 * Injects Fastrr CSS/JS and the hidden `sellerDomain` input Shiprocket expects on checkout flows.
 */
export function ShiprocketCheckoutBootstrap() {
  const domain = getShiprocketSellerDomain();

  useEffect(() => {
    if (!isShiprocketCheckoutConfigured()) return;
    injectShiprocketCheckoutAssets();
  }, []);

  if (!isShiprocketCheckoutConfigured()) return null;

  return <input type="hidden" id="sellerDomain" value={domain} readOnly aria-hidden />;
}

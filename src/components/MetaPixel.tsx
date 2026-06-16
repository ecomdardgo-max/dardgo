import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { initMetaPixel, isMetaPixelEnabled, trackMetaPageView } from "@/lib/meta-pixel";

/** Meta Pixel base code + PageView on every client-side route change. */
export function MetaPixel() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isMetaPixelEnabled()) return;
    initMetaPixel();
  }, []);

  useEffect(() => {
    if (!isMetaPixelEnabled()) return;
    trackMetaPageView();
  }, [pathname]);

  return null;
}

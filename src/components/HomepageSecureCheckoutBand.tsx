import { Lock } from "lucide-react";
import { PAYMENT_BRAND_ICONS } from "@/components/PaymentIcons";

type HomepageSecureCheckoutBandProps = {
  /** `split`: cell inside a parent grid (desktop 2-column with newsletter). */
  layout?: "full" | "split";
};

export function HomepageSecureCheckoutBand({ layout = "full" }: HomepageSecureCheckoutBandProps) {
  const isSplit = layout === "split";

  const iconRow = (
    <div
      className={
        isSplit
          ? "flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 border-t border-border/30 mt-auto"
          : "flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-2.5"
      }
    >
      {PAYMENT_BRAND_ICONS.map(({ key, Component, label }) => (
        <Component key={key} title={label} className="h-7 w-11 sm:h-8 sm:w-12" />
      ))}
    </div>
  );

  const copyBlock = (
    <div className="flex items-start gap-3 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Lock className="w-5 h-5 text-primary" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">Secure checkout</p>
        <p
          className={`text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed ${isSplit ? "lg:max-w-none" : "max-w-md"}`}
        >
          Encrypted payment flow with trusted Indian methods. Your card details are handled by the
          payment provider — we don&apos;t store them on our servers.
        </p>
      </div>
    </div>
  );

  if (isSplit) {
    return (
      <div className="flex h-full min-h-[min(22rem,100%)] flex-col rounded-2xl border border-border/50 bg-card/90 p-6 sm:p-7 shadow-card">
        <div className="flex flex-1 flex-col gap-5">
          {copyBlock}
          {iconRow}
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-10 bg-muted/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {copyBlock}
        {iconRow}
      </div>
    </section>
  );
}

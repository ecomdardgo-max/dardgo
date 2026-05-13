import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BuyNowShiprocketBarProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "compact" | "dock";
};

export function BuyNowShiprocketBar({
  onClick,
  disabled,
  className,
  variant = "default",
}: BuyNowShiprocketBarProps) {
  const isCompact = variant === "compact";
  const isDock = variant === "dock";

  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.98 }}
      whileHover={disabled ? undefined : { y: -1 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl text-center font-bold tracking-wide text-white shadow-lg transition-shadow duration-300",
        "bg-gradient-to-br from-[#3fa147] via-[#2E7D32] to-[#1b5e20]",
        "ring-1 ring-white/25 ring-inset",
        "hover:shadow-xl hover:shadow-green-900/30 hover:brightness-[1.03]",
        "disabled:pointer-events-none disabled:opacity-50 disabled:hover:shadow-lg",
        isDock && "max-w-[min(100%,280px)] shrink-0 rounded-xl",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-80"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        aria-hidden
      />
      <span
        className={cn(
          "relative flex items-center justify-center gap-2",
          isCompact ? "px-3 py-2.5" : isDock ? "px-3 py-2.5" : "px-4 py-3.5 sm:py-4",
        )}
      >
        <span
          className={cn(
            "uppercase tracking-[0.2em] drop-shadow-sm",
            isCompact ? "text-xs" : isDock ? "text-[11px]" : "text-sm sm:text-base",
          )}
        >
          Buy now
        </span>
        <ArrowRight
          className={cn(
            "shrink-0 transition-transform duration-300 group-hover:translate-x-0.5",
            isCompact || isDock ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-5 sm:w-5",
          )}
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
    </motion.button>
  );
}

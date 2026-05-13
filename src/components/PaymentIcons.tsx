/**
 * PaymentIcons — small inline-SVG brand chips for the checkout-trust row.
 * Each icon is a self-contained, lightweight SVG built to evoke the real
 * brand mark without bundling third-party logo images. Sized via the parent
 * (uses currentColor + a fixed aspect ratio so it scales cleanly).
 */
type IconProps = {
  className?: string;
  title: string;
};

const Wrap = ({
  className = "h-6 w-10 sm:h-7 sm:w-12",
  bg,
  children,
  title,
}: {
  className?: string;
  bg: string;
  children: React.ReactNode;
  title: string;
}) => (
  <span
    role="img"
    aria-label={title}
    title={title}
    className={`inline-flex items-center justify-center rounded-md border border-border/40 shadow-sm ${bg} ${className}`}
  >
    {children}
  </span>
);

export const UpiIcon = ({ className, title = "UPI" }: IconProps) => (
  <Wrap title={title} className={className} bg="bg-white">
    <svg viewBox="0 0 48 28" className="h-3.5 sm:h-4 w-auto" aria-hidden>
      {/* Stylised UPI triangle marker (orange + green arrow) */}
      <polygon points="6,4 18,4 12,18" fill="#5F259F" />
      <polygon points="14,10 26,10 20,24" fill="#FF7900" />
      <text
        x="28"
        y="20"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="#0F172A"
      >
        UPI
      </text>
    </svg>
  </Wrap>
);

export const PhonePeIcon = ({ className, title = "PhonePe" }: IconProps) => (
  <Wrap title={title} className={className} bg="bg-[#5F259F]">
    <svg viewBox="0 0 48 28" className="h-3.5 sm:h-4 w-auto" aria-hidden>
      <text
        x="6"
        y="20"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="13"
        fontWeight="800"
        fill="#ffffff"
        letterSpacing="-0.5"
      >
        Phone
      </text>
      <text
        x="34"
        y="20"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="13"
        fontWeight="800"
        fill="#FFD23F"
        letterSpacing="-0.5"
      >
        Pe
      </text>
    </svg>
  </Wrap>
);

export const VisaIcon = ({ className, title = "Visa" }: IconProps) => (
  <Wrap title={title} className={className} bg="bg-white">
    <svg viewBox="0 0 48 28" className="h-3.5 sm:h-4 w-auto" aria-hidden>
      <text
        x="4"
        y="21"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="14"
        fontStyle="italic"
        fontWeight="900"
        fill="#1A1F71"
        letterSpacing="-0.5"
      >
        VISA
      </text>
      <rect x="4" y="22.5" width="36" height="2" fill="#F7B600" />
    </svg>
  </Wrap>
);

export const MastercardIcon = ({ className, title = "Mastercard" }: IconProps) => (
  <Wrap title={title} className={className} bg="bg-white">
    <svg viewBox="0 0 48 28" className="h-4 sm:h-5 w-auto" aria-hidden>
      {/* Two overlapping discs — red + yellow with orange overlap */}
      <circle cx="20" cy="14" r="9" fill="#EB001B" />
      <circle cx="30" cy="14" r="9" fill="#F79E1B" />
      <path d="M25 7.2a9 9 0 0 1 0 13.6A9 9 0 0 1 25 7.2Z" fill="#FF5F00" />
    </svg>
  </Wrap>
);

export const RupayIcon = ({ className, title = "RuPay" }: IconProps) => (
  <Wrap title={title} className={className} bg="bg-white">
    <svg viewBox="0 0 48 28" className="h-3.5 sm:h-4 w-auto" aria-hidden>
      <text
        x="3"
        y="20"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="12"
        fontWeight="900"
        fill="#097B3D"
        letterSpacing="-0.5"
      >
        Ru
      </text>
      <text
        x="22"
        y="20"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="12"
        fontWeight="900"
        fill="#F47216"
        letterSpacing="-0.5"
      >
        Pay»
      </text>
    </svg>
  </Wrap>
);

export const CodIcon = ({ className, title = "Cash on Delivery" }: IconProps) => (
  <Wrap title={title} className={className} bg="bg-amber-50">
    <svg viewBox="0 0 24 24" className="h-3.5 sm:h-4 w-auto" aria-hidden fill="none">
      {/* Banknote rectangle with rupee mark */}
      <rect
        x="2.5"
        y="6"
        width="19"
        height="12"
        rx="2"
        fill="#FBBF24"
        stroke="#92400E"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="#92400E" strokeWidth="1.4" />
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="5"
        fontWeight="900"
        fill="#92400E"
      >
        ₹
      </text>
    </svg>
  </Wrap>
);

/** All payment icons rendered in order — drop-in for the trust row. */
export const PAYMENT_BRAND_ICONS = [
  { key: "upi", Component: UpiIcon, label: "UPI" },
  { key: "phonepe", Component: PhonePeIcon, label: "PhonePe" },
  { key: "visa", Component: VisaIcon, label: "Visa" },
  { key: "mastercard", Component: MastercardIcon, label: "Mastercard" },
  { key: "rupay", Component: RupayIcon, label: "RuPay" },
  { key: "cod", Component: CodIcon, label: "Cash on Delivery" },
] as const;

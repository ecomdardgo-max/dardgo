import { Link } from "@tanstack/react-router";
import { FDA_STRUCTURED_CLAIM_DISCLAIMER, WELLNESS_INFORMATION_DISCLAIMER } from "@/lib/compliance";

export function ComplianceFooterBlock() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/6 backdrop-blur-sm p-4 sm:p-5 mb-8 text-center sm:text-left">
      <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed mb-3">
        <span className="font-semibold text-brand-yellow/95">FDA / DSHEA: </span>
        {FDA_STRUCTURED_CLAIM_DISCLAIMER}{" "}
        <Link
          to="/medical-disclaimer"
          className="text-brand-yellow hover:text-brand-yellow-light underline underline-offset-2 font-medium"
        >
          Read full medical disclaimer
        </Link>
        .
      </p>
      <p className="text-[11px] sm:text-xs text-white/75 leading-relaxed">
        <span className="font-semibold text-white/90">Wellness information: </span>
        {WELLNESS_INFORMATION_DISCLAIMER}
      </p>
    </div>
  );
}

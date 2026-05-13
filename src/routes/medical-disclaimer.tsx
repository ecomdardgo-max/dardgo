import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShieldCheck } from "lucide-react";
import medicalDisclaimerMd from "@/content/medical-disclaimer.md?raw";
import { normalizePolicyMarkdown, policyMarkdownComponents } from "@/lib/policyMarkdownComponents";

const body = normalizePolicyMarkdown(medicalDisclaimerMd);

export const Route = createFileRoute("/medical-disclaimer")({
  component: MedicalDisclaimerPage,
  head: () => ({
    meta: [
      { title: "Medical & Product Disclaimer | DARDGO" },
      {
        name: "description",
        content:
          "DSHEA-style disclaimer and wellness information policy for DARDGO herbal products — not intended to diagnose, treat, cure, or prevent disease.",
      },
    ],
  }),
});

function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Legal
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 break-words">
                Medical &amp; product <span className="text-gradient-green">disclaimer</span>
              </h1>
            </div>
          </ScrollReveal>

          <article className="max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={policyMarkdownComponents}>
              {body}
            </ReactMarkdown>
          </article>

          <ScrollReveal>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              <Link to="/disclaimer" className="font-semibold text-primary hover:underline">
                Website disclaimer
              </Link>
              {" · "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                Contact
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShieldCheck } from "lucide-react";
import disclaimerMd from "@/content/disclaimer.md?raw";
import { normalizePolicyMarkdown, policyMarkdownComponents } from "@/lib/policyMarkdownComponents";

const body = normalizePolicyMarkdown(disclaimerMd);

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({
    meta: [
      { title: "Website Disclaimer | DARDGO" },
      {
        name: "description",
        content:
          "General website disclaimer for dardgo.in — not medical advice, product use, and limitations.",
      },
    ],
  }),
});

function DisclaimerPage() {
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
                Website <span className="text-gradient-green">Disclaimer</span>
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
              Product claims:{" "}
              <Link to="/medical-disclaimer" className="font-semibold text-primary hover:underline">
                Medical disclaimer
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

import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HelpCircle } from "lucide-react";
import faqsMd from "@/content/faqs.md?raw";

const faqsBody = faqsMd
  .replace(/^\uFEFF/, "")
  .replace(/\r\n/g, "\n")
  .replace(/^<!--[\s\S]*?-->\s*\n?/, "");

const markdownComponents: Components = {
  h2: ({ node: _n, children, ...props }) => (
    <h2
      className="text-xl sm:text-2xl font-bold text-foreground mt-10 mb-6 first:mt-0 scroll-mt-24 text-center sm:text-left"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node: _n, children, ...props }) => (
    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3" {...props}>
      {children}
    </h3>
  ),
  p: ({ node: _n, children, ...props }) => (
    <p className="leading-relaxed text-muted-foreground mb-4 last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ node: _n, children, ...props }) => (
    <ul className="list-disc pl-5 space-y-2 mb-4 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ node: _n, children, ...props }) => (
    <ol className="list-decimal pl-5 space-y-2 mb-4 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ node: _n, children, ...props }) => (
    <li className="leading-relaxed marker:text-primary" {...props}>
      {children}
    </li>
  ),
  a: ({ node: _n, href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/90 break-words"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ node: _n, children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ node: _n, children, ...props }) => (
    <em className="italic text-foreground/90" {...props}>
      {children}
    </em>
  ),
  table: ({ node: _n, children, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border/60 bg-card/40">
      <table className="w-full min-w-[520px] text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ node: _n, children, ...props }) => (
    <thead className="bg-muted/50 text-left" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ node: _n, children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ node: _n, children, ...props }) => (
    <tr className="border-b border-border/50 last:border-0" {...props}>
      {children}
    </tr>
  ),
  th: ({ node: _n, children, ...props }) => (
    <th className="px-3 py-2.5 font-semibold text-foreground align-top w-[45%]" {...props}>
      {children}
    </th>
  ),
  td: ({ node: _n, children, ...props }) => (
    <td className="px-3 py-2.5 text-muted-foreground align-top" {...props}>
      {children}
    </td>
  ),
};

export const Route = createFileRoute("/faqs")({
  component: FaqsPage,
  head: () => ({
    meta: [
      { title: "FAQs | DARDGO" },
      {
        name: "description",
        content:
          "Frequently asked questions about DARD GO — Ayurvedic products, orders, delivery, COD, support, and returns.",
      },
    ],
  }),
});

function FaqsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                Help center
              </span>
            </div>
          </ScrollReveal>

          <article className="max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {faqsBody}
            </ReactMarkdown>
          </article>

          <ScrollReveal>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Still need help?{" "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                Contact us
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

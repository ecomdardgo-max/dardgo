import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/compliance";

const faqs = [
  {
    q: "Are DARDGO products Ayurvedic?",
    a: "Our range is inspired by traditional Ayurvedic practice and manufactured under quality-focused processes. Individual products list their format (oil, roll-on, tablet, etc.) and directions on the label.",
  },
  {
    q: "Will a product treat my medical condition?",
    a: "Our products are sold as herbal wellness items, not medicines. They are not intended to diagnose, treat, cure, or prevent any disease. For health concerns, speak with a qualified professional.",
  },
  {
    q: "How do I choose what’s right for me?",
    a: "Read the product page and label, consider your routine and preferences, and ask your healthcare provider if you take medications or have a medical condition.",
  },
  {
    q: "How does shipping work?",
    a: "We ship across India. Free shipping typically applies to prepaid orders above ₹249; COD may include a small fee. See our Shipping & Delivery page for timelines and policies.",
  },
  {
    q: "What if I need to return an item?",
    a: "We publish clear return windows and conditions on our Returns & Refund page. Contact care@dardgo.in with your order ID for help.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export function HomepageFaqSection() {
  return (
    <section className="py-14 sm:py-20 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...faqJsonLd, url: `${SITE_URL}/` }) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="text-eyebrow text-primary mb-3 block">— Questions</span>
            <h2 className="text-display-2 text-foreground mb-3">
              Helpful <span className="text-gradient-green">FAQs</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Straight answers about shopping, wellness positioning, and policies.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <div className="rounded-3xl border border-border/50 bg-card/90 shadow-card px-4 sm:px-6 py-2">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-[15px]">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
        <p className="text-center text-xs text-muted-foreground mt-6">
          More topics in our{" "}
          <Link to="/faqs" className="font-semibold text-primary hover:underline">
            FAQ hub
          </Link>{" "}
          and{" "}
          <Link to="/medical-disclaimer" className="font-semibold text-primary hover:underline">
            medical disclaimer
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

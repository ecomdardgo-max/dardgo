import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChevronLeft, Share2, Clock, Calendar } from "lucide-react";

const blogData: Record<string, { title: string; category: string; date: string; readTime: string; content: string[] }> = {
  "benefits-of-ayurvedic-pain-relief": {
    title: "5 Benefits of Ayurvedic Pain Relief Over Chemical Painkillers",
    category: "Wellness",
    date: "May 2, 2026",
    readTime: "5 min read",
    content: [
      "In today's fast-paced world, pain has become an unwanted companion for millions. While chemical painkillers offer quick relief, they come with a host of side effects. Ayurvedic pain relief offers a natural, holistic alternative that addresses the root cause of pain.",
      "1. No Side Effects: Unlike NSAIDs and other chemical painkillers that can cause liver damage, kidney problems, and gastric issues, Ayurvedic remedies use natural herbs that are gentle on your body.",
      "2. Long-lasting Relief: Ayurvedic treatments work at the root cause of pain, providing sustained relief rather than just masking symptoms temporarily.",
      "3. Holistic Healing: Ayurveda doesn't just treat pain — it improves overall wellness, strengthening joints, muscles, and the immune system simultaneously.",
      "4. Safe for All Ages: From children to elderly, Ayurvedic pain relief products are safe for the entire family, making them a versatile healthcare solution.",
      "5. Cost-Effective: With no recurring prescription costs and no expensive specialist visits, Ayurvedic pain relief is accessible and affordable for every Indian household.",
    ],
  },
  "joint-pain-home-remedies": {
    title: "10 Ayurvedic Home Remedies for Joint Pain That Actually Work",
    category: "Joint Care",
    date: "Apr 28, 2026",
    readTime: "7 min read",
    content: [
      "Joint pain affects millions of Indians, especially as we age. While modern medicine offers temporary solutions, Ayurveda provides time-tested remedies that have been used for centuries.",
      "Turmeric (Haldi) is one of the most powerful anti-inflammatory herbs in Ayurveda. Mix a teaspoon of turmeric with warm milk and drink daily.",
      "Ashwagandha strengthens joints and reduces inflammation. It's available in powder and capsule form for easy consumption.",
      "Regular oil massage with Ayurvedic pain relief oils improves blood circulation and reduces stiffness in joints.",
    ],
  },
};

const defaultContent = {
  title: "Ayurvedic Health Article",
  category: "Wellness",
  date: "2026",
  readTime: "5 min read",
  content: [
    "This article is coming soon. Stay tuned for expert Ayurvedic health insights from DARDGO.",
    "In the meantime, explore our range of premium Ayurvedic products that are 100% natural and backed by centuries of healing wisdom.",
  ],
};

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
  head: ({ params }) => ({
    meta: [
      { title: `${blogData[params.slug]?.title || "Blog"} — DARDGO` },
      { name: "description", content: blogData[params.slug]?.content[0] || "Ayurvedic health insights from DARDGO." },
    ],
  }),
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const post = blogData[slug] || defaultContent;

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </ScrollReveal>

          {/* Hero */}
          <ScrollReveal>
            <div className="aspect-[2/1] bg-gradient-hero rounded-3xl flex items-center justify-center mb-8">
              <span className="text-6xl">🌿</span>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{post.readTime}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{post.date}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-8 leading-tight">{post.title}</h1>
          </ScrollReveal>

          {/* Content */}
          <div className="space-y-5">
            {post.content.map((para, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">{para}</p>
              </ScrollReveal>
            ))}
          </div>

          {/* Share */}
          <ScrollReveal>
            <div className="mt-10 pt-8 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Share this article</p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-primary/10 text-sm font-medium transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </ScrollReveal>
        </div>
      </article>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

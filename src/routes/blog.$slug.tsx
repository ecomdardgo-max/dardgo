import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChevronLeft, Share2, Clock, Calendar } from "lucide-react";
import { getDardgoBlogPost } from "@/content/dardgoBlogPosts";

const defaultContent = {
  title: "Ayurvedic Health Article",
  category: "Wellness",
  date: "—",
  readTime: "5 min read",
  content: [
    "This article is not available. Browse our Know Ayurvedic Products articles from the blog listing.",
    "Explore DARDGO’s premium Ayurvedic products — 100% natural and rooted in traditional wisdom.",
  ],
};

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
  head: ({ params }) => ({
    meta: [
      {
        title: `${getDardgoBlogPost(params.slug)?.title || "Blog"} — DARDGO`,
      },
      {
        name: "description",
        content:
          getDardgoBlogPost(params.slug)?.excerpt ||
          "Ayurvedic health insights from DARDGO — Know Ayurvedic Products.",
      },
    ],
  }),
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const full = getDardgoBlogPost(slug);
  const post = full
    ? {
        title: full.title,
        category: full.category,
        date: full.date,
        readTime: `${full.readTime} read`,
        content: full.content,
      }
    : defaultContent;

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
            <div className="aspect-[2/1] bg-gradient-hero rounded-3xl flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-5xl sm:text-6xl">🌿</span>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
              <span className="text-xs font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{post.readTime}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{post.date}</span>
            </div>
            <h1 className="text-xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8 leading-tight break-words">{post.title}</h1>
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

import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "@tanstack/react-router";

const blogPosts = [
  {
    slug: "benefits-of-ayurvedic-pain-relief",
    title: "5 Benefits of Ayurvedic Pain Relief Over Chemical Painkillers",
    excerpt: "Discover why millions of Indians are switching to natural Ayurvedic remedies for long-lasting pain relief without side effects.",
    category: "Wellness",
    date: "May 2, 2026",
    readTime: "5 min read",
  },
  {
    slug: "joint-pain-home-remedies",
    title: "10 Ayurvedic Home Remedies for Joint Pain That Actually Work",
    excerpt: "From turmeric to ashwagandha — learn how these powerful herbs can transform your joint health naturally.",
    category: "Joint Care",
    date: "Apr 28, 2026",
    readTime: "7 min read",
  },
  {
    slug: "daily-ayurvedic-routine",
    title: "The Complete Ayurvedic Daily Routine for Better Health",
    excerpt: "Follow this time-tested Dinacharya routine to boost immunity, reduce pain, and improve overall wellness.",
    category: "Lifestyle",
    date: "Apr 22, 2026",
    readTime: "6 min read",
  },
];

export function BlogPreview() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                📖 Health Blog
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
                Ayurvedic <span className="text-gradient-green">Insights</span>
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
            >
              View All →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 block h-full"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 to-brand-cream flex items-center justify-center">
                  <span className="text-4xl">🌿</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">{post.category}</span>
                    <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}

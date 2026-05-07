import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";

const blogPosts = [
  {
    slug: "benefits-of-ayurvedic-pain-relief",
    title: "5 Benefits of Ayurvedic Pain Relief Over Chemical Painkillers",
    excerpt: "Discover why millions of Indians are switching to natural Ayurvedic remedies for long-lasting pain relief without side effects.",
    category: "Wellness",
    date: "May 2, 2026",
    readTime: "5 min",
    featured: true,
  },
  {
    slug: "joint-pain-home-remedies",
    title: "10 Ayurvedic Home Remedies for Joint Pain That Actually Work",
    excerpt: "From turmeric to ashwagandha — learn how these powerful herbs can transform your joint health naturally.",
    category: "Joint Care",
    date: "Apr 28, 2026",
    readTime: "7 min",
  },
  {
    slug: "daily-ayurvedic-routine",
    title: "The Complete Ayurvedic Daily Routine for Better Health",
    excerpt: "Follow this time-tested Dinacharya routine to boost immunity, reduce pain, and improve overall wellness.",
    category: "Lifestyle",
    date: "Apr 22, 2026",
    readTime: "6 min",
  },
  {
    slug: "turmeric-benefits",
    title: "Turmeric: The Golden Spice of Ayurveda and Its Incredible Benefits",
    excerpt: "Learn how turmeric has been used for thousands of years in Ayurveda to treat inflammation, pain, and more.",
    category: "Ingredients",
    date: "Apr 15, 2026",
    readTime: "4 min",
  },
  {
    slug: "back-pain-ayurvedic-treatment",
    title: "Say Goodbye to Back Pain: Ayurvedic Treatments That Work",
    excerpt: "Comprehensive guide to treating back pain with Ayurvedic oils, exercises, and lifestyle changes.",
    category: "Pain Relief",
    date: "Apr 10, 2026",
    readTime: "8 min",
  },
  {
    slug: "immunity-boosting-herbs",
    title: "Top 7 Ayurvedic Herbs to Boost Your Immunity Naturally",
    excerpt: "Strengthen your body's natural defenses with these time-tested Ayurvedic herbs and formulations.",
    category: "Immunity",
    date: "Apr 5, 2026",
    readTime: "5 min",
  },
];

const categories = ["All", "Wellness", "Joint Care", "Lifestyle", "Pain Relief", "Immunity"];

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Ayurvedic Health Blog — DARDGO" },
      { name: "description", content: "Expert Ayurvedic health tips, natural remedies, and wellness guides from DARDGO. Learn about pain relief, immunity, and holistic health." },
    ],
  }),
});

function BlogPage() {
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                📖 Health Blog
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3">
                Ayurvedic <span className="text-gradient-green">Insights</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                Expert tips, natural remedies, and wellness guides
              </p>
            </div>
          </ScrollReveal>

          {/* Category tabs */}
          <ScrollReveal>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-10 pb-2 justify-start sm:justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    cat === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Featured article */}
          {featured && (
            <ScrollReveal>
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="group block bg-gradient-hero rounded-3xl overflow-hidden mb-10 hover:shadow-brand transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-[16/9] md:aspect-auto bg-primary/20 flex items-center justify-center min-h-[200px]">
                    <span className="text-6xl">🌿</span>
                  </div>
                  <div className="p-8 sm:p-10 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-brand-yellow mb-3">{featured.category} • {featured.readTime}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-yellow transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-white/60 leading-relaxed">{featured.excerpt}</p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {/* Article grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.08}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 block h-full"
                >
                  <div className="aspect-[16/9] bg-gradient-cream flex items-center justify-center">
                    <span className="text-3xl">🌿</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <p className="text-[10px] text-muted-foreground mt-3">{post.date}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

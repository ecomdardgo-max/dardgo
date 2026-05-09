import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Leaf,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
  tags: string[];
}

type BlogCategory =
  | "Wellness"
  | "Joint Care"
  | "Lifestyle"
  | "Pain Relief"
  | "Immunity"
  | "Ingredients"
  | "Beauty";

const blogPosts: BlogPost[] = [
  {
    slug: "benefits-of-ayurvedic-pain-relief",
    title: "5 Benefits of Ayurvedic Pain Relief Over Chemical Painkillers",
    excerpt:
      "Discover why millions of Indians are switching to natural Ayurvedic remedies for long-lasting pain relief — without the side effects of NSAIDs.",
    category: "Wellness",
    author: "DARDGO Editorial",
    date: "May 2, 2026",
    readTime: "5 min",
    featured: true,
    trending: true,
    tags: ["pain relief", "ayurveda", "natural", "healing"],
  },
  {
    slug: "joint-pain-home-remedies",
    title: "10 Ayurvedic Home Remedies for Joint Pain That Actually Work",
    excerpt:
      "From turmeric to ashwagandha — learn how these powerful herbs can transform your joint health naturally and bring lasting comfort.",
    category: "Joint Care",
    author: "Dr. Vaidya Sharma",
    date: "Apr 28, 2026",
    readTime: "7 min",
    trending: true,
    tags: ["joint pain", "home remedies", "turmeric", "ashwagandha"],
  },
  {
    slug: "daily-ayurvedic-routine",
    title: "The Complete Ayurvedic Daily Routine (Dinacharya) for Better Health",
    excerpt:
      "Follow this time-tested routine to boost immunity, reduce pain, and improve overall wellness — one habit at a time.",
    category: "Lifestyle",
    author: "DARDGO Editorial",
    date: "Apr 22, 2026",
    readTime: "6 min",
    tags: ["dinacharya", "daily routine", "wellness", "ayurveda"],
  },
  {
    slug: "turmeric-benefits",
    title: "Turmeric: The Golden Spice of Ayurveda and Its Incredible Benefits",
    excerpt:
      "Learn how turmeric has been used for thousands of years in Ayurveda to treat inflammation, pain, and boost immunity.",
    category: "Ingredients",
    author: "Dr. Anjali Rao",
    date: "Apr 15, 2026",
    readTime: "4 min",
    tags: ["turmeric", "haldi", "anti-inflammatory", "spices"],
  },
  {
    slug: "back-pain-ayurvedic-treatment",
    title: "Say Goodbye to Back Pain: Ayurvedic Treatments That Work",
    excerpt:
      "A comprehensive guide to treating chronic back pain with Ayurvedic oils, targeted exercises, and lifestyle adjustments.",
    category: "Pain Relief",
    author: "DARDGO Editorial",
    date: "Apr 10, 2026",
    readTime: "8 min",
    tags: ["back pain", "ayurvedic oil", "spine", "exercises"],
  },
  {
    slug: "immunity-boosting-herbs",
    title: "Top 7 Ayurvedic Herbs to Boost Your Immunity Naturally",
    excerpt:
      "Strengthen your body's natural defenses with these time-tested Ayurvedic herbs and traditional formulations.",
    category: "Immunity",
    author: "Dr. Vaidya Sharma",
    date: "Apr 5, 2026",
    readTime: "5 min",
    tags: ["immunity", "herbs", "tulsi", "giloy"],
  },
  {
    slug: "ayurvedic-skincare-glow",
    title: "Ayurvedic Skincare Secrets for Naturally Glowing Skin",
    excerpt:
      "Ditch the chemicals — discover the herbal recipes Ayurveda uses to nourish skin from within for a lasting healthy glow.",
    category: "Beauty",
    author: "Dr. Anjali Rao",
    date: "Mar 30, 2026",
    readTime: "6 min",
    tags: ["skincare", "beauty", "glow", "natural"],
  },
  {
    slug: "ashwagandha-stress-relief",
    title: "Ashwagandha: The Ultimate Adaptogen for Stress & Sleep",
    excerpt:
      "How this ancient root helps the body adapt to stress, improve sleep quality, and support overall vitality.",
    category: "Ingredients",
    author: "DARDGO Editorial",
    date: "Mar 24, 2026",
    readTime: "5 min",
    tags: ["ashwagandha", "stress", "sleep", "adaptogen"],
  },
];

// Per-category visual identity — gradient cover + accent colour for chips and
// category links so each topic has a distinct feel without needing real photos.
const categoryStyles: Record<
  BlogCategory,
  { gradient: string; chip: string; icon: typeof Leaf }
> = {
  Wellness: {
    gradient: "from-emerald-400/30 via-emerald-500/20 to-teal-600/30",
    chip: "bg-emerald-500/10 text-emerald-700",
    icon: Leaf,
  },
  "Joint Care": {
    gradient: "from-orange-400/30 via-orange-500/20 to-amber-600/30",
    chip: "bg-orange-500/10 text-orange-700",
    icon: Sparkles,
  },
  Lifestyle: {
    gradient: "from-amber-300/30 via-yellow-400/20 to-orange-500/30",
    chip: "bg-amber-500/10 text-amber-700",
    icon: BookOpen,
  },
  "Pain Relief": {
    gradient: "from-rose-400/30 via-pink-500/20 to-red-500/30",
    chip: "bg-rose-500/10 text-rose-700",
    icon: Sparkles,
  },
  Immunity: {
    gradient: "from-green-500/30 via-emerald-600/20 to-teal-700/30",
    chip: "bg-green-500/10 text-green-700",
    icon: Leaf,
  },
  Ingredients: {
    gradient: "from-yellow-400/30 via-amber-500/20 to-orange-600/30",
    chip: "bg-yellow-500/10 text-yellow-800",
    icon: Sparkles,
  },
  Beauty: {
    gradient: "from-pink-400/30 via-rose-500/20 to-fuchsia-500/30",
    chip: "bg-pink-500/10 text-pink-700",
    icon: Sparkles,
  },
};

const allCategories = ["All", ...Object.keys(categoryStyles)] as Array<"All" | BlogCategory>;

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Ayurvedic Health Blog — DARDGO" },
      {
        name: "description",
        content:
          "Expert Ayurvedic health tips, natural remedies, and wellness guides from DARDGO. Learn about pain relief, immunity, beauty, and holistic health.",
      },
    ],
  }),
});

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<"All" | BlogCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic — searches title, excerpt, tags, and author. Case-insensitive
  // and works across both axes (category + free text) simultaneously.
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        post.title,
        post.excerpt,
        post.author,
        post.category,
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, searchQuery]);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const trending = filtered.filter((p) => p.trending && p.slug !== featured?.slug).slice(0, 2);
  const rest = filtered.filter(
    (p) => p.slug !== featured?.slug && !trending.find((t) => t.slug === p.slug),
  );

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    blogPosts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero header with search */}
      <section className="bg-gradient-cream border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-9 sm:py-14 lg:py-16">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-semibold mb-3 sm:mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">The DARDGO Health Journal</span>
              </span>
              <h1 className="text-display-2 text-foreground mb-3 sm:mb-4 break-words text-balance">
                Ayurvedic <span className="text-gradient-green">insights</span> for modern living
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-5 sm:mb-8 max-w-2xl mx-auto px-2">
                Expert tips, natural remedies, and wellness guides — written by Ayurvedic doctors and
                rooted in 5,000 years of healing tradition.
              </p>

              {/* Search bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, herbs…"
                  className="w-full pl-11 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 rounded-full bg-card border border-border/50 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 shadow-card transition-all"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Category tabs (sticky under the navbar). The top offsets match the
          navbar's *scrolled* heights (h-16 mobile / h-[72px] sm+) so the tabs
          dock cleanly without overlap or gap once the user starts scrolling. */}
      <div className="sticky top-16 sm:top-[72px] z-30 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div
            className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1"
            data-lenis-prevent
          >
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-foreground text-background shadow-soft"
                      : "bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        {/* Result hint */}
        {(searchQuery || activeCategory !== "All") && (
          <ScrollReveal>
            <div className="mb-6 sm:mb-8 text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-2">
              <span>
                {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
              </span>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="ml-auto sm:ml-0 inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                >
                  Clear filters →
                </button>
              )}
            </div>
          </ScrollReveal>
        )}

        {filtered.length === 0 ? (
          <ScrollReveal>
            <div className="text-center py-14 sm:py-20 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-muted flex items-center justify-center mx-auto mb-3.5 sm:mb-4">
                <Search className="w-7 h-7 sm:w-9 sm:h-9 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-foreground mb-1.5 sm:mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-5">
                Try a different search or browse another category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold"
              >
                Show all articles
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Featured + trending magazine layout */}
            {featured && (
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
                {/* Big hero featured card */}
                <ScrollReveal className="lg:col-span-2">
                  <FeaturedCard post={featured} />
                </ScrollReveal>

                {/* Two trending stacked cards on the right */}
                {trending.length > 0 && (
                  <div className="space-y-3 sm:space-y-6">
                    {trending.map((p, i) => (
                      <ScrollReveal key={p.slug} delay={(i + 1) * 0.08}>
                        <TrendingCard post={p} />
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Latest articles grid */}
            {rest.length > 0 && (
              <>
                <ScrollReveal>
                  <div className="flex items-end justify-between mb-5 sm:mb-8">
                    <div>
                      <span className="text-eyebrow text-primary mb-1.5 sm:mb-2 block">— Latest articles</span>
                      <h2 className="text-display-3 text-foreground">More to explore</h2>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-20">
                  {rest.map((post, i) => (
                    <ScrollReveal key={post.slug} delay={i * 0.06}>
                      <ArticleCard post={post} />
                    </ScrollReveal>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Topics cloud */}
        <ScrollReveal>
          <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border/30 shadow-card mb-8 sm:mb-14">
            <div className="flex items-start gap-3 mb-4 sm:mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Popular topics</h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground">Tap a tag to filter the journal</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted/60 hover:bg-primary/10 text-[11px] sm:text-xs font-medium text-foreground/70 hover:text-primary transition-colors capitalize"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Newsletter CTA */}
        <ScrollReveal>
          <div className="bg-gradient-hero rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-primary-foreground relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-brand-yellow/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-brand-green-light/15 blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-[11px] sm:text-xs font-semibold mb-3 sm:mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Free weekly health tips
              </span>
              <h3 className="text-xl sm:text-3xl font-bold mb-2.5 sm:mb-3 leading-tight">
                Get Ayurvedic wisdom delivered to your inbox
              </h3>
              <p className="text-xs sm:text-base text-white/75 leading-relaxed mb-5 sm:mb-6">
                Join 50,000+ readers receiving expert health tips, herbal remedies, and exclusive
                offers — every Sunday morning.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-lg"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-brand-yellow text-foreground font-bold text-sm hover:bg-brand-yellow-light transition-colors"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[11px] sm:text-xs text-white/45 mt-2.5 sm:mt-3">
                No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------
function CategoryCover({ category, height = "h-full" }: { category: BlogCategory; height?: string }) {
  const style = categoryStyles[category];
  const Icon = style.icon;
  return (
    <div className={`relative w-full ${height} bg-gradient-to-br ${style.gradient} overflow-hidden`}>
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-grain" />
      {/* Decorative orb */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      {/* Centered icon */}
      <div className="relative h-full flex items-center justify-center">
        <Icon className="w-14 h-14 sm:w-20 sm:h-20 text-white/85 drop-shadow-lg" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const style = categoryStyles[post.category];
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block relative rounded-3xl overflow-hidden border border-border/30 shadow-card hover:shadow-card-hover transition-shadow h-full bg-foreground"
    >
      <div className="aspect-[5/4] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[440px] relative">
        <CategoryCover category={post.category} />
        {/* Stronger gradient on mobile so the content overlay stays readable
            even when the background art is busy. */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/85 to-foreground/10 sm:via-foreground/80 sm:to-transparent" />

        {/* Featured badge */}
        <span className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-brand-yellow text-foreground text-[10px] sm:text-xs font-bold shadow-soft">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          Featured
        </span>

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${style.chip}`}>
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-white/70">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] sm:text-xs text-white/70">
              <Calendar className="w-3 h-3" />
              {post.date}
            </span>
          </div>
          <h2 className="text-base sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-snug sm:leading-tight group-hover:text-brand-yellow transition-colors line-clamp-3 sm:line-clamp-none">
            {post.title}
          </h2>
          <p className="hidden sm:block text-base text-white/75 leading-relaxed line-clamp-3 mb-5 max-w-2xl">
            {post.excerpt}
          </p>
          {/* Author row + CTA. On mobile we hide the secondary "Editorial team"
              subtitle and the avatar to give the title and CTA more breathing
              room — all of which prevents truncation/overflow on 320px screens. */}
          <div className="flex items-center justify-between gap-3 mt-2.5 sm:mt-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="hidden sm:flex w-9 h-9 rounded-full bg-gradient-to-br from-brand-yellow to-brand-green-light items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-foreground">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs text-white/85 font-semibold leading-tight truncate">
                  {post.author}
                </p>
                <p className="hidden sm:block text-[10px] text-white/55">Editorial team</p>
              </div>
            </div>
            <motion.span
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-brand-yellow flex-shrink-0"
            >
              Read article
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TrendingCard({ post }: { post: BlogPost }) {
  const style = categoryStyles[post.category];
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex gap-3 sm:gap-4 bg-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/30 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-2.5 sm:p-4 h-full"
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden">
        <CategoryCover category={post.category} />
      </div>
      <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5 sm:py-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full ${style.chip}`}>
              {post.category}
            </span>
            {post.trending && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-semibold text-brand-orange">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>
          <h3 className="font-bold text-foreground text-[13px] sm:text-base leading-snug line-clamp-3 sm:line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground min-w-0">
          <span className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
          <span className="flex-shrink-0">·</span>
          <span className="truncate">{post.author}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  const style = categoryStyles[post.category];
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 h-full"
    >
      <div className="aspect-[16/9] sm:aspect-[16/10] overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          <CategoryCover category={post.category} />
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.chip}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className="font-bold text-foreground text-sm sm:text-lg mb-1.5 sm:mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3 sm:mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t border-border/40">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-primary/20 to-brand-yellow/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-foreground/80">
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">{post.author}</p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground flex-shrink-0">{post.date}</p>
        </div>
      </div>
    </Link>
  );
}

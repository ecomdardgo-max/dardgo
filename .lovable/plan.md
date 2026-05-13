# DARDGO Premium Ayurvedic Storefront Redesign

## Overview

Complete frontend redesign of the DARDGO storefront with premium Ayurvedic healthcare aesthetics, Framer Motion animations, mobile-first design, and multiple new pages. Preserves existing Shopify Storefront API integration.

**Note:** This project uses TanStack Start (not React Router DOM) for routing, so all routes will follow TanStack conventions.

## Phase 1: Foundation — Design System & Global Layout

### Design Tokens (styles.css)

- New color palette: Ayurvedic Green (#2E7D32), Herbal Light Green (#66BB6A), Warm Cream (#F8F5EF), Soft Beige (#EFE7DA), Gold accents
- Typography: DM Sans (body) + Poppins (headings) via Google Fonts
- Glassmorphism utilities, soft shadows, rounded corner tokens
- Animation keyframes for marquee, float, pulse-glow

### Global Components

- **Navbar** — Redesigned sticky header with search drawer, cart icon with count, category mega-menu, glassmorphism on scroll
- **MobileBottomNav** — Sticky bottom navigation (Home, Categories, Cart, Blog, Account) with active states
- **WhatsApp Float** — Pulse-animated floating button
- **SearchDrawer** — Full-screen search modal with suggestions
- **CartDrawer** — Slide-in cart with quantity controls, coupon input, price breakdown
- **Footer** — Multi-column premium footer with newsletter signup

### Install Dependencies

- `framer-motion` for animations
- `swiper` for carousels

## Phase 2: Homepage Redesign

Rebuild all homepage sections:

1. **HeroSection** — Full-width gradient banner with floating medicine card illustrations, dual CTAs, Framer Motion entrance animations
2. **TrustedBySection** — Customer count, doctor recommendations, ratings strip with counter animations
3. **FeaturedProducts** — Swiper carousel of premium product cards with hover effects, ratings, discount badges, quick-add
4. **AyurvedicBenefits** — Icon grid: Natural, Chemical-free, Certified, Doctor Approved with scroll-reveal
5. **CategoriesSection** — Visual category cards (Pain Relief, Joint Care, Immunity, Digestive, Women/Men Wellness) with hover animations
6. **WhyChooseDardgo** — Trust badges grid with glassmorphism cards
7. **Testimonials** — Modern review slider with user avatars, star ratings, video-style cards
8. **BlogPreview** — Latest 3 blog cards with hover effects
9. **NewsletterSection** — Organic gradient background with email input
10. **Footer** — Multi-column with social links, contact info

## Phase 3: New Pages

### Collection Page (`/collections/$handle`)

- Product grid (2 cols mobile, 3-4 cols desktop)
- Sidebar filters (mobile: bottom sheet drawer)
- Sort dropdown, category tabs, pagination
- Product cards with wishlist, ratings, discount badges

### Product Details Page (update existing `/product/$handle`)

- Large image gallery with thumbnail strip and zoom
- Sticky mobile CTA bar (Add to Cart / Buy Now)
- Accordion sections: Benefits, Ingredients, How to Use, FAQ
- Reviews section with star breakdown
- Related products carousel

### Cart Page (`/cart`)

- Full cart UI with quantity controls, remove, coupon input
- Price breakdown (subtotal, discount, delivery, total)
- Delivery estimation
- Checkout button redirecting to Shopify

### Checkout Redirect Page (`/checkout`)

- Premium loading animation
- "Redirecting to secure checkout" messaging
- Trust badges

### Blog Listing (`/blog`)

- Featured article hero
- Article grid with category filter tabs
- Pagination

### Blog Details (`/blog/$slug`)

- Hero image, rich typography
- Sticky share buttons
- Related articles

### About Page (update existing `/about`)

- Brand story with timeline
- Mission & Ayurvedic philosophy
- Certifications grid
- Team section

### Contact Page (update existing `/contact`)

- Contact form with validation
- Map placeholder
- WhatsApp/Email/Phone cards
- FAQ accordion

## Phase 4: Animations & Polish

- Framer Motion scroll-reveal wrapper component
- Page transition animations
- Skeleton loaders for products
- Empty state components
- Hover micro-interactions on all cards
- Smooth mobile drawer transitions

## Technical Details

- All routes use TanStack Start `createFileRoute`
- Each page gets unique `head()` metadata for SEO
- Reusable animation wrapper: `ScrollReveal` component using framer-motion `useInView`
- Product data uses existing Shopify Storefront API (`src/lib/shopify.ts`)
- Cart uses existing `useCartStore` zustand store
- Blog/testimonial data will use static mock data (to be replaced with CMS later)
- Mobile-first responsive design throughout

### New Files (~25-30 components + 6 route files)

### Modified Files (~10 existing components + styles.css)

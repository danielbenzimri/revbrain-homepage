# Geometrix Marketing Site - Production Spec & Roadmap

> **Purpose**: North-star specification for transforming the Geometrix marketing site from a static mock into a production-grade, CMS-driven, SSR/SSG website capable of generating leads, onboarding tenants, and supporting multi-page campaigns.
>
> **Audience**: External auditors, product managers, engineers, and stakeholders.
>
> **Last Updated**: March 2025

### Scope

This document covers the public-facing Geometrix marketing website, including homepage, solution pages, landing pages, blog, legal pages, analytics, localization, CMS operations, and lead capture workflows. It does **not** cover the authenticated product application (`app.geometrixlabs.com`).

---

## Table of Contents

1. [Product Context](#1-product-context)
2. [Business Goals & KPIs](#2-business-goals--kpis)
3. [Delivery Scope by Milestone](#3-delivery-scope-by-milestone)
4. [Positioning & Messaging Architecture](#4-positioning--messaging-architecture)
5. [Current State](#5-current-state)
6. [Gap Analysis](#6-gap-analysis)
7. [Target Architecture](#7-target-architecture)
8. [CMS Strategy (Contentful)](#8-cms-strategy-contentful)
9. [Localization Strategy](#9-localization-strategy)
10. [External Service Integrations](#10-external-service-integrations)
11. [Page & Routing Strategy](#11-page--routing-strategy)
12. [Launch Phases](#12-launch-phases)
13. [Section-by-Section Spec](#13-section-by-section-spec)
14. [Design System](#14-design-system)
15. [SEO Strategy](#15-seo-strategy)
16. [Analytics, Attribution & Experimentation](#16-analytics-attribution--experimentation)
17. [Lead Capture & CRM](#17-lead-capture--crm)
18. [Performance Budgets & Image Optimization](#18-performance-budgets--image-optimization)
19. [Accessibility](#19-accessibility)
20. [Security & Compliance](#20-security--compliance)
21. [Testing Strategy](#21-testing-strategy)
22. [Content Operations & Editorial Workflow](#22-content-operations--editorial-workflow)
23. [Technical Implementation Plan](#23-technical-implementation-plan)
24. [Risks & Mitigations](#24-risks--mitigations)
25. [Non-Goals](#25-non-goals)
26. [Content Readiness Checklist](#26-content-readiness-checklist)
27. [Decision Log](#27-decision-log)
28. [Appendix: Reference Architecture from ScaleupLabs](#28-appendix-reference-architecture-from-scaleuplabs)

---

## 1. Product Context

### What is Geometrix?

Geometrix is a **cloud-based SaaS platform for construction quantity surveying and project management**, targeting the Israeli infrastructure and construction market. It digitizes the traditionally manual, error-prone processes of quantity calculations, bill verification, and project execution tracking.

### Core Value Proposition

> _"Transform weeks of manual calculation work into hours of verified, traceable results."_

### Target Customers

| Persona                      | Role                                         | Pain Point                                             |
| ---------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| **Quantity Surveyors**       | Professionals preparing bills of quantities  | Manual Excel calculations take weeks, no audit trail   |
| **Inspectors & Controllers** | Site inspectors verifying submitted work     | Cannot verify contractor calculations, no traceability |
| **Tender Estimators**        | Contractors bidding on public tenders        | Tight deadlines, need fast rough quantities            |
| **Managed Service Users**    | Small contractors without in-house surveyors | Cannot afford dedicated QS staff                       |

### Key Capabilities

- **20 specialized calculation modules** (earthworks, paving, retaining walls, drainage, landscaping, etc.)
- **DXF/CAD integration** - extract quantities directly from engineering drawings
- **Automatic Bill of Quantities (BOQ) generation** with full audit trails
- **Execution bill tracking** - contractors submit, inspectors verify/approve
- **Multi-party collaboration** - chat, tasks, file management, daily work logs
- **Multi-tenant architecture** - organizations with RBAC, seat limits, subscriptions

### Pricing Model

| Plan                   | Target                  | Price                                                                  |
| ---------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Calculations           | Quantity Surveyors      | $350/month per project per user + unlimited reviewer users (view-only) |
| Contractor / Inspector | Contractors, Inspectors | $200/month per user + unlimited reviewer users (view-only)             |
| Managed Service        | All                     | Custom - schedule a meeting for a quote                                |

### Current Product Status

The platform is in **late beta / pre-production**. Core infrastructure is stable (Supabase + Vercel), the full API is implemented (21 route modules), all 20 calculation modules exist, and billing is integrated via Stripe. The product is **not yet publicly available**.

This means the marketing site must support a **phased go-to-market** - starting with brand awareness and lead capture, then enabling self-service onboarding when the product launches.

---

## 2. Business Goals & KPIs

### Primary Business Goals by Phase

| Phase           | Primary Goal                             | KPIs                                                      |
| --------------- | ---------------------------------------- | --------------------------------------------------------- |
| **Coming Soon** | Capture qualified interest               | Demo bookings, waitlist signups, contact form submissions |
| **Pre-Launch**  | Validate demand, educate market          | MQL volume, blog organic traffic, case study engagement   |
| **Live**        | Convert traffic into pipeline and trials | Trial starts, CAC by channel, visitor-to-signup CVR       |

### Core KPIs

- Visitor -> CTA click rate
- Visitor -> contact form submit rate
- Visitor -> meeting booked rate
- Visitor -> waitlist signup rate (Phase 1-2) / trial start rate (Phase 3)
- Landing page conversion rate by campaign
- Organic traffic growth (month-over-month)
- Blog-assisted conversion rate
- Bounce rate by language and source
- Core Web Vitals pass rate
- CMS publish-to-live latency

### Quantitative Targets

| Phase       | Metric                             | Target    |
| ----------- | ---------------------------------- | --------- |
| **Phase 1** | Lighthouse Performance (mobile)    | > 90      |
|             | Contact form submissions / week    | > 5       |
|             | Demo meetings booked / month       | > 10      |
|             | Bounce rate                        | < 60%     |
|             | Average session duration           | > 1.5 min |
| **Phase 2** | Organic search impressions / month | > 1,000   |
|             | Blog posts published / month       | > 4       |
|             | Waitlist signups (cumulative)      | > 100     |
|             | Returning visitors                 | > 20%     |
| **Phase 3** | Signup conversion rate             | > 2%      |
|             | Trial-to-paid conversion           | > 10%     |
|             | Organic traffic / month            | > 5,000   |
|             | CTA click-through rate             | > 5%      |

### SLAs

- LCP < 2.5s on 75th percentile
- CLS < 0.1
- Form delivery success rate > 99%
- CMS publish-to-live latency < 5 minutes (via ISR/on-demand revalidation)
- 404 rate < 1%
- Broken CTA rate = 0

### Homepage Narrative Requirement

Within 15 seconds, a visitor should understand:

1. What Geometrix does
2. Who it is for
3. Why it is better than manual workflows
4. Whether it is trustworthy
5. What to do next

This is the benchmark against which section order, copy, and visual design should be measured.

---

## 3. Delivery Scope by Milestone

This is the most important section for preventing over-building. Not everything in this spec ships at once.

### P0 - Launch Blockers (ship first)

Everything required to go live with a "Coming Soon" marketing site:

- Next.js scaffold + migrate existing components from Vite
- `[locale]` routing with RTL/LTR support + root URL middleware
- Tailwind 4 build-time (remove CDN)
- Contentful integration (simple pattern: individual content entries, not composable blocks)
  - `siteSettings`, `announcementBar`, `testimonial`, `teamMember`, `faqItem`, `pricingPlan`, `module`
- Homepage with hardcoded section order (each section fetches its own content)
- Phase gating via `siteSettings` with hardcoded defaults
- Contact form with Resend API route
- Cal.com scheduling link
- PostHog analytics (consent-aware) + cookie consent banner
- Sentry error monitoring
- SEO fundamentals: `generateMetadata`, OG tags, `hreflang`, sitemap, robots.txt
- Legal pages (Privacy, Terms, Cookie Policy)
- 404 page
- SPA-to-multi-page redirect rules
- Vercel deployment + GitHub Actions CI/CD
- Real product screenshots in hero
- Content migration from `constants.tsx` to Contentful

### P1 - 30 Days After Launch

- About page, Security page
- Solutions pages (`/solutions/[slug]`) using `persona` content type
- Module directory page
- FAQ expansion (8-12 questions)
- Team section with CMS
- Landing page infrastructure (`/lp/[slug]`) - **this is when composable sections ship**:
  - All `section*` block content types
  - `SectionRenderer` component
  - `landingPage` composable page type
- Playwright E2E tests + Lighthouse CI

### P2 - Growth Stage

- Blog (listing + detail pages, `blogPost` content type)
- Case studies (`caseStudy` content type)
- Comparison page (manual vs. Geometrix)
- Newsletter signup (Resend)
- A/B testing via PostHog feature flags
- CRM integration (HubSpot or Pipedrive)
- Visual regression tests
- RSS feed for blog

### P3 - Scale

- ROI calculator
- Advanced attribution + cross-domain identity
- Resource center / downloads
- Changelog
- Site search (Pagefind)
- Richer campaign templates

**The composable section-block architecture is the right end state. But it ships in P1, not P0.** Phase 1 homepage uses hardcoded React section components that pull individual content entries from Contentful - exactly like the ScaleupLabs pattern. This saves 5-8 days from the P0 estimate.

---

## 4. Positioning & Messaging Architecture

### Messaging Hierarchy

1. **Core promise**: Dramatically reduce quantity surveying effort
2. **Proof**: Verified traceable calculations, audit trail, DXF integration
3. **Differentiator**: Purpose-built for Israeli infrastructure workflows (Dekel pricing, local standards)
4. **Trust**: Multi-tenant security, role-based access, bill verification workflows
5. **Action**: Demo / waitlist / trial depending on phase

### Message Hierarchy by Persona

| Persona            | Lead Message                                             | Supporting Proof                                              |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------- |
| Quantity Surveyors | "Move from Excel to automated, verified calculations"    | 20 modules, DXF integration, 85% time savings                 |
| Inspectors         | "Verify execution against plans with full traceability"  | Audit trails, multi-signature workflows, measurement tracking |
| Estimators         | "Fast tender quantities with historical data"            | Rapid calculations, no CAD knowledge required                 |
| Managed Service    | "Professional quantity surveying without in-house staff" | Per-project pricing, expert team, fast turnaround             |

### Key Objections to Answer (drives FAQ and content)

- Is it accurate enough for official submissions?
- Will it work with our DXF/CAD drawings?
- How hard is onboarding?
- Is pricing worth it vs. manual QS?
- Can inspectors trust outputs?
- Is data secure and where is it stored?
- Is Hebrew fully supported?
- What if we don't have in-house QS staff?

---

## 5. Current State

### Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (loaded via CDN)
- Lucide React icons
- pnpm package manager
- Single-page application with anchor navigation

### Existing Sections

1. **Header** - Fixed nav, language toggle (HE/EN), login/signup links
2. **Hero** - Headline, stats (1,500+ projects, 85% time saved, 99.9% accuracy), CTA
3. **Trusted By** - 5 placeholder company logos
4. **Use Cases** - Tabbed section for 3 personas
5. **Modules** - 20-module grid
6. **Pricing** - 4-tier table
7. **Team** - 4 members with placeholder photos
8. **Testimonials** - 2 customer quotes
9. **FAQ** - 3 accordion items
10. **CTA Section** - Final call-to-action
11. **Footer** - Links, social icons

### What Works Well

- Clean bilingual implementation (Hebrew/English) with RTL/LTR support
- Well-organized component architecture with TypeScript interfaces
- Responsive, mobile-first design
- Professional visual design with consistent color system (Emerald/Slate)
- Centralized content in `constants.tsx`

---

## 6. Gap Analysis

### Critical Gaps (Must Fix)

| Area                       | Current State                  | Required State                                                     |
| -------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| **Rendering Architecture** | Client-side SPA (React + Vite) | SSR/SSG via Next.js for SEO, performance, OG tags                  |
| **Content Management**     | Hardcoded in `constants.tsx`   | CMS-driven via Contentful with toggles                             |
| **Localization**           | Client-side toggle, UI-only    | Route-based locales (`/he`, `/en`) with `hreflang`                 |
| **Contact / Lead Capture** | `mailto:` link only            | Working contact form with email delivery + CRM roadmap             |
| **Meeting Scheduling**     | Not present                    | Cal.com integration (link + embedded widget)                       |
| **Analytics**              | None                           | PostHog with event taxonomy + Google Search Console                |
| **Error Monitoring**       | None                           | Sentry for runtime errors + Vercel Analytics for Web Vitals        |
| **Phase Gating**           | All sections always visible    | Contentful-driven toggles to show/hide sections per launch phase   |
| **Legal Pages**            | Dummy links                    | Real Privacy Policy, Terms of Service, Cookie Policy               |
| **Cookie Consent**         | None                           | GDPR-compliant consent banner (required for PostHog in EU)         |
| **SEO**                    | Minimal meta tags              | Server-rendered meta/OG tags, structured data, sitemap, `hreflang` |
| **Testing**                | None                           | Vitest + Playwright + Lighthouse CI                                |
| **Deployment**             | Local dev only                 | CI/CD pipeline to Vercel with preview deployments                  |

### Content Gaps

| Area             | Current State              | Required State                                        |
| ---------------- | -------------------------- | ----------------------------------------------------- |
| **Team Photos**  | Generic Unsplash images    | Real team photographs                                 |
| **Client Logos** | Text placeholders          | Real client/partner logos or remove section           |
| **Testimonials** | 2 synthetic quotes         | Real customer testimonials (minimum 4-6)              |
| **Social Links** | `#` placeholders           | Real LinkedIn, Twitter/X, YouTube profiles            |
| **Hero Visual**  | Generic construction photo | Product screenshots or animated demo                  |
| **Case Studies** | None                       | At least 2-3 customer stories                         |
| **FAQ**          | 3 basic questions          | 8-12 questions covering pricing, security, onboarding |

### Missing Sections (Best-in-Class SaaS)

| Section                        | Purpose                                       | Priority |
| ------------------------------ | --------------------------------------------- | -------- |
| **How It Works**               | Visual 3-4 step flow showing the user journey | P0       |
| **Product Demo / Screenshots** | Show the actual product UI                    | P0       |
| **Security & Compliance**      | Trust badges, data residency                  | P1       |
| **Integrations**               | DXF, Dekel pricing, future integrations       | P1       |
| **ROI Calculator**             | Interactive tool showing time/cost savings    | P3       |
| **Blog / Resources**           | SEO content, guides, industry articles        | P2       |
| **Comparison Table**           | Geometrix vs. manual process                  | P2       |

---

## 7. Target Architecture

### Recommended Architecture: Next.js

A client-side SPA is fundamentally wrong for a marketing site that needs SEO, fast first paint, server-rendered OG tags, and dynamic content pages.

**Problems with current Vite SPA approach:**

- JS-rendered content introduces crawl/render latency and reduces reliability for time-sensitive indexing and social metadata
- 3-hop waterfall: download JS -> execute -> fetch Contentful -> render
- Open Graph scrapers (LinkedIn, Twitter, Slack, iMessage) do not execute JavaScript
- Core Web Vitals (LCP, CLS) suffer significantly
- Dynamic routes show loading spinners before content appears

### Target Stack

| Layer                | Technology                                            | Rationale                                             |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **Framework**        | Next.js 15 (App Router)                               | SSR/SSG/ISR, server-rendered metadata, Vercel-native  |
| **Rendering**        | Static generation for most pages, ISR for CMS content | Best performance + fresh content                      |
| **CMS**              | Contentful (Content Delivery + Preview APIs)          | Proven pattern from ScaleupLabs                       |
| **Styling**          | Tailwind CSS 4 (build-time)                           | Current team knowledge, excellent RTL support         |
| **Forms**            | React Hook Form + Zod                                 | Type-safe validation                                  |
| **Analytics**        | PostHog + Google Search Console                       | Behavior tracking + search performance                |
| **Error Monitoring** | Sentry + Vercel Analytics                             | Runtime errors + Core Web Vitals                      |
| **Email**            | Resend (via Next.js API routes)                       | Reliable delivery, no third-party dependency          |
| **Scheduling**       | Cal.com                                               | Meeting booking                                       |
| **Hosting**          | Vercel                                                | Matches product deployment, ISR support, Edge Network |
| **Testing**          | Vitest + Playwright + Lighthouse CI                   | Unit, E2E, performance                                |
| **Animation**        | `motion` (Framer Motion lite)                         | Declarative with reduced-motion support               |
| **Package Manager**  | pnpm                                                  | Current team standard                                 |

### System Overview

```
                    +------------------+
                    |   Contentful     |
                    |   (Headless CMS) |
                    +--------+---------+
                             |
                     Delivery API (server-side preferred)
                     Preview API (draft mode)
                     Webhook (on publish -> revalidate)
                             |
                             v
+------------+      +--------+---------+      +---------------+
|  Vercel    | <--- |  Geometrix       | ---> |  Cal.com      |
|  Hosting   |      |  Marketing Site  |      |  (Scheduling) |
|  (Edge CDN)|      |  (Next.js 15)    |      +---------------+
+------------+      |                  |
                    |  App Router      | ---> +---------------+
                    |  Server Comps    |      |  Resend       |
                    |  ISR / SSG       |      |  (Email)      |
                    +--------+---------+      +---------------+
                             |
                     PostHog (after consent)
                     Sentry (via @sentry/nextjs SDK)
                     Google Search Console
```

### Rendering Strategy

| Page Type                   | Rendering | Revalidation                   |
| --------------------------- | --------- | ------------------------------ |
| Homepage                    | SSG + ISR | On-demand (Contentful webhook) |
| Legal pages                 | SSG       | On deploy                      |
| Blog listing                | SSG + ISR | 60 seconds                     |
| Blog post                   | SSG + ISR | On-demand (Contentful webhook) |
| Case studies                | SSG + ISR | On-demand                      |
| Landing pages (`/lp/:slug`) | SSG + ISR | On-demand                      |
| Contact / Schedule          | SSG       | On deploy                      |
| 404                         | Static    | On deploy                      |

### Homepage Data Fetching Pattern (P0)

In Phase 1, the homepage is a server component with explicit sections (not composed via SectionRenderer):

```typescript
// app/[locale]/page.tsx (Server Component)
export const revalidate = false; // On-demand revalidation only

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'he' ? 'he-IL' : 'en-US';

  // Parallel fetch all homepage data - no waterfall
  const [siteSettings, announcement, testimonials, teamMembers, faqItems, pricingPlans, modules] =
    await Promise.all([
      getSiteSettings(),
      getAnnouncementBar(locale),
      getTestimonials(locale),
      getTeamMembers(locale),
      getFaqItems(locale),
      getPricingPlans(locale),
      getModules(locale),
    ]);

  return (
    <>
      {announcement?.enabled && <AnnouncementBar data={announcement} />}
      <Hero phase={siteSettings.phase} ctaType={siteSettings.ctaType} />
      <HowItWorks />
      <UseCases />
      <ModulesGrid data={modules} />
      {siteSettings.showTestimonials && testimonials.length >= 4 && (
        <Testimonials data={testimonials} />
      )}
      {siteSettings.showPricing && <Pricing data={pricingPlans} phase={siteSettings.phase} />}
      <FAQ data={faqItems} />
      <Contact />
      <CTA ctaType={siteSettings.ctaType} />
    </>
  );
}
```

**Key patterns:**

- All fetches are **parallel** (`Promise.all`, no waterfall)
- `siteSettings` controls visibility **in the server component** - hidden sections don't render HTML
- Minimum content thresholds enforced server-side (e.g., testimonials >= 4)
- Individual section fetch failure -> skip that section, don't crash the page
- Homepage is **not** composed via `SectionRenderer` in P0 - sections are explicit

### Section Error/Empty State Contract

Every section component follows this defensive rendering contract:

| Scenario                                     | Behavior                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Section data fetch fails                     | Skip section entirely (don't crash page). Log to Sentry.                       |
| Section data returns empty array             | Skip section entirely (don't render empty container).                          |
| Section below minimum threshold              | Follow `siteSettings` toggle (which should be `false` until content is ready). |
| `siteSettings` fetch fails                   | Use hardcoded defaults (all sections conservative/hidden).                     |
| Single entry in a list is malformed          | Skip that entry, render remaining valid entries.                               |
| Image asset missing `description` (alt text) | Use `title` as fallback. If both missing, use empty string + Sentry warning.   |

### Revalidation Path Mapping

The `/api/revalidate` webhook must know which paths to revalidate when content changes:

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const secret = request.headers.get('x-contentful-webhook-secret');
  if (secret !== process.env.CONTENTFUL_REVALIDATION_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const contentType = body.sys?.contentType?.sys?.id;
  const slug = body.fields?.slug?.['en-US'];
  const locales = ['he', 'en'];
  const paths: string[] = [];

  switch (contentType) {
    case 'siteSettings':
    case 'announcementBar':
      locales.forEach((l) => paths.push(`/${l}`)); // All pages use these
      break;
    case 'testimonial':
    case 'faqItem':
    case 'pricingPlan':
    case 'module':
      locales.forEach((l) => paths.push(`/${l}`));
      break;
    case 'teamMember':
      locales.forEach((l) => {
        paths.push(`/${l}`);
        paths.push(`/${l}/about`);
      });
      break;
    case 'blogPost':
      locales.forEach((l) => {
        paths.push(`/${l}/blog`);
        if (slug) paths.push(`/${l}/blog/${slug}`);
      });
      break;
    case 'landingPage':
      if (slug) locales.forEach((l) => paths.push(`/${l}/lp/${slug}`));
      break;
    case 'caseStudy':
      locales.forEach((l) => {
        paths.push(`/${l}/case-studies`);
        if (slug) paths.push(`/${l}/case-studies/${slug}`);
      });
      break;
    case 'persona':
      if (slug) locales.forEach((l) => paths.push(`/${l}/solutions/${slug}`));
      break;
  }

  await Promise.all(paths.map((path) => revalidatePath(path)));
  return Response.json({ revalidated: paths });
}
```

### Static Params Generation for Dynamic Routes

All dynamic routes use `generateStaticParams` to prerender known slugs at build time:

```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllBlogPostSlugs(); // Fetches from Contentful
  const locales = ['he', 'en'];
  return locales.flatMap((locale) => posts.map((slug) => ({ locale, slug })));
}

// Same pattern for /solutions/[slug], /lp/[slug], /case-studies/[slug]
```

- At build time, all known CMS slugs are prerendered for both locales
- `dynamicParams = true` (default) allows new CMS entries to be rendered on first request via ISR
- The revalidation webhook ensures timely updates without waiting for the ISR timer

### Why Not Stay on Vite

If Next.js is rejected, the minimum viable alternative is:

- `vite-plugin-ssr` or `vite-plugin-prerender` for SSR/prerendering
- Custom build script to enumerate CMS slugs and prerender dynamic routes
- Manual OG tag prerendering (fragile)
- Custom sitemap generation script

This results in more custom code, more maintenance, and worse DX than Next.js provides out of the box. **Next.js is the strong recommendation.**

---

## 8. CMS Strategy (Contentful)

### Why Contentful

The ScaleupLabs project already uses Contentful successfully. Using the same CMS provides shared team knowledge, consistent patterns, and proven integration code.

### CMS Principles

1. **Ship simple first, compose later** - P0 uses individual entries; P1 adds composable blocks
2. **Native localization** - Use Contentful locales, not duplicated `_en`/`_he` fields
3. **Validation at the CMS layer** - Required alt text, slug uniqueness, max title length
4. **Preview before publish** - Draft content visible via Preview API
5. **Every publishable entry has SEO controls** - `seoTitle`, `seoDescription`, `ogImage`, `noIndex`
6. **No section renders without minimum viable content quality**

### Two-Track CMS Strategy

| Track               | Content Types                                                                                                 | When                                | Pattern                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| **P0 (ship fast)**  | `siteSettings`, `announcementBar`, `testimonial`, `teamMember`, `faqItem`, `pricingPlan`, `module`, `persona` | Now                                 | Homepage = hardcoded section order, each section fetches its own entries |
| **P1 (composable)** | All `section*` block types, `landingPage`, `SectionRenderer`                                                  | When marketing needs campaign pages | Pages composed from referenced section blocks                            |
| **P2 (content)**    | `blogPost`, `caseStudy`                                                                                       | When blog/content marketing begins  | Standard content pages with dedicated routes                             |

### Localization Approach

**Use Contentful's built-in localization.** Every text field is marked as localized in the content model:

```
Content Model: testimonial
  - name (Short Text)
  - role (Short Text, localized)
  - company (Short Text)
  - quote (Long Text, localized)
```

Fetch with locale parameter:

```typescript
const entries = await client.getEntries({
  content_type: 'testimonial',
  locale: locale === 'he' ? 'he-IL' : 'en-US',
});
```

**Benefits:** Half the fields, native translator UI, trivial to add languages, automatic fallback chain.

### Contentful Locale Configuration

```
Locales:
  - he-IL (Hebrew, default)
  - en-US (English, fallback)

Fallback chain: he-IL -> en-US
```

### P0 Content Model Usage

| Content Type      | Used in P0 Homepage          | Used in P1+ Routes        | Notes                             |
| ----------------- | ---------------------------- | ------------------------- | --------------------------------- |
| `siteSettings`    | Yes (phase gating)           | Yes (all pages)           | Core singleton, homepage-blocking |
| `announcementBar` | Yes                          | Yes (all pages)           | Core singleton                    |
| `testimonial`     | Optional (hidden until >= 4) | Yes (landing pages)       | Not blocking P0 launch            |
| `teamMember`      | Yes (team section)           | Yes (about page P1)       | Homepage-blocking                 |
| `faqItem`         | Yes (FAQ section)            | Yes (shared)              | Homepage-blocking                 |
| `pricingPlan`     | Hidden by default in P0      | Yes (pricing page P1)     | Not blocking P0 launch            |
| `module`          | Yes (modules grid)           | Yes (module directory P1) | Homepage-blocking                 |
| `persona`         | Yes (use cases tabs)         | Yes (solutions pages P1)  | Homepage-blocking                 |

All P0 content models are created upfront. Some enable P0 homepage sections directly; others are populated now but their dedicated routes ship in P1.

> **Future note**: If `siteSettings` exceeds ~12-15 fields or begins mixing global infrastructure concerns with page-level merchandising logic, split into `siteSettings` (maintenance mode, default locale, app URLs) and `marketingPhaseSettings` (phase, visibility toggles, CTA type).

### P0 Content Models (Individual Entries)

**`siteSettings`** (Singleton) - Phase gating mechanism

| Field               | Type              | Purpose                                                      |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `phase`             | Short Text (enum) | `coming-soon`, `pre-launch`, `live`                          |
| `showPricing`       | Boolean           | Toggle pricing section                                       |
| `showSignup`        | Boolean           | Toggle signup CTAs                                           |
| `showLogin`         | Boolean           | Toggle login link                                            |
| `showBlog`          | Boolean           | Toggle blog                                                  |
| `showTestimonials`  | Boolean           | Toggle testimonials                                          |
| `showCaseStudies`   | Boolean           | Toggle case studies                                          |
| `showRoiCalculator` | Boolean           | Toggle ROI calculator                                        |
| `ctaType`           | Short Text (enum) | `schedule-meeting`, `join-waitlist`, `start-trial`, `signup` |
| `maintenanceMode`   | Boolean           | Show maintenance page                                        |

**Hardened with code defaults** - if entry is missing/unpublished/corrupted:

```typescript
const DEFAULTS: SiteSettings = {
  phase: 'coming-soon',
  showPricing: false,
  showSignup: false,
  showLogin: false,
  showBlog: false,
  showTestimonials: false,
  showCaseStudies: false,
  showRoiCalculator: false,
  ctaType: 'schedule-meeting',
  maintenanceMode: false,
};
```

**`announcementBar`** (Singleton)

| Field                   | Type                                      |
| ----------------------- | ----------------------------------------- |
| `message` (localized)   | Short Text                                |
| `linkUrl`               | Short Text                                |
| `linkLabel` (localized) | Short Text                                |
| `enabled`               | Boolean                                   |
| `variant`               | Short Text (enum: info, success, warning) |

**`testimonial`**

| Field               | Type          |
| ------------------- | ------------- |
| `name`              | Short Text    |
| `role` (localized)  | Short Text    |
| `company`           | Short Text    |
| `image`             | Asset         |
| `quote` (localized) | Long Text     |
| `rating`            | Integer (1-5) |
| `featured`          | Boolean       |

**`teamMember`**

| Field              | Type       |
| ------------------ | ---------- |
| `name`             | Short Text |
| `role` (localized) | Short Text |
| `bio` (localized)  | Long Text  |
| `image`            | Asset      |
| `linkedin`         | Short Text |
| `order`            | Integer    |

**`faqItem`**

| Field                  | Type                                                      |
| ---------------------- | --------------------------------------------------------- |
| `question` (localized) | Short Text                                                |
| `answer` (localized)   | Rich Text                                                 |
| `category`             | Short Text (enum: general, pricing, security, onboarding) |
| `order`                | Integer                                                   |

**`pricingPlan`**

| Field                  | Type                        |
| ---------------------- | --------------------------- |
| `name` (localized)     | Short Text                  |
| `price`                | Integer                     |
| `currency`             | Short Text                  |
| `billingPeriod`        | Short Text (monthly/yearly) |
| `features` (localized) | Long Text (list)            |
| `highlighted`          | Boolean                     |
| `ctaLabel` (localized) | Short Text                  |
| `ctaUrl`               | Short Text                  |
| `order`                | Integer                     |

**`module`**

| Field                 | Type                                                                   |
| --------------------- | ---------------------------------------------------------------------- |
| `name` (localized)    | Short Text                                                             |
| `slug`                | Short Text                                                             |
| `category`            | Short Text (enum: earthworks, structures, infrastructure, landscaping) |
| `summary` (localized) | Long Text                                                              |
| `icon`                | Short Text                                                             |
| `screenshot`          | Asset                                                                  |
| `featured`            | Boolean                                                                |
| `order`               | Integer                                                                |

**`persona`**

| Field                    | Type                           |
| ------------------------ | ------------------------------ |
| `name` (localized)       | Short Text                     |
| `slug`                   | Short Text                     |
| `role` (localized)       | Short Text                     |
| `painPoints` (localized) | Long Text                      |
| `benefits` (localized)   | Long Text                      |
| `ctaLabel` (localized)   | Short Text                     |
| `ctaUrl`                 | Short Text                     |
| `image`                  | Asset                          |
| `featuredModules`        | References (many, to `module`) |

### P1 Content Models (Composable Sections)

These ship when marketing needs campaign landing pages.

**Reusable Section Blocks** - all can be referenced by `landingPage`:

| Content Type          | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `sectionHero`         | Hero with headline, CTA, stats, image/video               |
| `sectionLogoCloud`    | Trusted-by logos                                          |
| `sectionSteps`        | How-it-works numbered flow                                |
| `sectionFeatureGrid`  | Module/capability grid (3/4/5 columns)                    |
| `sectionTestimonials` | Testimonial carousel or grid                              |
| `sectionFaq`          | FAQ accordion with categories                             |
| `sectionPricing`      | Pricing cards with toggle                                 |
| `sectionCta`          | Call-to-action banner (variants: default, dark, gradient) |
| `sectionTrust`        | Security & compliance items                               |
| `sectionComparison`   | Feature comparison table                                  |
| `sectionRichText`     | Freeform content                                          |
| `sectionForm`         | Embedded form (contact, demo, waitlist, managed-service)  |
| `sectionMedia`        | Video, screenshot, or embed                               |

**`landingPage`** - Composed from section block references

| Field                        | Type                                    |
| ---------------------------- | --------------------------------------- |
| `title` (localized)          | Short Text                              |
| `slug`                       | Short Text                              |
| `sections`                   | References (many, to any section block) |
| `seoTitle` (localized)       | Short Text                              |
| `seoDescription` (localized) | Long Text                               |
| `ogImage`                    | Asset                                   |
| `noIndex`                    | Boolean (default: true for campaigns)   |
| `publishStart`               | Date                                    |
| `publishEnd`                 | Date                                    |
| `campaign`                   | Short Text                              |
| `persona`                    | Short Text                              |

**SectionRenderer** - the core component for composable pages:

```typescript
const SECTION_MAP: Record<string, React.ComponentType<any>> = {
  sectionHero: SectionHero,
  sectionSteps: SectionSteps,
  sectionFeatureGrid: SectionFeatureGrid,
  sectionTestimonials: SectionTestimonials,
  sectionFaq: SectionFaq,
  sectionPricing: SectionPricing,
  sectionCta: SectionCta,
  sectionTrust: SectionTrust,
  sectionComparison: SectionComparison,
  sectionRichText: SectionRichText,
  sectionForm: SectionForm,
  sectionMedia: SectionMedia,
  sectionLogoCloud: SectionLogoCloud,
};

function SectionRenderer({ sections }: { sections: ContentfulEntry[] }) {
  return sections.map((section) => {
    const Component = SECTION_MAP[section.sys.contentType.sys.id];
    if (!Component) {
      // Development: render warning banner
      // Production: skip silently + log to Sentry
      if (process.env.NODE_ENV === 'development') {
        return <div key={section.sys.id}>Unknown section: {section.sys.contentType.sys.id}</div>;
      }
      Sentry.captureMessage(`Unknown section type: ${section.sys.contentType.sys.id}`);
      return null;
    }
    return <Component key={section.sys.id} data={section.fields} />;
  });
}
```

**SectionRenderer contract:**

- Editors can reorder sections in Contentful - render order matches CMS reference order
- Same section type can appear multiple times on a page
- No section-type restrictions per page type (but editorial guidelines documented)

### P2 Content Models

**`blogPost`**

| Field                        | Type                   |
| ---------------------------- | ---------------------- |
| `title` (localized)          | Short Text             |
| `slug`                       | Short Text             |
| `excerpt` (localized)        | Long Text              |
| `body` (localized)           | Rich Text              |
| `author`                     | Reference (teamMember) |
| `category`                   | Short Text             |
| `tags`                       | Short Text (list)      |
| `featuredImage`              | Asset                  |
| `publishedAt`                | Date                   |
| `seoTitle` (localized)       | Short Text             |
| `seoDescription` (localized) | Long Text              |
| `ogImage`                    | Asset                  |
| `noIndex`                    | Boolean                |
| `canonicalUrl`               | Short Text             |

**`caseStudy`**

| Field                        | Type                            |
| ---------------------------- | ------------------------------- |
| `title` (localized)          | Short Text                      |
| `slug`                       | Short Text                      |
| `client`                     | Short Text                      |
| `industry` (localized)       | Short Text                      |
| `challenge` (localized)      | Rich Text                       |
| `solution` (localized)       | Rich Text                       |
| `results`                    | JSON (array of {metric, value}) |
| `testimonial`                | Reference (testimonial)         |
| `image`                      | Asset                           |
| `seoTitle` (localized)       | Short Text                      |
| `seoDescription` (localized) | Long Text                       |

### CMS Validation Rules

- Required alt text on all image assets
- Slug: unique, lowercase, hyphenated, max 60 chars
- SEO title: max 60 chars
- SEO description: max 160 chars
- URLs: must be valid format
- Pricing plan order: unique integers

### Editorial Constraints

| Section                | Constraint                                           |
| ---------------------- | ---------------------------------------------------- |
| Homepage hero          | Exactly 1                                            |
| Steps (How It Works)   | 3-5 steps                                            |
| Pricing plans          | 2-4 plans                                            |
| Testimonials           | Min 4 to render on homepage; min 2 for landing pages |
| Logo cloud             | Min 3 approved logos to render                       |
| FAQ                    | Min 3 items                                          |
| Campaign landing pages | Default `noIndex: true`                              |

### Local Development & Mock Data Strategy

Development must work fully offline without Contentful access. Mock JSON files serve dual purpose: local development data **and** the source for initial Contentful population.

**Pattern** (proven in ScaleupLabs):

#### 1. Mock Data Files

```
content/
├── mock/
│   ├── site-settings.json        # siteSettings singleton
│   ├── announcement-bar.json     # announcementBar singleton
│   ├── testimonials.json         # Array of testimonial entries
│   ├── team-members.json         # Array of teamMember entries
│   ├── faq-items.json            # Array of faqItem entries
│   ├── pricing-plans.json        # Array of pricingPlan entries
│   ├── modules.json              # Array of module entries
│   ├── personas.json             # Array of persona entries
│   └── README.md                 # Schema docs for content editors
```

Each JSON file mirrors the Contentful content model structure with localized fields:

```json
// content/mock/testimonials.json
[
  {
    "name": "David Cohen",
    "role": { "he-IL": "מנהל פרויקטים", "en-US": "Project Manager" },
    "company": "BuildTech Ltd",
    "quote": {
      "he-IL": "הפלטפורמה חסכה לנו שבועות של עבודה...",
      "en-US": "The platform saved us weeks of work..."
    },
    "rating": 5,
    "featured": true,
    "image": "/content/mock/images/david-cohen.jpg"
  }
]
```

```json
// content/mock/site-settings.json
{
  "phase": "coming-soon",
  "showPricing": false,
  "showSignup": false,
  "showLogin": false,
  "showBlog": false,
  "showTestimonials": false,
  "showCaseStudies": false,
  "showRoiCalculator": false,
  "ctaType": "schedule-meeting",
  "maintenanceMode": false
}
```

#### 2. Contentful Client with Automatic Fallback

```typescript
// lib/contentful/client.ts
import { createClient } from 'contentful';

const isContentfulConfigured = !!(
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
);

let client: ReturnType<typeof createClient> | null = null;

if (isContentfulConfigured) {
  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  });
}

export { client, isContentfulConfigured };
```

#### 3. Query Functions with Mock Fallback

```typescript
// lib/contentful/queries.ts
import { client, isContentfulConfigured } from './client';
import mockTestimonials from '@/content/mock/testimonials.json';

export async function getTestimonials(locale: string): Promise<Testimonial[]> {
  if (!isContentfulConfigured) {
    // Return mock data, selecting the correct locale
    return mockTestimonials.map((t) => transformMockEntry(t, locale));
  }

  try {
    const contentfulLocale = locale === 'he' ? 'he-IL' : 'en-US';
    const response = await client!.getEntries<TestimonialSkeleton>({
      content_type: 'testimonial',
      locale: contentfulLocale,
    });
    return response.items.map(transformTestimonial);
  } catch (error) {
    console.warn('Contentful fetch failed, using mock data:', error);
    Sentry.captureException(error);
    return mockTestimonials.map((t) => transformMockEntry(t, locale));
  }
}
```

#### 4. Locale Handling in Mock Data

Mock JSON files store all locales inline. The query helper extracts the correct locale:

```typescript
function transformMockEntry<T extends Record<string, any>>(
  entry: T,
  locale: string,
): Record<string, any> {
  const contentfulLocale = locale === 'he' ? 'he-IL' : 'en-US';
  const fallbackLocale = 'en-US';

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(entry)) {
    if (
      value &&
      typeof value === 'object' &&
      (contentfulLocale in value || fallbackLocale in value)
    ) {
      result[key] = value[contentfulLocale] ?? value[fallbackLocale];
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

#### 5. Development Workflow

```
1. Developer clones repo
2. No .env needed — mock data works out of the box
3. `pnpm dev` serves the site with mock content
4. Content changes are made in JSON files, hot-reloaded
5. When Contentful is configured (env vars set), it takes priority
6. If Contentful fetch fails, mock data is the fallback
```

#### 6. Contentful Population (One-Time Migration)

A migration script reads mock JSON files and creates Contentful entries via the Management API. The CMA token is provided at migration time only, never committed:

```typescript
// scripts/populate-contentful.ts
// Run: CONTENTFUL_CMA_TOKEN=xxx pnpm run populate-contentful

import { createClient } from 'contentful-management';
import testimonials from '../content/mock/testimonials.json';
// ... import other mock files

async function migrate() {
  const client = createClient({ accessToken: process.env.CONTENTFUL_CMA_TOKEN! });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment('master');

  for (const testimonial of testimonials) {
    await env.createEntry('testimonial', {
      fields: {
        name: { 'en-US': testimonial.name },
        role: testimonial.role, // Already in { 'he-IL': ..., 'en-US': ... } format
        company: { 'en-US': testimonial.company },
        quote: testimonial.quote,
        rating: { 'en-US': testimonial.rating },
        featured: { 'en-US': testimonial.featured },
      },
    });
  }
  // ... repeat for other content types
}
```

**Important**: The CMA (Content Management API) token is never stored in the repo or `.env`. It is provided as a runtime argument only during migration.

### Schema Evolution Policy

- Content models are versioned in this spec and in code
- Breaking schema changes require a migration plan
- No ad-hoc field deletions in the production Contentful environment
- New fields should have sensible defaults or be optional

---

## 9. Localization Strategy

### URL Structure

Route-based locales for SEO (not UI-toggle only):

```
geometrixlabs.com/he/           -> Hebrew homepage
geometrixlabs.com/en/           -> English homepage
geometrixlabs.com/he/blog/xxx   -> Hebrew blog post
geometrixlabs.com/en/blog/xxx   -> English blog post
```

**Default locale**: Hebrew (`he`) - primary market is Israel
**Fallback**: If Hebrew content is missing, fall back to English

### Root URL Handling (Middleware)

When a user visits `geometrixlabs.com/` (no locale prefix), redirect to the appropriate locale:

```typescript
// middleware.ts
const LOCALES = ['he', 'en'];
const SKIP_PATHS = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API routes, static files, and asset paths
  if (SKIP_PATHS.some((p) => pathname.startsWith(p)) || pathname.includes('.')) return;

  // Skip if already has locale prefix
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return;

  // Check cookie first (returning visitor)
  const savedLocale = request.cookies.get('locale')?.value;
  if (savedLocale && LOCALES.includes(savedLocale)) {
    const url = new URL(`/${savedLocale}${pathname}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(url);
  }

  // Detect from Accept-Language, default to Hebrew (primary market)
  const acceptLang = request.headers.get('accept-language') || '';
  const locale = acceptLang.includes('he') ? 'he' : acceptLang.includes('en') ? 'en' : 'he';

  const url = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
```

**Important**: Root URL must NOT serve content directly - always redirect. Query strings are preserved across redirects. This avoids duplicate content.

### RTL/LTR Handling

| Concern                | Specification                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Document direction** | `<html dir="rtl" lang="he">` set by server component in `[locale]/layout.tsx` |
| **CSS approach**       | Tailwind logical properties (`ps-4` not `pl-4`, `ms-auto` not `ml-auto`)      |
| **Layout mirroring**   | Navigation, directional icons, form layouts flip automatically                |
| **Numbers & dates**    | Always LTR even in RTL context (`direction: ltr` on numeric displays)         |
| **Mixed content**      | Automatic via Unicode BiDi                                                    |
| **Testing**            | Visual regression tests in both directions                                    |

### Production Translation Policy

- Pages should only be indexable in a locale when that locale has approved translation quality
- Locale fallback (he-IL -> en-US) is allowed for editorial preview and internal resilience
- Fallback-rendered production pages default to `noindex` unless explicitly approved
- This means: if a blog post exists only in English, `/he/blog/that-post` should either not exist or be `noindex` until Hebrew translation is approved

---

## 10. External Service Integrations

### 10.1 Meeting Scheduling (Cal.com)

**Implementation**:

- **P0**: Link button to `https://cal.com/geometrix` in CTA sections
- **P1**: Embedded Cal.com widget on `/schedule` route (lazy-loaded via dynamic import)
- **P2+**: Inline calendar on contact page

**Loading strategy**: Cal.com embed SDK loaded only on `/schedule` route via `next/dynamic` to avoid impacting other pages.

### 10.2 Email (Resend via API Routes)

**Why Resend over FormSubmit.co**: FormSubmit.co is a free service with no SLA. Dropped submissions mean lost revenue. Resend provides reliable delivery, templated emails, and delivery tracking.

**Implementation**: Next.js API route (`/api/contact`) -> Resend API

**Contact Form**:

- Fields: Name, Email, Company, Phone (optional), Message, consent checkbox
- Client-side validation: React Hook Form + Zod
- Server-side validation: Zod schema in API route
- Spam prevention: honeypot field + time-to-submit check (reject < 2s)
- Success: redirect to `/thank-you` with tracking event
- Failure: show inline error + log to Sentry + mailto fallback

### 10.3 Analytics (PostHog)

**Loading strategy**: Load only after analytics consent is granted. Use `posthog-js` package with consent-aware initialization. Do not initialize before consent.

### 10.4 Error Monitoring (Sentry)

**Integration**: Via `@sentry/nextjs` SDK (not manual script loading):

- Wire into `instrumentation.ts`
- Capture Contentful fetch failures, form submission failures, component errors
- Upload source maps during build

### 10.5 Video Hosting

Contentful has limited file size for video. Strategy:

| Use Case                           | Solution                                      |
| ---------------------------------- | --------------------------------------------- |
| Hero background loop (5-10s muted) | Optimized MP4/WebM in `/public` or Cloudinary |
| Product demo                       | YouTube embed (lazy-loaded)                   |
| Future premium video               | Evaluate Mux                                  |

Video component must: respect `prefers-reduced-motion`, show poster image on mobile, never autoplay with sound.

### 10.6 Third-Party Script Loading Strategy

| Script                    | Loading Strategy                                          |
| ------------------------- | --------------------------------------------------------- |
| **PostHog**               | Load after consent, initialize on idle                    |
| **Cal.com embed**         | Dynamic import only on `/schedule` route                  |
| **Sentry**                | `@sentry/nextjs` SDK, initialized in `instrumentation.ts` |
| **Google Search Console** | Verification meta tag only                                |

Preconnect to known origins:

```html
<link rel="preconnect" href="https://cdn.contentful.com" />
<link rel="preconnect" href="https://images.ctfassets.net" />
```

---

## 11. Page & Routing Strategy

### Route Structure

| Route                                   | Page                  | Milestone | Rendering |
| --------------------------------------- | --------------------- | --------- | --------- |
| `/[locale]`                             | Homepage              | P0        | SSG + ISR |
| `/[locale]/contact`                     | Contact form + info   | P0        | SSG       |
| `/[locale]/schedule`                    | Cal.com scheduling    | P0        | SSG       |
| `/[locale]/thank-you`                   | Form confirmation     | P0        | SSG       |
| `/[locale]/privacy`                     | Privacy Policy        | P0        | SSG       |
| `/[locale]/terms`                       | Terms of Service      | P0        | SSG       |
| `/[locale]/cookie-policy`               | Cookie Policy         | P0        | SSG       |
| `/[locale]/about`                       | Company / team        | P1        | SSG + ISR |
| `/[locale]/security`                    | Security & trust      | P1        | SSG       |
| `/[locale]/solutions/[slug]`            | Persona pages         | P1        | SSG + ISR |
| `/[locale]/modules`                     | Module directory      | P1        | SSG + ISR |
| `/[locale]/lp/[slug]`                   | Dynamic landing pages | P1        | SSG + ISR |
| `/[locale]/pricing`                     | Dedicated pricing     | P1        | SSG + ISR |
| `/[locale]/blog`                        | Blog listing          | P2        | SSG + ISR |
| `/[locale]/blog/[slug]`                 | Blog post             | P2        | SSG + ISR |
| `/[locale]/case-studies`                | Case study listing    | P2        | SSG + ISR |
| `/[locale]/case-studies/[slug]`         | Case study detail     | P2        | SSG + ISR |
| `/[locale]/compare/manual-vs-geometrix` | Comparison            | P2        | SSG       |
| `*`                                     | 404 Not Found         | P0        | Static    |

### Redirect Strategy (SPA -> Multi-Page Migration)

**Server-side redirects** (`next.config.js`) for path-based routes:

```typescript
async redirects() {
  return [
    // Root -> default locale (handled by middleware, but belt-and-suspenders)
    { source: '/', destination: '/he', permanent: false },
  ];
}
```

**Client-side hash handling**: URL fragments (`#pricing`, `#faq`) are never sent to the server, so `next.config.js` redirects cannot catch them. To support legacy SPA anchor bookmarks, add client-side hash mapping on the homepage:

```typescript
// In homepage client component or layout effect
useEffect(() => {
  const hash = window.location.hash;
  const hashMap: Record<string, string> = {
    '#pricing': '/he/pricing',
    '#contact': '/he/contact',
    '#team': '/he/about',
  };
  if (hashMap[hash]) {
    router.replace(hashMap[hash]);
  } else if (hash) {
    // For valid in-page anchors (#faq, #modules), scroll to element
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }
}, []);
```

All internal links should be updated to route-based navigation immediately. The hash handler is a transitional fallback.

**Ongoing redirect policy:**

- Expired campaign pages: 301 to homepage or relevant evergreen page
- Renamed slugs: 301 from old to new
- Deleted blog posts: 301 to blog index or 410 Gone
- Bare paths without locale: middleware redirects to locale-prefixed URL

### Landing Pages Strategy (P1)

The `/[locale]/lp/[slug]` route enables marketing to create unlimited pages via Contentful:

- Fully composed from reusable section blocks via `SectionRenderer`
- Campaign pages `noIndex` by default unless SEO-approved
- Lifecycle: each has owner, launch date, end date; archived/redirected when campaign ends

### Domain Strategy

```
geometrixlabs.com/             -> Marketing site (redirects to /he)
geometrixlabs.com/he/          -> Hebrew content
geometrixlabs.com/en/          -> English content
app.geometrixlabs.com/         -> Product (separate deployment)
```

---

## 12. Launch Phases

### Phase 1: Coming Soon (P0)

**Goal**: Establish brand presence, capture leads, enable meeting booking.

**What's Visible**:

- Announcement bar
- Header (no login/signup links)
- Hero (CTA: "Schedule a Demo") with product screenshots
- How It Works
- Use Cases (personas)
- Modules grid
- Team section
- FAQ
- Contact form
- Cal.com scheduling link
- Footer with real links
- Legal pages

**What's Hidden** (via `siteSettings`):

- Pricing, Signup/Login CTAs, Blog, Case Studies, ROI Calculator, Testimonials (until real)

### Phase 2: Pre-Launch

**Additional**: Testimonials, Blog, Case Studies, Pricing with "Coming Soon" badges

### Phase 3: Live (Production)

**Full site**: Login/Signup, working pricing, trial CTA, ROI Calculator, paid campaign landing pages

---

## 13. Section-by-Section Spec

### Recommended Homepage Section Order

1. Announcement bar
2. Header
3. Hero (with product visual)
4. Trust bar / logos / proof metrics
5. How it works
6. Product screenshots / demo
7. Persona / solution tabs
8. Modules / capabilities
9. Security & trust
10. Testimonials / case studies
11. Pricing
12. FAQ
13. Final CTA
14. Footer

### Section Specifications

**Announcement Bar**: Sticky, dismissible (localStorage), CMS-driven, color variants.

**Header**: Phase-aware CTAs, mobile slide-in menu, language switcher links to alternate locale URL, sticky with glass-morphism.

**Hero**: Product screenshot/video (not stock photo). Video: muted loop on desktop, static image on mobile, respects `prefers-reduced-motion`. All content CMS-driven. Stats counter animation on first view (disabled for reduced motion).

**How It Works**: 4 steps (Upload DXF -> Select modules -> Review quantities -> Export BOQ). Horizontal on desktop, vertical on mobile.

**Use Cases**: 4 persona tabs, CMS-driven via `persona`. "Learn More" links to `/solutions/[slug]`.

**Modules Grid**: CMS-driven, grouped by category, expandable details.

**Pricing**: CMS-driven, monthly/yearly toggle, "Most Popular" badge, phase-gated.

**Testimonials**: Min 4 real testimonials to render. Carousel with auto-rotation, pause on hover/focus, keyboard navigable, `aria-live`.

**Team**: CMS-driven, real photos mandatory, real LinkedIn links.

**FAQ**: CMS-driven, 8-12 questions, category tabs, FAQ structured data (JSON-LD).

**Contact Section**: Full form (Name, Email, Company, Phone, Message, consent). Resend API route. Cal.com button alongside. "We'll respond within 24 hours."

**Security & Trust**: Encryption, data residency, RBAC, audit trails, uptime targets. **Do not claim SOC 2 unless achieved.**

**Footer**: Real social links, organized groups (Product, Company, Resources, Legal), newsletter signup (P2), language switcher, CMS-driven.

**404 Page**: Clear "page not found" message (localized), links to homepage and popular pages, contact link, `404_viewed` analytics event with attempted URL.

### Animation & Motion Design

| Animation                | Specification                                                        |
| ------------------------ | -------------------------------------------------------------------- |
| **Section entrance**     | Fade-up on scroll (IntersectionObserver), 200ms ease-out             |
| **Hover states**         | Cards: subtle lift + shadow. Buttons: darken. Links: underline slide |
| **Testimonial carousel** | Smooth slide, 5s interval, pause on hover/focus                      |
| **Counter animation**    | Stats count up on first view                                         |
| **Reduced motion**       | ALL animations disabled when `prefers-reduced-motion: reduce`        |

---

## 14. Design System

### Design Principles

- **Product-first**: Show the actual product, not stock photos
- **Clear proof before CTA repetition**: Earn trust, then ask for action
- **Minimal cognitive load**: One idea per section
- **Hebrew-first clarity**: Primary market gets primary design attention, with equal English quality
- **Mobile-first, desktop-polished**
- **Enterprise trust without corporate bloat**
- **Motion supports comprehension, not decoration**
- **Every section answers one buyer question**

### Design Tokens

```
Colors:
  primary:       emerald-600 (#059669)   — CTAs, active states, links
  primary-hover: emerald-700 (#047857)
  primary-light: emerald-50 (#ecfdf5)    — backgrounds, badges
  neutral:       slate-900 (#0f172a)     — headings
  body:          slate-600 (#475569)     — body text
  muted:         slate-400 (#94a3b8)     — secondary text
  surface:       white                    — card backgrounds
  background:    slate-50 (#f8fafc)      — page background
  error:         red-500 (#ef4444)
  warning:       amber-500 (#f59e0b)
  success:       emerald-500 (#10b981)

Typography:
  font-family: 'Rubik', system-ui, sans-serif
  h1:    text-4xl md:text-6xl font-bold tracking-tight     — one per page
  h2:    text-3xl md:text-4xl font-bold                    — section headings
  h3:    text-xl md:text-2xl font-semibold                 — subsection headings
  body:  text-base md:text-lg leading-relaxed text-slate-600
  small: text-sm text-slate-500

Spacing:
  section-padding: py-20 md:py-28
  container:       max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  card-padding:    p-6 md:p-8
  stack-gap:       space-y-4 (content), space-y-8 (sections)

Components:
  card:       rounded-2xl border border-slate-200 bg-white shadow-sm
  button-lg:  rounded-lg px-8 py-4 text-lg font-semibold
  button-sm:  rounded-lg px-4 py-2 text-sm font-medium
  badge:      rounded-full px-3 py-1 text-xs font-medium
  input:      rounded-lg border border-slate-300 px-4 py-3

Shadows:
  card:        shadow-sm
  card-hover:  shadow-md
  dropdown:    shadow-lg
```

### Content Style Guide (Reference)

- **Tone**: Professional but accessible, not academic
- **Voice**: First person plural ("we"), address reader as "you"
- **Hebrew terminology**: Use industry-standard terms; technical terms (DXF, CAD, BOQ) stay in English
- **Numbers**: Use digits (85%, not "eighty-five percent")
- **CTAs**: Action-oriented, benefit-focused ("Start saving time" not "Submit")
- **Headlines**: Max 8 words, lead with outcome
- **Blog**: 800-1500 words, scannable with subheadings every 200-300 words
- **Case study**: Challenge -> Solution -> Results structure
- **Alt text**: Descriptive, max 125 characters

---

## 15. SEO Strategy

### Technical SEO

| Item                | Implementation                                                                      |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Meta tags**       | Server-rendered per page via Next.js `generateMetadata`                             |
| **Open Graph**      | og:title, og:description, og:image - server-rendered                                |
| **Twitter Card**    | twitter:card, twitter:title, twitter:description, twitter:image                     |
| **hreflang**        | `<link rel="alternate" hreflang="he" href="..." />` + `x-default` pointing to `/he` |
| **Canonical**       | Self-referencing canonical on every page                                            |
| **Structured Data** | JSON-LD: Organization, SoftwareApplication, FAQPage, BreadcrumbList, BlogPosting    |
| **Sitemap**         | Dynamic `sitemap.xml` via Next.js (fetches CMS slugs)                               |
| **Robots.txt**      | Proper crawl directives, reference sitemap                                          |
| **Favicon**         | Full set (favicon.ico, apple-touch-icon, manifest.json)                             |
| **Trailing slash**  | Consistent: no trailing slash                                                       |
| **noindex**         | `/thank-you`, campaign landing pages (default), preview pages                       |

### Multilingual Canonical Rules

- Every localized page gets a self-referencing canonical
- Alternate locale pages linked via `hreflang`
- `x-default` points to `/he` (primary market)
- If a page uses fallback content (English shown as Hebrew), it should be `noindex` until properly translated
- Separate editorial fallback (for preview) from indexing policy (for production)

### OG Image Strategy

- **P0**: Static fallback OG image for homepage and all pages without a custom `ogImage`
- **P1**: Landing pages and solution pages use Contentful `ogImage` field when provided
- **P2**: Dynamic OG image generation via `@vercel/og` (`opengraph-image.tsx`) for blog posts and landing pages - renders title + branding automatically, eliminating manual OG image creation per content entry

### Sitemap Strategy

The sitemap should only include URLs that are indexable. If a page is `noindex` (e.g., fallback-rendered locale without approved translation), exclude it from the sitemap. In P0, the simpler approach is acceptable: include all locale URLs and rely on `noindex` meta tags as the authority. Google respects `noindex` over sitemap inclusion.

| Source                 | Routes                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| **Static**             | `/`, `/contact`, `/schedule`, `/privacy`, `/terms`, `/cookie-policy`  |
| **CMS: Blog**          | Fetch published slugs -> `/blog/{slug}` (both locales)                |
| **CMS: Case Studies**  | Fetch published slugs -> `/case-studies/{slug}` (both locales)        |
| **CMS: Landing Pages** | Fetch published, `noIndex=false` slugs -> `/lp/{slug}` (both locales) |
| **CMS: Solutions**     | Fetch published persona slugs -> `/solutions/{slug}` (both locales)   |

### Keyword Strategy (initial clusters)

**English**: quantity surveying software, bill of quantities software, construction estimation software, DXF quantity takeoff, contractor bill verification

**Hebrew**: תוכנת חשב כמויות, כתב כמויות אוטומטי, תוכנה לחישוב כמויות בנייה, חישוב כמויות מ-DXF

### Structured Data Schemas

```json
// SoftwareApplication (every page)
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Geometrix",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "199",
    "highPrice": "999",
    "priceCurrency": "ILS"
  }
}

// FAQPage, BreadcrumbList, BlogPosting as applicable
```

---

## 16. Analytics, Attribution & Experimentation

### Analytics Architecture

| Tool                      | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| **PostHog**               | Website analytics, session recordings, feature flags |
| **Google Search Console** | Search performance, indexing, crawl errors           |
| **Vercel Analytics**      | Core Web Vitals real-user monitoring                 |
| **Sentry**                | Error tracking                                       |

### Identity Strategy

- Marketing site: **anonymous only**. Do not call `posthog.identify()` on the marketing site.
- After form submission: do **not** send raw email to PostHog. Instead, attach a hashed lead ID or internal reference for attribution. Raw PII stays in the email/CRM system, not analytics.
- Product app: handles full identification separately.

### Consent Mode Behavior

Before consent is granted:

- No PostHog initialization
- No analytics cookies
- No session recording
- Strictly necessary cookies only

### Event Taxonomy

All events use `snake_case`. Every CTA event includes standard properties:

```typescript
interface EventProperties {
  cta_type: string;
  cta_location: string; // hero, nav, footer, inline
  page_type: string; // homepage, blog, landing_page
  page_slug: string;
  language: 'he' | 'en';
  phase: string;
  campaign?: string;
  persona?: string;
}
```

**Events:**

```
page_viewed { page_type, page_slug, language }
cta_clicked { cta_type, cta_location, ... }
section_viewed { section }
language_changed { from, to }
faq_expanded { question_id, category }
pricing_plan_selected { plan, billing_period }
contact_form_started
contact_form_submitted { form_type }
contact_form_failed { error }
schedule_meeting_clicked
blog_post_viewed { slug, category }
landing_page_viewed { slug, campaign }
404_viewed { attempted_url }
```

### UTM Attribution

- Capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` on first visit
- Store in cookie with `first_touch_timestamp`
- Include in all form submissions
- Forward to PostHog as user properties

### Cross-Domain Attribution

Marketing site (`geometrixlabs.com`) -> Product app (`app.geometrixlabs.com`):

- Signup/trial CTA links must forward UTM and attribution parameters as query strings
- First-touch attribution persists across the transition
- Marketing and product analytics do NOT share identity - attribution is passed via URL params, not shared cookies
- Product app is responsible for ingesting attribution params on signup

### Funnel Definitions

| Funnel           | Steps                                                      |
| ---------------- | ---------------------------------------------------------- |
| **Demo booking** | Homepage -> CTA clicked -> Schedule page -> Meeting booked |
| **Contact**      | Page -> Form started -> Form submitted -> Thank you        |
| **Blog to lead** | Blog post -> CTA clicked -> Form submitted                 |
| **Landing page** | LP viewed -> CTA clicked -> Form/schedule                  |

### Experimentation Framework (P2)

- PostHog feature flags for A/B testing
- Max 1-2 homepage experiments simultaneously
- Each requires: hypothesis, primary metric, guardrail metrics, minimum sample size
- Rollout/rollback via PostHog dashboard

---

## 17. Lead Capture & CRM

### P0: Basic Lead Capture

- Contact form -> Resend API route -> team email
- Cal.com meeting bookings
- PostHog event tracking
- UTM capture on all forms

### Lead Routing Rules

| Form Type                 | Destination             | SLA              | Auto-Reply         |
| ------------------------- | ----------------------- | ---------------- | ------------------ |
| Contact / General inquiry | hello@geometrixlabs.com | 1 business day   | Yes                |
| Schedule demo             | sales@geometrixlabs.com | 4 business hours | Yes                |
| Managed service request   | sales@ + ops@           | 1 business day   | Yes                |
| Newsletter (P2)           | marketing@              | n/a              | Confirmation email |

### Form Types

Purpose-specific forms (not just "contact us"):

- Schedule demo (primary Phase 1 CTA)
- Request early access / join waitlist
- Contact sales
- Request managed service quote
- Download resource (P2)

Each maps to a specific lead intent and (future) CRM pipeline.

### Lead Data Fields (on all forms)

- utm_source, utm_medium, utm_campaign, utm_term, utm_content
- referrer, landing_page, first_touch_timestamp
- language, persona_interest
- company, role (where collected)
- consent flags

### P2+ CRM Integration Roadmap

Add CRM (HubSpot or Pipedrive):

- Sync form submissions automatically
- Sync Cal.com bookings
- Enrich leads with source, campaign, landing page, language, persona
- Lifecycle stages: visitor -> lead -> MQL -> SQL -> booked demo -> trial -> customer

---

## 18. Performance Budgets & Image Optimization

### Performance Budgets

Separate targets from hard-fail thresholds to give engineering room while enforcing quality:

| Metric                       | Target             | Fail Threshold |
| ---------------------------- | ------------------ | -------------- |
| **LCP**                      | < 2.5s (75th pctl) | > 3.0s         |
| **CLS**                      | < 0.1              | > 0.15         |
| **INP**                      | < 200ms            | > 300ms        |
| **TTFB**                     | < 600ms            | > 1.0s         |
| **JS bundle (initial)**      | < 150KB gzip       | > 220KB gzip   |
| **CSS**                      | < 30KB gzip        | > 50KB gzip    |
| **Hero image (LCP)**         | < 200KB            | > 350KB        |
| **Lighthouse Perf (mobile)** | > 95               | < 85           |
| **Lighthouse A11y**          | > 95               | < 85           |
| **Lighthouse SEO**           | > 95               | < 85           |

CI gates block merge at **fail threshold**. Warnings issued at **target** misses.

### CI Enforcement

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

### Image Optimization

| Concern          | Solution                                                  |
| ---------------- | --------------------------------------------------------- |
| **Format**       | WebP primary, AVIF where supported, via Next.js `<Image>` |
| **Responsive**   | `srcSet` (640, 1024, 1920)                                |
| **Lazy loading** | `loading="lazy"` below fold                               |
| **LCP image**    | `priority={true}` + `fetchpriority="high"` for hero       |
| **CMS images**   | Contentful Images API: `?w=800&fm=webp&q=80`              |
| **Aspect ratio** | Always specify `width`/`height` to prevent CLS            |
| **Placeholder**  | Blur-up via low-quality Contentful transform              |

### Reusable `ContentfulImage` Component

```typescript
function ContentfulImage({ asset, width, sizes, priority = false }) {
  const baseUrl = asset.fields.file.url;
  return (
    <Image
      src={`https:${baseUrl}?w=${width}&fm=webp&q=80`}
      width={asset.fields.file.details.image.width}
      height={asset.fields.file.details.image.height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={`https:${baseUrl}?w=20&fm=webp&q=10`}
      alt={asset.fields.description || asset.fields.title || ''}
    />
  );
}
```

### Monitoring

- **Vercel Analytics**: Real-user Core Web Vitals
- **Lighthouse CI**: Synthetic checks on every PR
- **Alerts**: Regression alerts when metrics cross fail threshold

### Perceived Performance & Speed Strategy

This is a public marketing site with no authentication and no backend. It must be **fast** - not just meet budgets, but _feel_ instant. The following techniques (drawn from the Geometrix platform's performance playbook) are adapted for the marketing site:

#### Server-Side Rendering Eliminates the Biggest Bottleneck

The move from Vite SPA to Next.js SSG/ISR eliminates the 3-hop waterfall that plagues SPAs:

```
SPA:    Download JS → Execute → Fetch Contentful → Render  (1.5-3s)
SSG:    Serve pre-rendered HTML from CDN                     (<200ms TTFB)
```

With SSG + ISR, HTML is pre-built at deploy time and served from Vercel's Edge CDN. There is no JavaScript execution or API call before the user sees content. This is the single biggest performance win.

#### Resource Loading Priorities

| Resource                | Strategy                                               | Why                                            |
| ----------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| **Hero image (LCP)**    | `priority={true}` + `<link rel="preload">` in `<head>` | Must be the first large resource loaded        |
| **Above-fold CSS**      | Inlined by Next.js automatically for SSG               | No render-blocking stylesheet fetch            |
| **Fonts (Rubik)**       | `next/font` with `display: swap` + self-hosted subset  | Eliminates Google Fonts render blocking + FOIT |
| **Below-fold images**   | `loading="lazy"` + Contentful `?w=X&fm=webp&q=80`      | Don't load what's not visible                  |
| **PostHog**             | Load after consent, on idle                            | Never blocks initial render                    |
| **Cal.com embed**       | Dynamic import only on `/schedule`                     | Zero impact on other pages                     |
| **Sentry**              | Initialized in `instrumentation.ts`                    | No client bundle impact for SSR pages          |
| **Motion (animations)** | Tree-shake, only import used components                | Keep animation JS minimal                      |

#### Font Optimization

```typescript
// app/layout.tsx - Self-host via next/font to avoid Google Fonts latency
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin', 'hebrew'],
  display: 'swap',
  variable: '--font-rubik',
});
```

This eliminates:

- DNS lookup to `fonts.googleapis.com`
- CSS fetch from `fonts.googleapis.com`
- Font file fetch from `fonts.gstatic.com`
- Flash of invisible text (FOIT)

#### Preconnect to Critical Origins

```html
<link rel="preconnect" href="https://images.ctfassets.net" />
<link rel="dns-prefetch" href="https://cdn.contentful.com" />
```

Only preconnect to origins that will be used on the current page. Don't preconnect to PostHog or Cal.com on every page.

#### Bundle Size Discipline

Since this is a marketing site (not an app), the JS bundle should be minimal:

| Concern                                | Strategy                                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Server components by default**       | Most sections are server components - zero client JS                                               |
| **Client components only when needed** | Accordion, carousel, mobile menu, cookie consent, contact form                                     |
| **Tree-shaking**                       | Import only used Lucide icons: `import { ArrowRight } from 'lucide-react'` not `import * as icons` |
| **No unnecessary client-side state**   | No Zustand, no Redux - data comes from server                                                      |
| **Motion**                             | Import individual components, not the entire library                                               |
| **Contentful SDK**                     | Server-side only - never shipped to client bundle                                                  |

Expected client JS breakdown:

```
React runtime:           ~45KB gzip
Motion (used components): ~15KB gzip
Cookie consent:           ~4KB gzip
PostHog (after consent):  ~25KB gzip (loaded async, not in initial bundle)
Form + validation:        ~15KB gzip (only on /contact page)
Total initial:            ~80KB gzip (well under 150KB budget)
```

#### Perceived Performance Techniques

| Technique                              | Implementation                                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Instant navigation**                 | Next.js `<Link>` prefetches routes on hover/viewport - clicks feel instant                                                                                                    |
| **Page-specific skeletons**            | `loading.tsx` per route with layout-matching skeletons (not generic spinners)                                                                                                 |
| **Staggered fade-in**                  | Sections animate in sequence: header 0ms, hero 50ms, content 100ms, secondary 200ms. Keep animations subtle (0.3s max, 8px translate). Disabled for `prefers-reduced-motion`. |
| **Optimistic image loading**           | Blur-up placeholder from Contentful while full image loads - no layout shift                                                                                                  |
| **Instant locale switch**              | Both locale pages are prerendered - switching feels like a same-page navigation                                                                                               |
| **No spinners on homepage**            | SSG means content is in the HTML - no loading states for initial page load                                                                                                    |
| **saveData / slow connection respect** | Check `navigator.connection.saveData` and `effectiveType` - skip non-essential images and animations on slow connections                                                      |

#### Anti-Patterns to Avoid

| Anti-Pattern                                   | Why                                   | Do Instead                                                                     |
| ---------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| Fetch Contentful client-side                   | Adds waterfall, exposes token, slower | Server components fetch at build/request time                                  |
| Global heavy middleware                        | Adds latency to every request         | Middleware should be lightweight (locale check only)                           |
| Load all third-party scripts eagerly           | Blocks rendering, tanks Lighthouse    | Load after consent, on idle, or on route                                       |
| Unoptimized hero video                         | Can be 5-20MB, kills LCP              | Short loop (<10s), compressed MP4/WebM, poster image, `prefers-reduced-motion` |
| Import entire icon library                     | Adds ~100KB+ to bundle                | Named imports only                                                             |
| Client-side CMS fetching with loading spinners | Perceived as slow, bad for SEO        | SSG/ISR - content is in the HTML                                               |

#### Speed Checklist (Validate Before Launch)

- [ ] TTFB < 200ms on homepage (Vercel Edge CDN)
- [ ] LCP < 1.5s on homepage (target, not just budget)
- [ ] No client-side Contentful fetches on any page
- [ ] Fonts self-hosted via `next/font`, no external font requests
- [ ] Hero image preloaded, optimized WebP, < 200KB
- [ ] PostHog loads only after consent, never blocks render
- [ ] All images have explicit width/height (no CLS)
- [ ] Bundle analyzer shows < 100KB initial client JS
- [ ] `loading.tsx` provides layout-matching skeleton for ISR pages
- [ ] No console warnings about large bundles or unused imports
- [ ] Lighthouse Performance > 95 on mobile (3G throttled)

---

## 19. Accessibility

### Requirements (WCAG 2.1 AA)

| Component             | Requirement                                                       |
| --------------------- | ----------------------------------------------------------------- |
| **Focus management**  | Visible focus rings, logical tab order                            |
| **Skip navigation**   | "Skip to content" as first focusable element                      |
| **Heading hierarchy** | Single `<h1>` per page, sequential levels                         |
| **Color contrast**    | 4.5:1 normal text, 3:1 large text - verify emerald/white          |
| **Motion**            | Respect `prefers-reduced-motion`                                  |
| **Screen reader**     | Meaningful alt text; decorative images `alt=""`                   |
| **Forms**             | Labels via `htmlFor`, errors via `aria-describedby`, live regions |
| **Accordion (FAQ)**   | `aria-expanded`, `aria-controls`, keyboard Enter/Space            |
| **Carousel**          | Pause button, keyboard nav, `aria-live="polite"`                  |
| **Language**          | `lang` on `<html>`, inline `lang` for alternate language text     |
| **Landmarks**         | `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`            |
| **Touch targets**     | Min 44x44px on mobile                                             |
| **Phone CTA**         | `<a href="tel:+972-XX-XXXX">` visible on mobile                   |

### QA Process

| Method              | Scope                                      |
| ------------------- | ------------------------------------------ |
| **Automated (CI)**  | axe-core via Playwright, Lighthouse audit  |
| **Manual keyboard** | Tab through all pages                      |
| **Screen reader**   | VoiceOver smoke test on key flows          |
| **Mobile**          | Zoom 200%, touch targets, iPhone + Android |
| **RTL**             | Screen reader validation in Hebrew         |

---

## 20. Security & Compliance

### External Trust Content (what appears on the site)

| Claim                       | Status                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Encryption in transit (TLS) | Yes - enforced by Vercel                                                                                               |
| Encryption at rest          | Yes - Supabase PostgreSQL (specify actual region)                                                                      |
| Authentication              | Supabase Auth + JWT                                                                                                    |
| Role-based access control   | Yes                                                                                                                    |
| Audit trails                | Yes                                                                                                                    |
| Data hosting                | Document per subsystem: website (Vercel, global CDN), app (Supabase, [region]), analytics (PostHog EU), email (Resend) |
| Uptime target               | State actual SLA                                                                                                       |
| SOC 2                       | Only if achieved. "SOC 2 readiness roadmap" if in progress                                                             |

### Internal Security Controls

| Concern                 | Mitigation                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| **API keys**            | Contentful Delivery token is read-only, server-side fetching preferred. All other keys server-side only. |
| **Form spam**           | Honeypot + time-to-submit check + optional Turnstile if abuse appears                                    |
| **XSS**                 | React escaping + sanitize CMS rich text                                                                  |
| **CSP headers**         | Content Security Policy via `next.config.js`                                                             |
| **Secure headers**      | X-Frame-Options, X-Content-Type-Options, HSTS via Vercel                                                 |
| **Dependency scanning** | Dependabot or Renovate                                                                                   |
| **CMS access**          | MFA on Contentful; defined roles (author/editor/publisher)                                               |

### API Route Hardening

| Route             | Protection                                                                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/contact`    | Rate limit by IP (5/min via Upstash or similar), reject < 2s submissions, honeypot, server-side Zod validation, generic error responses (never expose provider errors) |
| `/api/revalidate` | Verify `x-contentful-webhook-secret` header, reject unauthorized                                                                                                       |
| `/api/newsletter` | Rate limit by IP (3/min), email format validation                                                                                                                      |

### Cookie Consent (GDPR)

| Requirement     | Implementation                                                 |
| --------------- | -------------------------------------------------------------- |
| **Banner**      | Bottom bar: Accept All / Reject All / Customize                |
| **Categories**  | Necessary (always on), Analytics (PostHog), Marketing (future) |
| **Persistence** | `localStorage` with timestamp                                  |
| **Blocking**    | PostHog MUST NOT initialize until analytics consent granted    |
| **Library**     | `vanilla-cookieconsent` (~4KB) or custom                       |
| **Mobile**      | Must not block content                                         |

### Legal Pages Required

- Privacy Policy, Terms of Service, Cookie Policy
- All localized (Hebrew + English)
- Require legal review before launch

---

## 21. Testing Strategy

### Test Layers

| Layer                 | Tool                     | What to Test                                        |
| --------------------- | ------------------------ | --------------------------------------------------- |
| **Unit**              | Vitest                   | Transforms, analytics wrappers, utilities           |
| **Component**         | Vitest + Testing Library | Section rendering, phase gating, form validation    |
| **Integration**       | Vitest + MSW             | Contentful fetching, API routes, error fallbacks    |
| **E2E**               | Playwright               | User journeys, navigation, language switch, forms   |
| **Visual Regression** | Playwright screenshots   | RTL/LTR visual parity                               |
| **Accessibility**     | axe-core + Playwright    | WCAG 2.1 AA on every page                           |
| **Performance**       | Lighthouse CI            | Budget enforcement on every PR                      |
| **Link Integrity**    | CI script                | Broken internal/external link check on every deploy |

### Coverage Targets

- Phase gating logic: 100%
- Content transforms: 100%
- Form validation schemas: 100%
- Critical user paths: E2E covered
- Every page: accessibility pass
- Both locales: visual regression pass

### Pre-Launch Checklist

- [ ] All placeholder assets replaced with real content
- [ ] All social links point to real profiles
- [ ] All forms tested in production
- [ ] All analytics events validated in PostHog
- [ ] All metadata validated (meta, OG, structured data)
- [ ] All pages correctly indexed/noindexed
- [ ] Cookie consent blocking PostHog until accepted
- [ ] Accessibility: automated + manual keyboard test
- [ ] Mobile QA: iPhone + Android
- [ ] Hebrew RTL QA complete
- [ ] Lighthouse scores above fail thresholds
- [ ] Sentry: zero errors for 24 hours
- [ ] Sitemap validates with no errors
- [ ] Contact form delivers to correct email
- [ ] Cal.com link works
- [ ] SPA redirects working (old anchors -> new routes)
- [ ] Broken link check passes

### Monitoring & Alerting

| Concern                      | Alert Channel    | Threshold                  |
| ---------------------------- | ---------------- | -------------------------- |
| Sentry error spike           | Slack + email    | > 5 errors in 1 hour       |
| Lighthouse regression        | GitHub Actions   | Score below fail threshold |
| Contentful webhook failure   | Sentry           | Any failure                |
| Form delivery failure        | Sentry           | Any Resend API error       |
| Core Web Vitals regression   | Vercel Analytics | LCP > 3s on 75th pctl      |
| 404 spike                    | Sentry           | > 10 unique 404s in 1 hour |
| `siteSettings` fetch failure | Sentry           | Any occurrence             |

### Ownership

| Area                       | Owner        | Reviewer  | Approval       |
| -------------------------- | ------------ | --------- | -------------- |
| Engineering implementation | Frontend Eng | Tech Lead | CTO/Product    |
| Content QA                 | Marketing    | Product   | Marketing lead |
| Accessibility              | Frontend Eng | QA/Design | Product        |
| Legal pages                | Legal        | Ops       | Founder        |
| Analytics validation       | Eng          | Product   | Growth lead    |
| SEO validation             | Marketing    | Eng       | Product        |

---

## 22. Content Operations & Editorial Workflow

### Roles

| Role          | Permissions                              |
| ------------- | ---------------------------------------- |
| **Author**    | Create drafts, upload assets             |
| **Editor**    | Edit all content, manage taxonomy        |
| **Publisher** | Publish/unpublish, manage `siteSettings` |
| **Admin**     | All + content model changes              |

### Preview Workflow

| Feature            | Implementation                                                        |
| ------------------ | --------------------------------------------------------------------- |
| **Draft mode**     | Next.js Draft Mode + Contentful Preview API                           |
| **Preview access** | Requires signed token in URL                                          |
| **Preview URL**    | `https://geometrixlabs.com/api/draft?secret=xxx&slug=/he/lp/campaign` |
| **Cache bypass**   | Draft Mode bypasses ISR cache, fetches fresh from Preview API         |
| **noindex**        | All preview pages are `noindex`                                       |
| **Preview banner** | Visible "Preview Mode" badge on all draft pages                       |
| **Exit preview**   | Clear link/button to exit Draft Mode                                  |
| **Webhook**        | Contentful publish -> `/api/revalidate` -> ISR on-demand              |

**Environment variables:**

```
CONTENTFUL_PREVIEW_TOKEN=xxx
CONTENTFUL_REVALIDATION_SECRET=xxx
```

### Publish Readiness Criteria

A page may be published only if:

- Required SEO fields are filled (title, description)
- All images have alt text
- Page has approved translation in target locale (not relying on fallback)
- All CTAs resolve to valid URLs
- No placeholder text or assets remain
- Legal/trust claims are verified by engineering/ops owner if applicable
- Preview has been reviewed in desktop and mobile
- Primary CTA has a mapped analytics event

### Route-Level Minimum Content Thresholds

| Route                                 | May Launch When                                                          |
| ------------------------------------- | ------------------------------------------------------------------------ |
| Blog index (`/blog`)                  | At least 3 published posts                                               |
| Case studies index                    | At least 2 published studies                                             |
| Pricing page                          | All plans approved with correct URLs                                     |
| Solutions pages (`/solutions/[slug]`) | Persona copy exists in both locales (or non-primary locale is `noindex`) |
| Testimonials section                  | At least 4 approved testimonials                                         |
| Logo cloud section                    | At least 3 approved logos with permission                                |

### No-Fake-Proof Policy

- No synthetic testimonials or placeholder logos in production
- Sections with placeholder content must remain hidden via `siteSettings` until real, approved assets exist
- Customer names and logos require explicit permission before publication
- Any security/compliance claim on the trust page must be reviewed and approved by an engineering/ops owner before publication

### Content Governance

- Required alt text on images (CMS validation)
- Slug convention: lowercase, hyphenated, max 60 chars
- SEO title max 60 chars, description max 160 chars
- No section renders without minimum viable content quality
- Archive/redirect expired landing pages and old blog posts

### Content Migration Plan (P0)

1. Set up Contentful space + P0 content models
2. Write migration script: `constants.tsx` -> Contentful entries via Management API
3. Verify all entries in both locales
4. Deploy with Contentful as data source
5. Keep mock data in code as dev/error fallback
6. Remove `constants.tsx` as primary source

---

## 23. Technical Implementation Plan

### Project Structure (Next.js App Router)

```
app/
├── [locale]/
│   ├── layout.tsx              # Locale layout (lang/dir, providers)
│   ├── page.tsx                # Homepage (P0)
│   ├── contact/page.tsx        # P0
│   ├── schedule/page.tsx       # P0
│   ├── thank-you/page.tsx      # P0
│   ├── privacy/page.tsx        # P0
│   ├── terms/page.tsx          # P0
│   ├── cookie-policy/page.tsx  # P0
│   ├── about/page.tsx          # P1
│   ├── security/page.tsx       # P1
│   ├── solutions/[slug]/       # P1
│   ├── modules/page.tsx        # P1
│   ├── pricing/page.tsx        # P1
│   ├── lp/[slug]/page.tsx      # P1 (composable via SectionRenderer)
│   ├── blog/                   # P2
│   └── case-studies/           # P2
├── api/
│   ├── contact/route.ts        # P0: Form -> Resend
│   ├── revalidate/route.ts     # P0: Contentful webhook -> ISR
│   ├── draft/route.ts          # P1: Enable Draft Mode
│   └── newsletter/route.ts     # P2
├── not-found.tsx               # 404 page
├── [locale]/error.tsx          # Runtime error boundary (client component, logs to Sentry)
├── [locale]/loading.tsx        # Loading skeleton for ISR-pending pages
├── layout.tsx                  # Root layout
├── sitemap.ts
├── robots.ts
└── manifest.ts

components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AnnouncementBar.tsx
│   └── CookieConsent.tsx
├── sections/                   # P0: hardcoded homepage sections
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── UseCases.tsx
│   ├── ModulesGrid.tsx
│   ├── Pricing.tsx
│   ├── Testimonials.tsx
│   ├── Team.tsx
│   ├── FAQ.tsx
│   ├── Contact.tsx
│   ├── SecurityTrust.tsx
│   └── CTA.tsx
├── composable/                 # P1: SectionRenderer + composable variants
│   ├── SectionRenderer.tsx
│   ├── SectionHero.tsx
│   ├── SectionSteps.tsx
│   ├── SectionFeatureGrid.tsx
│   ├── ... (all section block components)
│   └── SectionMedia.tsx
├── ui/
│   ├── Button.tsx, Input.tsx, Card.tsx, Accordion.tsx, ...
└── shared/
    ├── ContentfulImage.tsx
    ├── CalcomWidget.tsx
    ├── ContactForm.tsx
    └── ErrorBoundary.tsx

lib/
├── contentful/
│   ├── client.ts              # Delivery + Preview clients
│   ├── queries.ts             # Typed fetch functions
│   ├── transforms.ts          # Skeleton -> app type transforms
│   └── types.ts
├── analytics.ts               # PostHog (consent-aware)
├── locale.ts
└── utils.ts

content/
└── mock/                      # Mock JSON data (local dev + Contentful population source)
    ├── site-settings.json
    ├── announcement-bar.json
    ├── testimonials.json
    ├── team-members.json
    ├── faq-items.json
    ├── pricing-plans.json
    ├── modules.json
    ├── personas.json
    └── images/                # Placeholder images for local dev

constants/
└── defaults.ts                # siteSettings hardcoded defaults (fallback if CMS + mock both fail)

scripts/
└── populate-contentful.ts     # One-time migration: mock JSON -> Contentful entries via CMA
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "contentful": "^11.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "resend": "^4.x",
    "motion": "^11.x",
    "lucide-react": "^0.x",
    "vanilla-cookieconsent": "^3.x",
    "@sentry/nextjs": "^8.x",
    "posthog-js": "^1.x",
    "@upstash/ratelimit": "^2.x",
    "@upstash/redis": "^1.x"
  },
  "devDependencies": {
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",
    "typescript": "^5.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "@playwright/test": "^1.x",
    "msw": "^2.x",
    "@next/bundle-analyzer": "^15.x"
  }
}
```

### Environment Variables

```bash
# Contentful (server-side - no NEXT_PUBLIC_ prefix needed)
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_TOKEN=
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_REVALIDATION_SECRET=

# Email (server-side)
RESEND_API_KEY=re_xxx
CONTACT_EMAIL=hello@geometrixlabs.com
CONTACT_CC_EMAILS=sales@geometrixlabs.com

# Cal.com (client-side)
NEXT_PUBLIC_CALCOM_USERNAME=geometrix

# Analytics (client-side)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com

# Error Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App URLs
NEXT_PUBLIC_APP_URL=https://app.geometrixlabs.com
NEXT_PUBLIC_SITE_URL=https://geometrixlabs.com
```

Note: Contentful tokens are server-side only (no `NEXT_PUBLIC_` prefix). With Next.js server components, CMS data is fetched server-side.

### Browser Support

```json
"browserslist": [
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Safari versions",
  "last 2 Edge versions",
  "iOS >= 14.5"
]
```

### Build & Deployment

- **Hosting**: Vercel
- **CI/CD**: GitHub Actions on push to `main`
- **Preview**: Vercel PR previews
- **Domain**: `geometrixlabs.com`
- **Revalidation**: On-demand via Contentful webhook -> `/api/revalidate`

### Rollback & Incident Response

| Scenario        | Response                                                     |
| --------------- | ------------------------------------------------------------ |
| Bad CMS content | Contentful versioning -> revert entry -> webhook revalidates |
| Broken deploy   | Vercel instant rollback                                      |

### Dependency Outage Fallback Matrix

| Dependency        | Failure Mode             | User Impact            | Fallback                                                   |
| ----------------- | ------------------------ | ---------------------- | ---------------------------------------------------------- |
| **Contentful**    | Content fetch fails      | Stale content          | ISR serves cached pages; `siteSettings` uses code defaults |
| **Resend**        | Form send fails          | Form appears broken    | Inline error message + mailto fallback link + Sentry alert |
| **Cal.com**       | Widget unavailable       | Can't schedule         | Show direct link + contact form as alternative             |
| **PostHog**       | Blocked / unavailable    | No analytics           | No UX impact; site functions normally                      |
| **Sentry**        | Unavailable              | No error tracking      | No UX impact; errors logged to console                     |
| **Upstash Redis** | Rate limiter unavailable | Rate limiting disabled | Allow request through (fail open) + Sentry alert           |

### Migration Validation Checklist (Vite -> Next.js)

- [ ] All pages render in both locales (he, en)
- [ ] RTL/LTR switching works correctly
- [ ] All interactive elements function (accordion, tabs, mobile menu)
- [ ] Responsive design matches original at all breakpoints
- [ ] No console errors in dev mode
- [ ] Build succeeds with no warnings
- [ ] Tailwind classes match original visual output
- [ ] Environment variables migrated (`VITE_` -> server-side / `NEXT_PUBLIC_`)

### Implementation Order (P0 Only)

| Step         | Task                                                                     | Effort (days)             |
| ------------ | ------------------------------------------------------------------------ | ------------------------- |
| 1            | Scaffold Next.js 15, migrate components from Vite, Tailwind 4 build-time | 4-6                       |
| 2            | `[locale]` routing + root URL middleware + RTL/LTR                       | 1-2                       |
| 3            | SPA redirect rules (`next.config.js`)                                    | 0.5                       |
| 4            | Contentful space + P0 content models                                     | 1-2                       |
| 5            | Contentful client, typed queries, transforms, mock fallbacks             | 2-3                       |
| 6            | `siteSettings` phase gating with hardcoded defaults                      | 1                         |
| 7            | Homepage sections (explicit, not composable)                             | 2-3                       |
| 8            | Contact form + Resend API route (with rate limiting)                     | 1                         |
| 9            | Cal.com link integration                                                 | 0.5                       |
| 10           | PostHog (consent-aware) + cookie consent banner                          | 1.5                       |
| 11           | Sentry + Error Boundary                                                  | 0.5                       |
| 12           | SEO: `generateMetadata`, OG, `hreflang`, structured data                 | 2-3                       |
| 13           | Dynamic sitemap + robots.txt                                             | 0.5                       |
| 14           | Legal pages                                                              | 0.5                       |
| 15           | 404 page                                                                 | 0.5                       |
| 16           | Vercel deployment + GitHub Actions                                       | 1                         |
| 17           | Content migration: `constants.tsx` -> Contentful                         | 1                         |
| **P0 Total** |                                                                          | **~20-26 developer-days** |

### Team & Timeline Assumptions

- 1 full-stack developer (primary)
- 1 designer for assets/review (part-time)
- 1 content owner for copywriting + Contentful entries (part-time, parallel workstream)
- **Calendar time for P0**: 5-7 weeks (accounting for reviews, feedback, content dependencies)
- **Engineering time**: ~20-26 developer-days
- **Content creation**: ~10-15 days (separate workstream, not blocked on engineering)

---

## 24. Risks & Mitigations

| Risk                                          | Impact                                 | Mitigation                                                       |
| --------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| No real testimonials/logos before launch      | Weak trust                             | Hide sections via `siteSettings` until validated assets exist    |
| Content readiness delays                      | Launch blocked on non-eng dependencies | Content checklist with owners (section 26), parallel workstream  |
| Form spam                                     | Low lead quality                       | Honeypot + time-check + rate limiting. Optional Turnstile.       |
| Hebrew localization gaps                      | Broken UX/SEO                          | Route-based locales + visual regression + noindex fallback pages |
| Performance regression from media             | Lower conversion, SEO penalty          | Budget tiers (target/fail) + CI enforcement + image optimization |
| CMS singleton deleted/corrupted               | Site breaks                            | Hardcoded defaults + Sentry alerting                             |
| Next.js migration takes longer than estimated | Delays P0                              | 4-6 day estimate (not 2-3), migration validation checklist       |
| React 19 ecosystem compatibility              | Dependency issues                      | Pin and test all deps early. Fallback to React 18 if blocking.   |
| Over-building infrastructure before shipping  | Never launches                         | Strict P0/P1/P2 split. Composable sections ship in P1, not P0.   |

---

## 25. Non-Goals

- Authenticated dashboard or product features
- Custom CMS (we use Contentful)
- Languages beyond Hebrew/English in P0-P1
- Advanced CRM automation (P2+)
- ROI calculator tied to pricing API (P3)
- Native mobile app or PWA
- E-commerce / payment processing (handled by product app)
- Custom analytics platform (we use PostHog)
- Server-side rendering of the product app

---

## 26. Content Readiness Checklist

| Content                                      | Owner            | Status      | Blocks             |
| -------------------------------------------- | ---------------- | ----------- | ------------------ |
| Real team photos                             | Marketing        | Not started | Team, About        |
| Client logos (or remove section)             | Sales            | Not started | Logo cloud         |
| 4-6 real testimonials                        | Customer Success | Not started | Testimonials       |
| Product screenshots / demo video             | Product          | Not started | Hero, How It Works |
| Privacy Policy (legal review)                | Legal            | Not started | `/privacy`         |
| Terms of Service (legal review)              | Legal            | Not started | `/terms`           |
| Cookie Policy                                | Legal            | Not started | `/cookie-policy`   |
| Real social media profiles                   | Marketing        | Not started | Footer, Team       |
| FAQ content (8-12 questions)                 | Product + Sales  | Not started | FAQ                |
| Brand assets (logo SVGs, OG images, favicon) | Design           | Not started | Throughout         |
| Cal.com account setup                        | Operations       | Not started | Scheduling         |
| Contentful space provisioning                | Engineering      | Not started | All CMS content    |
| Resend account + domain verification         | Engineering      | Not started | Contact form       |
| PostHog project creation                     | Engineering      | Not started | Analytics          |
| Sentry project creation                      | Engineering      | Not started | Error monitoring   |
| Upstash Redis provisioning                   | Engineering      | Not started | API rate limiting  |
| Domain DNS configuration                     | Engineering      | Not started | Production deploy  |

---

## 27. Decision Log

| Decision         | Options Considered                              | Chosen                                  | Rationale                                                                                                                     |
| ---------------- | ----------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Vite SPA, Astro, Next.js, Remix                 | **Next.js 15**                          | SSR/SSG for SEO, Vercel-native, App Router for server components, ISR for CMS content. Both external audits recommended this. |
| CMS              | Sanity, Strapi, Contentful, Payload             | **Contentful**                          | Team familiarity from ScaleupLabs, proven patterns, good localization.                                                        |
| Email            | FormSubmit.co, SendGrid, Resend, SES            | **Resend**                              | Reliable delivery, modern DX, no third-party form dependency, simple API.                                                     |
| Analytics        | GA4, Mixpanel, PostHog, Amplitude               | **PostHog**                             | Product + marketing unified, session recordings, feature flags, EU hosting.                                                   |
| Error monitoring | LogRocket, Sentry, Datadog                      | **Sentry**                              | Industry standard, excellent Next.js SDK, source maps, affordable.                                                            |
| Animation        | CSS only, GSAP, Framer Motion, Motion           | **Motion**                              | Lighter than Framer Motion, declarative, `prefers-reduced-motion` support.                                                    |
| Cookie consent   | CookieBot, vanilla-cookieconsent, custom        | **vanilla-cookieconsent**               | Lightweight (~4KB), no external dependency, customizable.                                                                     |
| CSS              | CSS Modules, Styled Components, Tailwind        | **Tailwind CSS 4**                      | Team familiarity, RTL via logical properties, build-time optimization.                                                        |
| CMS i18n         | Duplicated fields (`_en`/`_he`), native locales | **Native Contentful locales**           | Half the fields, translator UI, easy to add languages.                                                                        |
| CMS architecture | Page-specific types, composable blocks          | **Two-track: simple P0, composable P1** | Ship fast first, add flexibility when needed.                                                                                 |

---

## 28. Appendix: Reference Architecture from ScaleupLabs

The ScaleupLabs site (`/Users/danielaviram/repos/scaleuplabs-site`) provides proven patterns:

### Contentful Pattern

```typescript
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const entries = await client.getEntries<TestimonialSkeleton>({
  content_type: 'testimonial',
  locale: locale === 'he' ? 'he-IL' : 'en-US',
});
```

**ScaleupLabs patterns to reuse**: Mock data fallback, transform functions, content type skeletons.

**Next.js adaptations**: Server components fetch directly (no React Query for SSR), ISR replaces client-side caching, Preview API for drafts.

### Cal.com

Start with simple link in P0: `<a href="https://cal.com/{username}" target="_blank">`. Add embed SDK in P1.

### Email

Use Resend from the start via Next.js API routes (not FormSubmit.co).

### Analytics

PostHog via `posthog-js` with consent-aware initialization.

---

## Summary: What Success Looks Like

**P0 (Coming Soon)**: A polished, SSR/SSG, CMS-driven homepage with working contact form, meeting scheduling, analytics, and error monitoring. Marketing can update copy and toggle sections without engineering. Visitors can inquire, schedule demos, and join a waitlist. Both Hebrew and English fully functional with proper SEO. Lighthouse above fail thresholds on all pages.

**P1 (30 days post-launch)**: Composable landing pages let marketing create campaign pages without code. Solutions pages, module directory, and security page expand the site. Playwright E2E tests guard quality.

**P2 (Growth)**: Blog and case studies drive organic traffic. CRM integration routes leads to pipeline. A/B testing optimizes conversion.

**P3 (Scale)**: Full self-service funnel. ROI calculator, resource center, advanced attribution. The marketing site is a growth engine.

### Three Critical Architectural Decisions

1. **Next.js SSR/SSG** - Server-rendered content for SEO, performance, and OG tags
2. **Two-track CMS** - Simple entries for P0, composable section blocks for P1
3. **Phase gating via `siteSettings`** - Every section's visibility is a CMS toggle with safe code defaults

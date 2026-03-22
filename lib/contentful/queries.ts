import type { Locale } from '@/lib/locale';
import type {
  SiteSettings,
  AnnouncementBar,
  Testimonial,
  TeamMember,
  FaqItem,
  PricingPlan,
  Module,
  Persona,
} from '@/types/app';
import { SITE_SETTINGS_DEFAULTS } from '@/constants/defaults';
import { client, isContentfulConfigured } from './client';
import { resolveLocalizedEntry } from './transforms';

// Import mock data (fallback when Contentful is not configured)
import mockSiteSettings from '@/content/mock/site-settings.json';
import mockAnnouncementBar from '@/content/mock/announcement-bar.json';
import mockTestimonials from '@/content/mock/testimonials.json';
import mockTeamMembers from '@/content/mock/team-members.json';
import mockFaqItems from '@/content/mock/faq-items.json';
import mockPricingPlans from '@/content/mock/pricing-plans.json';
import mockModules from '@/content/mock/modules.json';
import mockPersonas from '@/content/mock/personas.json';

const contentfulLocale = (locale: Locale): string => (locale === 'he' ? 'he-IL' : 'en-US');

function resolveAssetUrl(asset: unknown): string | null {
  if (!asset || typeof asset !== 'object') return null;
  const a = asset as Record<string, unknown>;
  if (a.fields && typeof a.fields === 'object') {
    const fields = a.fields as Record<string, unknown>;
    if (fields.file && typeof fields.file === 'object') {
      const file = fields.file as Record<string, string>;
      return file.url ? `https:${file.url}` : null;
    }
  }
  return null;
}

/**
 * Site settings - never throws. Returns hardcoded defaults as last resort.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({ content_type: 'siteSettings', limit: 1 });
      if (entries.items.length > 0) {
        const f = entries.items[0].fields as Record<string, unknown>;
        return {
          phase: f.phase as SiteSettings['phase'],
          showPricing: f.showPricing as boolean,
          showSignup: f.showSignup as boolean,
          showLogin: f.showLogin as boolean,
          showBlog: f.showBlog as boolean,
          showTestimonials: f.showTestimonials as boolean,
          showCaseStudies: f.showCaseStudies as boolean,
          showRoiCalculator: f.showRoiCalculator as boolean,
          ctaType: f.ctaType as SiteSettings['ctaType'],
          maintenanceMode: f.maintenanceMode as boolean,
        };
      }
    } catch (error) {
      console.warn('[CMS] Failed to fetch site settings from Contentful:', error);
    }
  }
  try {
    return mockSiteSettings as SiteSettings;
  } catch {
    return SITE_SETTINGS_DEFAULTS;
  }
}

export async function getAnnouncementBar(locale: Locale): Promise<AnnouncementBar | null> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'announcementBar',
        limit: 1,
        locale: contentfulLocale(locale),
      });
      if (entries.items.length > 0) {
        const f = entries.items[0].fields as Record<string, unknown>;
        return {
          message: f.message as string,
          linkUrl: f.linkUrl as string | undefined,
          linkLabel: f.linkLabel as string | undefined,
          enabled: f.enabled as boolean,
          variant: f.variant as AnnouncementBar['variant'],
        };
      }
    } catch (error) {
      console.warn('[CMS] Failed to fetch announcement bar:', error);
    }
  }
  try {
    const resolved = resolveLocalizedEntry(mockAnnouncementBar as Record<string, unknown>, locale);
    return resolved as unknown as AnnouncementBar;
  } catch {
    return null;
  }
}

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'testimonial',
        locale: contentfulLocale(locale),
        order: ['fields.name'] as const,
      });
      return entries.items.map((item) => {
        const f = item.fields as Record<string, unknown>;
        return {
          name: f.name as string,
          role: f.role as string,
          company: f.company as string,
          quote: f.quote as string,
          rating: f.rating as number,
          featured: f.featured as boolean,
          image: resolveAssetUrl(f.image) ?? undefined,
        };
      });
    } catch (error) {
      console.warn('[CMS] Failed to fetch testimonials:', error);
    }
  }
  try {
    return mockTestimonials.map(
      (t) => resolveLocalizedEntry(t as Record<string, unknown>, locale) as unknown as Testimonial,
    );
  } catch {
    return [];
  }
}

export async function getTeamMembers(locale: Locale): Promise<TeamMember[]> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'teamMember',
        locale: contentfulLocale(locale),
        order: ['fields.order'] as const,
      });
      return entries.items.map((item) => {
        const f = item.fields as Record<string, unknown>;
        return {
          name: f.name as string,
          role: f.role as string,
          bio: f.bio as string,
          image: resolveAssetUrl(f.image),
          linkedin: f.linkedin as string | undefined,
          order: f.order as number,
        };
      });
    } catch (error) {
      console.warn('[CMS] Failed to fetch team members:', error);
    }
  }
  try {
    return mockTeamMembers.map(
      (t) => resolveLocalizedEntry(t as Record<string, unknown>, locale) as unknown as TeamMember,
    );
  } catch {
    return [];
  }
}

export async function getFaqItems(locale: Locale): Promise<FaqItem[]> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'faqItem',
        locale: contentfulLocale(locale),
        order: ['fields.order'] as const,
      });
      return entries.items.map((item) => {
        const f = item.fields as Record<string, unknown>;
        return {
          question: f.question as string,
          answer: f.answer as string,
          category: f.category as FaqItem['category'],
          order: f.order as number,
        };
      });
    } catch (error) {
      console.warn('[CMS] Failed to fetch FAQ items:', error);
    }
  }
  try {
    return mockFaqItems.map(
      (f) => resolveLocalizedEntry(f as Record<string, unknown>, locale) as unknown as FaqItem,
    );
  } catch {
    return [];
  }
}

export async function getPricingPlans(locale: Locale): Promise<PricingPlan[]> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'pricingPlan',
        locale: contentfulLocale(locale),
        order: ['fields.order'] as const,
      });
      return entries.items.map((item) => {
        const f = item.fields as Record<string, unknown>;
        return {
          name: f.name as string,
          price: f.price as number,
          currency: f.currency as string,
          billingPeriod: f.billingPeriod as PricingPlan['billingPeriod'],
          features: f.features as string,
          highlighted: f.highlighted as boolean,
          ctaLabel: f.ctaLabel as string,
          ctaUrl: f.ctaUrl as string,
          order: f.order as number,
        };
      });
    } catch (error) {
      console.warn('[CMS] Failed to fetch pricing plans:', error);
    }
  }
  try {
    return mockPricingPlans.map(
      (p) => resolveLocalizedEntry(p as Record<string, unknown>, locale) as unknown as PricingPlan,
    );
  } catch {
    return [];
  }
}

export async function getModules(locale: Locale): Promise<Module[]> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'module',
        locale: contentfulLocale(locale),
        order: ['fields.order'] as const,
      });
      return entries.items.map((item) => {
        const f = item.fields as Record<string, unknown>;
        return {
          name: f.name as string,
          slug: f.slug as string,
          category: f.category as Module['category'],
          summary: f.summary as string,
          icon: f.icon as string,
          featured: f.featured as boolean,
          order: f.order as number,
        };
      });
    } catch (error) {
      console.warn('[CMS] Failed to fetch modules:', error);
    }
  }
  try {
    return mockModules.map(
      (m) => resolveLocalizedEntry(m as Record<string, unknown>, locale) as unknown as Module,
    );
  } catch {
    return [];
  }
}

export async function getPersonas(locale: Locale): Promise<Persona[]> {
  if (isContentfulConfigured && client) {
    try {
      const entries = await client.getEntries({
        content_type: 'persona',
        locale: contentfulLocale(locale),
      });
      return entries.items.map((item) => {
        const f = item.fields as Record<string, unknown>;
        return {
          name: f.name as string,
          slug: f.slug as string,
          role: f.role as string,
          painPoints: f.painPoints as string,
          benefits: f.benefits as string,
          ctaLabel: f.ctaLabel as string,
          ctaUrl: f.ctaUrl as string,
          image: resolveAssetUrl(f.image),
          featuredModules: (f.featuredModules as string[]) || [],
        };
      });
    } catch (error) {
      console.warn('[CMS] Failed to fetch personas:', error);
    }
  }
  try {
    return mockPersonas.map(
      (p) => resolveLocalizedEntry(p as Record<string, unknown>, locale) as unknown as Persona,
    );
  } catch {
    return [];
  }
}

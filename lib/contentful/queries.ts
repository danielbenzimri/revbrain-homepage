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
import { resolveLocalizedEntry } from './transforms';

// Import mock data
import mockSiteSettings from '@/content/mock/site-settings.json';
import mockAnnouncementBar from '@/content/mock/announcement-bar.json';
import mockTestimonials from '@/content/mock/testimonials.json';
import mockTeamMembers from '@/content/mock/team-members.json';
import mockFaqItems from '@/content/mock/faq-items.json';
import mockPricingPlans from '@/content/mock/pricing-plans.json';
import mockModules from '@/content/mock/modules.json';
import mockPersonas from '@/content/mock/personas.json';

/**
 * Site settings - never throws. Returns hardcoded defaults as last resort.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    // TODO: Fetch from Contentful when configured
    return mockSiteSettings as SiteSettings;
  } catch (error) {
    console.warn('[CMS] Failed to fetch site settings, using defaults:', error);
    return SITE_SETTINGS_DEFAULTS;
  }
}

export async function getAnnouncementBar(locale: Locale): Promise<AnnouncementBar | null> {
  try {
    const resolved = resolveLocalizedEntry(mockAnnouncementBar as Record<string, unknown>, locale);
    return resolved as unknown as AnnouncementBar;
  } catch (error) {
    console.warn('[CMS] Failed to fetch announcement bar:', error);
    return null;
  }
}

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  try {
    return mockTestimonials.map(
      (t) => resolveLocalizedEntry(t as Record<string, unknown>, locale) as unknown as Testimonial,
    );
  } catch (error) {
    console.warn('[CMS] Failed to fetch testimonials:', error);
    return [];
  }
}

export async function getTeamMembers(locale: Locale): Promise<TeamMember[]> {
  try {
    return mockTeamMembers.map(
      (t) => resolveLocalizedEntry(t as Record<string, unknown>, locale) as unknown as TeamMember,
    );
  } catch (error) {
    console.warn('[CMS] Failed to fetch team members:', error);
    return [];
  }
}

export async function getFaqItems(locale: Locale): Promise<FaqItem[]> {
  try {
    return mockFaqItems.map(
      (f) => resolveLocalizedEntry(f as Record<string, unknown>, locale) as unknown as FaqItem,
    );
  } catch (error) {
    console.warn('[CMS] Failed to fetch FAQ items:', error);
    return [];
  }
}

export async function getPricingPlans(locale: Locale): Promise<PricingPlan[]> {
  try {
    return mockPricingPlans.map(
      (p) => resolveLocalizedEntry(p as Record<string, unknown>, locale) as unknown as PricingPlan,
    );
  } catch (error) {
    console.warn('[CMS] Failed to fetch pricing plans:', error);
    return [];
  }
}

export async function getModules(locale: Locale): Promise<Module[]> {
  try {
    return mockModules.map(
      (m) => resolveLocalizedEntry(m as Record<string, unknown>, locale) as unknown as Module,
    );
  } catch (error) {
    console.warn('[CMS] Failed to fetch modules:', error);
    return [];
  }
}

export async function getPersonas(locale: Locale): Promise<Persona[]> {
  try {
    return mockPersonas.map(
      (p) => resolveLocalizedEntry(p as Record<string, unknown>, locale) as unknown as Persona,
    );
  } catch (error) {
    console.warn('[CMS] Failed to fetch personas:', error);
    return [];
  }
}

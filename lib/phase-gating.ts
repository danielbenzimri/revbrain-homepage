import type { SiteSettings } from '@/types/app';

type SectionName =
  | 'pricing'
  | 'signup'
  | 'login'
  | 'blog'
  | 'testimonials'
  | 'caseStudies'
  | 'roiCalculator';

const SECTION_TOGGLE_MAP: Record<SectionName, keyof SiteSettings> = {
  pricing: 'showPricing',
  signup: 'showSignup',
  login: 'showLogin',
  blog: 'showBlog',
  testimonials: 'showTestimonials',
  caseStudies: 'showCaseStudies',
  roiCalculator: 'showRoiCalculator',
};

export function shouldShowSection(settings: SiteSettings, section: SectionName): boolean {
  const toggleKey = SECTION_TOGGLE_MAP[section];
  return settings[toggleKey] === true;
}

interface CTAConfig {
  label: { he: string; en: string };
  url: string;
}

const CTA_CONFIGS: Record<SiteSettings['ctaType'], CTAConfig> = {
  'schedule-meeting': {
    label: { he: 'קבע הדגמה', en: 'Schedule a Demo' },
    url: '/schedule',
  },
  'join-waitlist': {
    label: { he: 'הצטרפו לרשימת ההמתנה', en: 'Join the Waitlist' },
    url: '/contact',
  },
  'start-trial': {
    label: { he: 'התחילו ניסיון חינם', en: 'Start Free Trial' },
    url: 'https://app.revbrain.ai/signup',
  },
  signup: {
    label: { he: 'הרשמו עכשיו', en: 'Sign Up Now' },
    url: 'https://app.revbrain.ai/signup',
  },
};

export function getCTAConfig(
  settings: SiteSettings,
  locale: 'he' | 'en',
): { label: string; url: string } {
  const config = CTA_CONFIGS[settings.ctaType];
  return {
    label: config.label[locale],
    url: config.url,
  };
}

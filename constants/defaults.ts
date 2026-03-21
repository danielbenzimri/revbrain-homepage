import type { SiteSettings } from '@/types/app';

/** Hardcoded defaults for siteSettings. Used when both CMS and mock data fail. */
export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
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

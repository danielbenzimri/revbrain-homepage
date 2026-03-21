import { z } from 'zod/v4';

/** Localized field helper - supports {he-IL, en-US} inline locale structure */
const localizedString = z.object({
  'he-IL': z.string(),
  'en-US': z.string(),
});

const localizedStringOptionalHe = z.object({
  'he-IL': z.string().optional(),
  'en-US': z.string(),
});

export const SiteSettingsSchema = z.object({
  phase: z.enum(['coming-soon', 'pre-launch', 'live']),
  showPricing: z.boolean(),
  showSignup: z.boolean(),
  showLogin: z.boolean(),
  showBlog: z.boolean(),
  showTestimonials: z.boolean(),
  showCaseStudies: z.boolean(),
  showRoiCalculator: z.boolean(),
  ctaType: z.enum(['schedule-meeting', 'join-waitlist', 'start-trial', 'signup']),
  maintenanceMode: z.boolean(),
});

export const AnnouncementBarSchema = z.object({
  message: localizedString,
  linkUrl: z.string().optional(),
  linkLabel: localizedString.optional(),
  enabled: z.boolean(),
  variant: z.enum(['info', 'success', 'warning']),
});

export const TestimonialSchema = z.object({
  name: z.string(),
  role: localizedString,
  company: z.string(),
  quote: localizedString,
  rating: z.number().int().min(1).max(5),
  featured: z.boolean(),
  image: z.string().nullable().optional(),
});

export const TeamMemberSchema = z.object({
  name: z.string(),
  role: localizedString,
  bio: localizedString,
  image: z.string().nullable().optional(),
  linkedin: z.string().optional(),
  order: z.number().int(),
});

export const FaqItemSchema = z.object({
  question: localizedString,
  answer: localizedString,
  category: z.enum(['general', 'pricing', 'security', 'onboarding']),
  order: z.number().int(),
});

export const PricingPlanSchema = z.object({
  name: localizedString,
  price: z.number(),
  currency: z.string(),
  billingPeriod: z.enum(['monthly', 'yearly', 'custom']),
  features: localizedString,
  highlighted: z.boolean(),
  ctaLabel: localizedString,
  ctaUrl: z.string(),
  order: z.number().int(),
});

export const ModuleSchema = z.object({
  name: localizedString,
  slug: z.string(),
  category: z.enum(['analysis', 'migration', 'validation', 'deployment']),
  summary: localizedString,
  icon: z.string(),
  featured: z.boolean(),
  order: z.number().int(),
});

export const PersonaSchema = z.object({
  name: localizedString,
  slug: z.string(),
  role: localizedString,
  painPoints: localizedString,
  benefits: localizedString,
  ctaLabel: localizedString,
  ctaUrl: z.string(),
  image: z.string().nullable().optional(),
  featuredModules: z.array(z.string()),
});

export { localizedString, localizedStringOptionalHe };

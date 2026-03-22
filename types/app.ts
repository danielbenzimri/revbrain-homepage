/** App-facing types for CMS content. These are what components receive as props. */

export interface SiteSettings {
  phase: 'coming-soon' | 'pre-launch' | 'live';
  showPricing: boolean;
  showSignup: boolean;
  showLogin: boolean;
  showBlog: boolean;
  showTestimonials: boolean;
  showCaseStudies: boolean;
  showRoiCalculator: boolean;
  ctaType: 'schedule-meeting' | 'join-waitlist' | 'start-trial' | 'signup';
  maintenanceMode: boolean;
}

export interface AnnouncementBar {
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  enabled: boolean;
  variant: 'info' | 'success' | 'warning';
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  featured: boolean;
  image?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string | null;
  linkedin?: string;
  order: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'security' | 'onboarding';
  order: number;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'custom';
  features: string;
  highlighted: boolean;
  ctaLabel: string;
  ctaUrl: string;
  order: number;
}

export interface Module {
  name: string;
  slug: string;
  category: 'analysis' | 'migration' | 'validation' | 'deployment';
  summary: string;
  icon: string;
  featured: boolean;
  order: number;
}

export interface Persona {
  name: string;
  slug: string;
  role: string;
  painPoints: string;
  benefits: string;
  ctaLabel: string;
  ctaUrl: string;
  image?: string | null;
  featuredModules: string[];
}

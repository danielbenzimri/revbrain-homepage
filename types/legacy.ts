export type Language = 'he' | 'en';

export interface NavItem {
  label: string;
  href: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}

export interface Persona {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
}

export interface ModuleItem {
  name: string;
  category: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContentData {
  nav: {
    features: string;
    modules: string;
    pricing: string;
    about: string;
    team: string;
    contact: string;
    login: string;
    signup: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  trustedBy: {
    title: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  modules: {
    title: string;
    subtitle: string;
    items: ModuleItem[];
  };
  personas: {
    title: string;
    subtitle: string;
    items: Persona[];
  };
  pricing: {
    title: string;
    subtitle: string;
    tiers: PricingTier[];
  };
  team: {
    title: string;
    subtitle: string;
    items: TeamMember[];
  };
  testimonials: {
    title: string;
    items: Testimonial[];
  };
  faq: {
    title: string;
    items: FAQItem[];
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
}

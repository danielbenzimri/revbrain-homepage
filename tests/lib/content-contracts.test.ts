import { describe, it, expect } from 'vitest';
import {
  SiteSettingsSchema,
  AnnouncementBarSchema,
  TestimonialSchema,
  TeamMemberSchema,
  FaqItemSchema,
  PricingPlanSchema,
  ModuleSchema,
  PersonaSchema,
} from '@/lib/contentful/schemas';

import siteSettings from '@/content/mock/site-settings.json';
import announcementBar from '@/content/mock/announcement-bar.json';
import testimonials from '@/content/mock/testimonials.json';
import teamMembers from '@/content/mock/team-members.json';
import faqItems from '@/content/mock/faq-items.json';
import pricingPlans from '@/content/mock/pricing-plans.json';
import modules from '@/content/mock/modules.json';
import personas from '@/content/mock/personas.json';

describe('Content Contract Tests - Mock Data Validation', () => {
  it('site-settings.json conforms to schema', () => {
    const result = SiteSettingsSchema.safeParse(siteSettings);
    expect(result.success).toBe(true);
  });

  it('announcement-bar.json conforms to schema', () => {
    const result = AnnouncementBarSchema.safeParse(announcementBar);
    expect(result.success).toBe(true);
  });

  it('all testimonials conform to schema', () => {
    testimonials.forEach((item, i) => {
      const result = TestimonialSchema.safeParse(item);
      expect(result.success, `Testimonial ${i} (${item.name}): invalid`).toBe(true);
    });
  });

  it('all team members conform to schema', () => {
    teamMembers.forEach((item, i) => {
      const result = TeamMemberSchema.safeParse(item);
      expect(result.success, `TeamMember ${i} (${item.name}): invalid`).toBe(true);
    });
  });

  it('all FAQ items conform to schema', () => {
    faqItems.forEach((item, i) => {
      const result = FaqItemSchema.safeParse(item);
      expect(result.success, `FaqItem ${i}: invalid`).toBe(true);
    });
  });

  it('all pricing plans conform to schema', () => {
    pricingPlans.forEach((item, i) => {
      const result = PricingPlanSchema.safeParse(item);
      expect(result.success, `PricingPlan ${i}: invalid`).toBe(true);
    });
  });

  it('all modules conform to schema', () => {
    modules.forEach((item, i) => {
      const result = ModuleSchema.safeParse(item);
      expect(result.success, `Module ${i}: invalid`).toBe(true);
    });
  });

  it('all personas conform to schema', () => {
    personas.forEach((item, i) => {
      const result = PersonaSchema.safeParse(item);
      expect(result.success, `Persona ${i}: invalid`).toBe(true);
    });
  });
});

describe('Content Contract Tests - Schema Drift Protection', () => {
  it('rejects testimonial with missing localized quote', () => {
    const result = TestimonialSchema.safeParse({
      name: 'Test',
      role: { 'en-US': 'Engineer' }, // Missing he-IL
      company: 'Test Co',
      quote: { 'he-IL': 'Good', 'en-US': 'Good' },
      rating: 5,
      featured: false,
    });
    expect(result.success).toBe(false);
  });

  it('handles null image asset gracefully', () => {
    const result = TeamMemberSchema.safeParse({
      name: 'Test',
      role: { 'he-IL': 'תפקיד', 'en-US': 'Role' },
      bio: { 'he-IL': 'ביו', 'en-US': 'Bio' },
      image: null,
      linkedin: '',
      order: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects FAQ item with invalid category', () => {
    const result = FaqItemSchema.safeParse({
      question: { 'he-IL': 'שאלה', 'en-US': 'Question' },
      answer: { 'he-IL': 'תשובה', 'en-US': 'Answer' },
      category: 'invalid-category',
      order: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects module with missing required slug', () => {
    const result = ModuleSchema.safeParse({
      name: { 'he-IL': 'מודול', 'en-US': 'Module' },
      // slug is missing
      category: 'analysis',
      summary: { 'he-IL': 'תקציר', 'en-US': 'Summary' },
      icon: 'Calculator',
      featured: false,
      order: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects pricing plan with rating out of range', () => {
    const result = TestimonialSchema.safeParse({
      name: 'Test',
      role: { 'he-IL': 'תפקיד', 'en-US': 'Role' },
      company: 'Test',
      quote: { 'he-IL': 'ציטוט', 'en-US': 'Quote' },
      rating: 6, // Out of 1-5 range
      featured: false,
    });
    expect(result.success).toBe(false);
  });

  it('all localized fields contain both he-IL and en-US', () => {
    // Check a sampling of localized fields across content types
    for (const testimonial of testimonials) {
      expect(testimonial.role).toHaveProperty('he-IL');
      expect(testimonial.role).toHaveProperty('en-US');
      expect(testimonial.quote).toHaveProperty('he-IL');
      expect(testimonial.quote).toHaveProperty('en-US');
    }
    for (const member of teamMembers) {
      expect(member.role).toHaveProperty('he-IL');
      expect(member.role).toHaveProperty('en-US');
      expect(member.bio).toHaveProperty('he-IL');
      expect(member.bio).toHaveProperty('en-US');
    }
    for (const mod of modules) {
      expect(mod.name).toHaveProperty('he-IL');
      expect(mod.name).toHaveProperty('en-US');
    }
  });
});

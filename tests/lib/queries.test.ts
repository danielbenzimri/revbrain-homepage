import { describe, it, expect } from 'vitest';
import {
  getSiteSettings,
  getAnnouncementBar,
  getTestimonials,
  getTeamMembers,
  getFaqItems,
  getPricingPlans,
  getModules,
  getPersonas,
} from '@/lib/contentful/queries';

describe('CMS Query Functions (mock data mode)', () => {
  it('getSiteSettings returns valid settings', async () => {
    const settings = await getSiteSettings();
    expect(settings.phase).toBe('coming-soon');
    expect(settings.ctaType).toBe('schedule-meeting');
    expect(settings.showPricing).toBe(false);
  });

  it('getAnnouncementBar returns localized content for Hebrew', async () => {
    const bar = await getAnnouncementBar('he');
    expect(bar).not.toBeNull();
    expect(bar!.enabled).toBe(true);
    expect(bar!.message).toContain('RevBrain');
  });

  it('getAnnouncementBar returns localized content for English', async () => {
    const bar = await getAnnouncementBar('en');
    expect(bar).not.toBeNull();
    expect(bar!.message).toContain('launching soon');
  });

  it('getTestimonials returns all testimonials with resolved locale', async () => {
    const testimonials = await getTestimonials('en');
    expect(testimonials.length).toBe(4);
    expect(testimonials[0].name).toBe('Sarah Mitchell');
    expect(testimonials[0].role).toBe('Salesforce Architect');
    // Hebrew locale
    const heTestimonials = await getTestimonials('he');
    expect(heTestimonials[0].role).toBe('ארכיטקטית Salesforce');
  });

  it('getTeamMembers returns real team members', async () => {
    const members = await getTeamMembers('en');
    expect(members.length).toBe(2);
    expect(members[0].name).toBe('Ofir Cohen');
    expect(members[0].role).toBe('CEO & Co-Founder');
  });

  it('getFaqItems returns 7 items', async () => {
    const items = await getFaqItems('en');
    expect(items.length).toBe(7);
    expect(items[0].question).toContain('RevBrain');
  });

  it('getPricingPlans returns 2 plans', async () => {
    const plans = await getPricingPlans('en');
    expect(plans.length).toBe(2);
    expect(plans[0].name).toBe('Per Project');
    expect(plans[0].price).toBe(0);
  });

  it('getModules returns 10 modules', async () => {
    const modules = await getModules('en');
    expect(modules.length).toBe(10);
    expect(modules[0].name).toBe('CPQ Analysis');
    expect(modules[0].slug).toBe('cpq-analysis');
  });

  it('getPersonas returns 3 personas', async () => {
    const personas = await getPersonas('en');
    expect(personas.length).toBe(3);
    expect(personas[0].slug).toBe('si-partners');
  });

  it('locale fallback: Hebrew resolves correctly', async () => {
    const modules = await getModules('he');
    expect(modules[0].name).toBe('ניתוח CPQ');
  });
});

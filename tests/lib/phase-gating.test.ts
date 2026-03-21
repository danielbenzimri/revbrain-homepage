import { describe, it, expect } from 'vitest';
import { shouldShowSection, getCTAConfig } from '@/lib/phase-gating';
import { SITE_SETTINGS_DEFAULTS } from '@/constants/defaults';
import type { SiteSettings } from '@/types/app';

describe('shouldShowSection', () => {
  it('hides pricing in coming-soon phase (defaults)', () => {
    expect(shouldShowSection(SITE_SETTINGS_DEFAULTS, 'pricing')).toBe(false);
  });

  it('hides testimonials in defaults', () => {
    expect(shouldShowSection(SITE_SETTINGS_DEFAULTS, 'testimonials')).toBe(false);
  });

  it('shows pricing when toggled on', () => {
    const settings: SiteSettings = { ...SITE_SETTINGS_DEFAULTS, showPricing: true };
    expect(shouldShowSection(settings, 'pricing')).toBe(true);
  });

  it('shows testimonials when toggled on', () => {
    const settings: SiteSettings = { ...SITE_SETTINGS_DEFAULTS, showTestimonials: true };
    expect(shouldShowSection(settings, 'testimonials')).toBe(true);
  });

  it('hides login in coming-soon', () => {
    expect(shouldShowSection(SITE_SETTINGS_DEFAULTS, 'login')).toBe(false);
  });

  it('shows login when live', () => {
    const settings: SiteSettings = { ...SITE_SETTINGS_DEFAULTS, phase: 'live', showLogin: true };
    expect(shouldShowSection(settings, 'login')).toBe(true);
  });
});

describe('getCTAConfig', () => {
  it('returns schedule-meeting config for coming-soon', () => {
    const cta = getCTAConfig(SITE_SETTINGS_DEFAULTS, 'en');
    expect(cta.label).toBe('Schedule a Demo');
    expect(cta.url).toBe('/schedule');
  });

  it('returns Hebrew label for schedule-meeting', () => {
    const cta = getCTAConfig(SITE_SETTINGS_DEFAULTS, 'he');
    expect(cta.label).toBe('קבע הדגמה');
  });

  it('returns start-trial config', () => {
    const settings: SiteSettings = { ...SITE_SETTINGS_DEFAULTS, ctaType: 'start-trial' };
    const cta = getCTAConfig(settings, 'en');
    expect(cta.label).toBe('Start Free Trial');
    expect(cta.url).toContain('app.revbrain.ai');
  });

  it('returns join-waitlist config', () => {
    const settings: SiteSettings = { ...SITE_SETTINGS_DEFAULTS, ctaType: 'join-waitlist' };
    const cta = getCTAConfig(settings, 'en');
    expect(cta.label).toBe('Join the Waitlist');
  });
});

import { describe, it, expect } from 'vitest';
import {
  isValidLocale,
  getContentfulLocale,
  getDirection,
  getAlternateLocale,
  LOCALES,
} from '@/lib/locale';

describe('locale utilities', () => {
  describe('LOCALES', () => {
    it('contains he and en', () => {
      expect(LOCALES).toEqual(['he', 'en']);
    });
  });

  describe('isValidLocale', () => {
    it('returns true for he', () => {
      expect(isValidLocale('he')).toBe(true);
    });

    it('returns true for en', () => {
      expect(isValidLocale('en')).toBe(true);
    });

    it('returns false for fr', () => {
      expect(isValidLocale('fr')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidLocale('')).toBe(false);
    });

    it('returns false for Hebrew full locale code', () => {
      expect(isValidLocale('he-IL')).toBe(false);
    });
  });

  describe('getContentfulLocale', () => {
    it('maps he to he-IL', () => {
      expect(getContentfulLocale('he')).toBe('he-IL');
    });

    it('maps en to en-US', () => {
      expect(getContentfulLocale('en')).toBe('en-US');
    });
  });

  describe('getDirection', () => {
    it('returns rtl for he', () => {
      expect(getDirection('he')).toBe('rtl');
    });

    it('returns ltr for en', () => {
      expect(getDirection('en')).toBe('ltr');
    });
  });

  describe('getAlternateLocale', () => {
    it('returns en for he', () => {
      expect(getAlternateLocale('he')).toBe('en');
    });

    it('returns he for en', () => {
      expect(getAlternateLocale('en')).toBe('he');
    });
  });
});

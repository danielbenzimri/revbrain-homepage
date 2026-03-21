export const LOCALES = ['he', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

export function getContentfulLocale(locale: Locale): string {
  return locale === 'he' ? 'he-IL' : 'en-US';
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'he' ? 'en' : 'he';
}

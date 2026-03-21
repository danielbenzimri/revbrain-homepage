import type { Locale } from '@/lib/locale';

type LocalizedField = { 'he-IL'?: string; 'en-US': string };

/**
 * Extracts the correct locale value from an inline-localized field.
 * Falls back from he-IL -> en-US if the Hebrew value is missing.
 */
export function resolveLocale(field: LocalizedField | string, locale: Locale): string {
  if (typeof field === 'string') return field;
  const contentfulLocale = locale === 'he' ? 'he-IL' : 'en-US';
  return field[contentfulLocale] ?? field['en-US'] ?? '';
}

/**
 * Transforms a mock JSON entry with inline locales into a resolved app type.
 * Recursively resolves all localized fields for the given locale.
 */
export function resolveLocalizedEntry<T extends Record<string, unknown>>(
  entry: T,
  locale: Locale,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(entry)) {
    if (isLocalizedField(value)) {
      resolved[key] = resolveLocale(value as LocalizedField, locale);
    } else if (Array.isArray(value)) {
      resolved[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? resolveLocalizedEntry(item as Record<string, unknown>, locale)
          : item,
      );
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

function isLocalizedField(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('en-US' in (value as Record<string, unknown>) || 'he-IL' in (value as Record<string, unknown>))
  );
}

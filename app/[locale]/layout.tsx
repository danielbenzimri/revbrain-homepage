import { notFound } from 'next/navigation';
import { isValidLocale, getDirection, LOCALES } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { LegacyHashHandler } from '@/components/shared/LegacyHashHandler';

export function generateStaticParams(): Array<{ locale: string }> {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dir = getDirection(locale as Locale);

  return (
    <div lang={locale} dir={dir}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {locale === 'he' ? 'דלג לתוכן הראשי' : 'Skip to main content'}
      </a>
      <LegacyHashHandler />
      {children}
    </div>
  );
}

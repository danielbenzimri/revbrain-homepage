import type { Metadata } from 'next';
import type { Locale } from './locale';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://revbrain.ai';
const SITE_NAME = 'RevBrain';

const DEFAULT_DESCRIPTIONS = {
  he: 'כלי AI למיגרציה אוטומטית מ-Salesforce CPQ ל-Revenue Cloud Advanced. חסכו 90% מזמן המיגרציה.',
  en: 'AI-powered migration tool for Salesforce CPQ to Revenue Cloud Advanced. Automate 90% of the migration work.',
};

export function getPageMetadata({
  title,
  description,
  locale,
  path = '',
  noIndex = false,
}: {
  title: string;
  description?: string;
  locale: Locale;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = description || DEFAULT_DESCRIPTIONS[locale];
  const canonicalUrl = `${SITE_URL}/${locale}${path}`;
  return {
    title: fullTitle,
    description: desc,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        he: `${SITE_URL}/he${path}`,
        en: `${SITE_URL}/en${path}`,
        'x-default': `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      alternateLocale: locale === 'he' ? 'en_US' : 'he_IL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
    },
  };
}

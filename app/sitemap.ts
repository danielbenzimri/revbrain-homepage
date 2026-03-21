import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://revbrain.ai';
const LOCALES = ['he', 'en'];

// P0 static routes (no CMS-driven dynamic routes yet - those come in P1/P2)
const STATIC_ROUTES = ['', '/contact', '/schedule', '/privacy', '/terms', '/cookie-policy'];

// Pages excluded from sitemap (noindex)
const EXCLUDED = ['/thank-you'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    if (EXCLUDED.includes(route)) continue;

    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.7,
      });
    }
  }

  return entries;
}

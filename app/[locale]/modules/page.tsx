import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { getPageMetadata } from '@/lib/seo';
import { getModules } from '@/lib/contentful/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return getPageMetadata({
    title: locale === 'he' ? '20 מודולי חישוב' : '20 Calculation Modules',
    locale: locale as Locale,
    path: '/modules',
  });
}

const categoryLabels: Record<string, { he: string; en: string }> = {
  earthworks: { he: 'עבודות עפר', en: 'Earthworks' },
  structures: { he: 'מבנים', en: 'Structures' },
  infrastructure: { he: 'תשתיות', en: 'Infrastructure' },
  landscaping: { he: 'פיתוח ונוף', en: 'Landscaping' },
};

export default async function ModulesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const modules = await getModules(locale as Locale);
  const lang = locale as 'he' | 'en';

  // Group by category
  const grouped = modules.reduce(
    (acc, mod) => {
      const cat = mod.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(mod);
      return acc;
    },
    {} as Record<string, typeof modules>,
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
            {locale === 'he' ? '20 מודולי חישוב' : '20 Calculation Modules'}
          </h1>
          <p className="text-lg text-neutral-600">
            {locale === 'he'
              ? 'כיסוי מלא לתקנים הישראלים ולשיטות העבודה המקובלות'
              : 'Full coverage for Israeli standards and common workflows'}
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {Object.entries(grouped).map(([category, mods]) => (
            <div key={category}>
              <h2 className="mb-6 text-2xl font-bold text-neutral-900">
                {categoryLabels[category]?.[lang] || category}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mods
                  .sort((a, b) => a.order - b.order)
                  .map((mod) => (
                    <div
                      key={mod.slug}
                      className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
                    >
                      <h3 className="mb-2 font-semibold text-neutral-900">{mod.name}</h3>
                      <p className="text-sm text-neutral-600">{mod.summary}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

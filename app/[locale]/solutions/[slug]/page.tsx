import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale, LOCALES } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { getPageMetadata } from '@/lib/seo';
import { getPersonas, getModules } from '@/lib/contentful/queries';
import { Calendar } from 'lucide-react';

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const personas = await getPersonas('en');
  return LOCALES.flatMap((locale) => personas.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const personas = await getPersonas(locale as Locale);
  const persona = personas.find((p) => p.slug === slug);
  if (!persona) return {};
  return getPageMetadata({
    title: persona.name,
    description: persona.painPoints,
    locale: locale as Locale,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<React.ReactElement> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const [personas, allModules] = await Promise.all([
    getPersonas(locale as Locale),
    getModules(locale as Locale),
  ]);

  const persona = personas.find((p) => p.slug === slug);
  if (!persona) notFound();

  const featuredModules = allModules.filter((m) => persona.featuredModules.includes(m.slug));

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">{persona.name}</h1>
          <p className="mb-4 text-lg text-neutral-600">{persona.role}</p>
          <p className="text-neutral-500">{persona.painPoints}</p>
          <div className="mt-8">
            <Link
              href={`/${locale}${persona.ctaUrl}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
            >
              <Calendar className="h-5 w-5" />
              {persona.ctaLabel}
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900">
            {locale === 'he' ? 'יתרונות עיקריים' : 'Key Benefits'}
          </h2>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4">
            {persona.benefits.split('\n').map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4"
              >
                <span className="mt-0.5 text-lg text-primary-500">&#10003;</span>
                <span className="text-neutral-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Modules */}
        {featuredModules.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900">
              {locale === 'he' ? 'מודולים מומלצים' : 'Recommended Modules'}
            </h2>
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
              {featuredModules.map((mod) => (
                <div
                  key={mod.slug}
                  className="rounded-xl border border-neutral-200 bg-white p-4 text-center"
                >
                  <p className="font-medium text-neutral-900">{mod.name}</p>
                  <p className="mt-1 text-xs text-neutral-400">{mod.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

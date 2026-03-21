import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale } from '@/lib/locale';
import { getCTAConfig } from '@/lib/phase-gating';
import { getSiteSettings } from '@/lib/contentful/queries';
import { ContactForm } from '@/components/shared/ContactForm';
import { Calendar } from 'lucide-react';
import type { Locale } from '@/lib/locale';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const siteSettings = await getSiteSettings();
  const cta = getCTAConfig(siteSettings, locale as Locale);

  return (
    <div className="min-h-screen bg-white pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">
            {locale === 'he' ? 'צרו קשר' : 'Contact Us'}
          </h1>
          <p className="mb-8 text-lg text-neutral-600">
            {locale === 'he'
              ? 'נחזור אליכם תוך יום עסקים אחד'
              : "We'll get back to you within one business day"}
          </p>

          <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50 p-6 text-center">
            <p className="mb-4 text-neutral-700">
              {locale === 'he'
                ? 'רוצים לראות הדגמה חיה? קבעו פגישה'
                : 'Want a live demo? Schedule a meeting'}
            </p>
            <Link
              href={`/${locale}/schedule`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <Calendar className="h-4 w-4" />
              {cta.label}
            </Link>
          </div>

          <ContactForm locale={locale as Locale} />
        </div>
      </div>
    </div>
  );
}

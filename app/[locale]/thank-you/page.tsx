import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale } from '@/lib/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 text-5xl">&#10003;</div>
        <h1 className="mb-4 text-3xl font-bold text-neutral-900">
          {locale === 'he' ? 'תודה!' : 'Thank You!'}
        </h1>
        <p className="mb-8 text-lg text-neutral-600">
          {locale === 'he'
            ? 'קיבלנו את ההודעה שלכם ונחזור אליכם בהקדם.'
            : 'We received your message and will get back to you soon.'}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          {locale === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}

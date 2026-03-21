import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { getPageMetadata } from '@/lib/seo';
import { getPricingPlans } from '@/lib/contentful/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return getPageMetadata({
    title: locale === 'he' ? 'מחירים' : 'Pricing',
    locale: locale as Locale,
    path: '/pricing',
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const plans = await getPricingPlans(locale as Locale);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
            {locale === 'he' ? 'תמחור שקוף והוגן' : 'Transparent & Fair Pricing'}
          </h1>
          <p className="text-lg text-neutral-600">
            {locale === 'he'
              ? 'תמחור מבוסס פרויקט ותפקיד - שלמו רק על מה שאתם צריכים'
              : 'Project and role-based pricing — pay only for what you need'}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans
            .sort((a, b) => a.order - b.order)
            .map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'border-primary-500 bg-white shadow-lg ring-2 ring-primary-500'
                    : 'border-neutral-200 bg-white shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                    {locale === 'he' ? 'הכי פופולרי' : 'Most Popular'}
                  </span>
                )}
                <h2 className="text-2xl font-bold text-neutral-900">{plan.name}</h2>
                {plan.price > 0 ? (
                  <p className="mt-4 text-4xl font-bold text-neutral-900">
                    ${plan.price}
                    <span className="text-base font-normal text-neutral-500">
                      /{locale === 'he' ? 'חודש' : 'mo'}
                    </span>
                  </p>
                ) : (
                  <p className="mt-4 text-3xl font-bold text-neutral-900">
                    {locale === 'he' ? 'מותאם אישית' : 'Custom'}
                  </p>
                )}
                <ul className="mt-8 space-y-3">
                  {plan.features.split('\n').map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-0.5 text-primary-500">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}${plan.ctaUrl}`}
                  className={`mt-8 block rounded-lg px-6 py-3 text-center font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
        </div>

        {/* FAQ link */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600">
            {locale === 'he' ? 'יש שאלות? ' : 'Have questions? '}
            <Link
              href={`/${locale}/contact`}
              className="font-semibold text-primary-600 hover:underline"
            >
              {locale === 'he' ? 'צרו קשר' : 'Contact us'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { getPageMetadata } from '@/lib/seo';
import { shouldShowSection, getCTAConfig } from '@/lib/phase-gating';
import {
  getSiteSettings,
  getAnnouncementBar,
  getTestimonials,
  getTeamMembers,
  getFaqItems,
  getPricingPlans,
  getModules,
  getPersonas,
} from '@/lib/contentful/queries';
import { Calendar } from 'lucide-react';
import {
  JsonLd,
  getOrganizationSchema,
  getSoftwareApplicationSchema,
  getFaqSchema,
} from '@/components/shared/JsonLd';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { HEBREW_CONTENT, ENGLISH_CONTENT } from '@/constants/legacy-content';
import type { Language } from '@/types/legacy';

export const revalidate = false; // On-demand revalidation only

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return getPageMetadata({
    title:
      locale === 'he'
        ? 'RevBrain — מיגרציית Salesforce CPQ ל-Revenue Cloud עם AI'
        : 'RevBrain — AI-Powered Salesforce CPQ to Revenue Cloud Migration',
    locale: locale as Locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Parallel fetch all data - no waterfall
  const [
    siteSettings,
    announcement,
    testimonials,
    teamMembers,
    faqItems,
    pricingPlans,
    modules,
    personas,
  ] = await Promise.all([
    getSiteSettings(),
    getAnnouncementBar(locale),
    getTestimonials(locale),
    getTeamMembers(locale),
    getFaqItems(locale),
    getPricingPlans(locale),
    getModules(locale),
    getPersonas(locale),
  ]);

  const cta = getCTAConfig(siteSettings, locale);
  const lang: Language = locale;
  const legacyContent = locale === 'he' ? HEBREW_CONTENT : ENGLISH_CONTENT;

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getSoftwareApplicationSchema()} />
      {faqItems.length > 0 && (
        <JsonLd
          data={getFaqSchema(faqItems.map((f) => ({ question: f.question, answer: f.answer })))}
        />
      )}

      {/* Announcement Bar - fixed above header */}
      {announcement?.enabled && (
        <div className="fixed top-0 start-0 end-0 z-[60] bg-primary-700 px-4 py-2 text-center text-sm text-white">
          <span>{announcement.message}</span>
          {announcement.linkUrl && announcement.linkLabel && (
            <>
              {' · '}
              <Link href={announcement.linkUrl} className="font-semibold underline">
                {announcement.linkLabel}
              </Link>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <Header
        lang={lang}
        showLogin={shouldShowSection(siteSettings, 'login')}
        showSignup={shouldShowSection(siteSettings, 'signup')}
        ctaLabel={cta.label}
        ctaUrl={`/${locale}${cta.url}`}
        hasAnnouncementBar={announcement?.enabled ?? false}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/50 to-neutral-50/50 pb-24 pt-40 md:pt-48">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-neutral-900 md:text-6xl">
                {locale === 'he'
                  ? 'הפכו חודשים של מיגרציית CPQ ידנית לשבועות — עם AI'
                  : 'Turn months of manual CPQ migration into weeks — with AI'}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600 md:text-xl">
                {locale === 'he'
                  ? 'כלי AI שמאיץ מיגרציות מ-Salesforce CPQ ל-Revenue Cloud Advanced. אוטומציה של 90% מהעבודה, במיוחד עבור שותפי Salesforce.'
                  : 'AI-powered migration tool for Salesforce CPQ to Revenue Cloud Advanced. Automate 90% of the work, built for Salesforce partners.'}
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={`/${locale}${cta.url}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
                >
                  <Calendar className="h-5 w-5" />
                  {cta.label}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-16 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
              {locale === 'he' ? 'איך זה עובד' : 'How It Works'}
            </h2>
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-0">
              {[
                {
                  step: '1',
                  title: locale === 'he' ? 'חברו את Salesforce' : 'Connect Salesforce',
                  desc:
                    locale === 'he'
                      ? 'חברו את ה-Org שלכם בצורה מאובטחת'
                      : 'Securely connect your Salesforce org',
                },
                {
                  step: '2',
                  title: locale === 'he' ? 'ניתוח CPQ' : 'Analyze CPQ',
                  desc:
                    locale === 'he'
                      ? 'ניתוח אוטומטי של כל הקונפיגורציה'
                      : 'AI analyzes your entire CPQ configuration',
                },
                {
                  step: '3',
                  title: locale === 'he' ? 'מיגרציה אוטומטית' : 'Auto-Migrate',
                  desc:
                    locale === 'he'
                      ? 'המרה אוטומטית ל-Revenue Cloud'
                      : 'Automated conversion to Revenue Cloud',
                },
                {
                  step: '4',
                  title: locale === 'he' ? 'ולידציה ופריסה' : 'Validate & Deploy',
                  desc:
                    locale === 'he'
                      ? 'בדיקות שלמות ופריסה לייצור'
                      : 'Completeness testing & production deployment',
                },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center gap-0">
                  {/* Arrow before step (except first) - visible on desktop only */}
                  {index > 0 && (
                    <div className="hidden md:flex items-center px-4 text-neutral-300">
                      {locale === 'he' ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="rotate-180"
                        >
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="w-48 flex-shrink-0 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                      {item.step}
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-neutral-900">{item.title}</h3>
                    <p className="text-sm text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personas / Use Cases */}
        {personas.length > 0 && (
          <section id="features" className="bg-neutral-50 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-4 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
                {locale === 'he' ? 'פתרונות לכל סוג של שותף' : 'Built for Salesforce Partners'}
              </h2>
              <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-neutral-600">
                {locale === 'he'
                  ? 'בין אם אתם SI גדול, בוטיק או יועץ עצמאי — RevBrain מאיץ לכם את המיגרציה'
                  : 'Whether you are a large SI, boutique firm, or independent consultant — RevBrain accelerates your migrations'}
              </p>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                {personas.map((persona) => (
                  <div
                    key={persona.slug}
                    className="group rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary-200 hover:-translate-y-1"
                  >
                    <h3 className="mb-3 text-xl font-bold text-neutral-900">{persona.name}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-neutral-500 border-b border-neutral-100 pb-6">
                      {persona.painPoints}
                    </p>
                    <ul className="space-y-3">
                      {persona.benefits.split('\n').map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 text-xs">
                            &#10003;
                          </span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Modules Grid */}
        {modules.length > 0 && (
          <section id="modules" className="bg-white py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-4 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
                {locale === 'he' ? 'כלים לכל שלב במיגרציה' : 'Tools for Every Migration Phase'}
              </h2>
              <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-neutral-600">
                {locale === 'he'
                  ? 'מניתוח ראשוני ועד פריסה — RevBrain מלווה את כל התהליך'
                  : 'From initial analysis to deployment — RevBrain covers the entire process'}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {modules.map((mod) => (
                  <div
                    key={mod.slug}
                    className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-shadow hover:shadow-md"
                  >
                    <p className="text-sm font-medium text-neutral-900">{mod.name}</p>
                    <p className="mt-1 text-xs text-neutral-400">{mod.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team */}
        {teamMembers.length > 0 && (
          <section id="team" className="bg-neutral-50 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-4 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
                {locale === 'he' ? 'המייסדים' : 'The Founders'}
              </h2>
              <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-neutral-600">
                {locale === 'he'
                  ? 'צוות עם ניסיון עמוק ב-Salesforce ובהנדסת תוכנה'
                  : 'A team with deep Salesforce and software engineering experience'}
              </p>
              <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
                {teamMembers
                  .sort((a, b) => a.order - b.order)
                  .map((member) => (
                    <div
                      key={member.name}
                      className="group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all"
                    >
                      {member.image ? (
                        <div className="overflow-hidden">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-72 object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          />
                        </div>
                      ) : (
                        <div className="flex h-72 items-center justify-center bg-primary-50">
                          <span className="text-5xl font-bold text-primary-300">
                            {member.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </span>
                        </div>
                      )}
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-semibold text-neutral-900">{member.name}</h3>
                        <p className="mb-3 text-sm font-medium text-primary-600">{member.role}</p>
                        <p className="text-sm leading-relaxed text-neutral-600">{member.bio}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials - only show when >= 4 and toggle is on */}
        {shouldShowSection(siteSettings, 'testimonials') && testimonials.length >= 4 && (
          <section className="bg-white py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-16 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
                {locale === 'he' ? 'מה הלקוחות שלנו אומרים' : 'What Our Customers Say'}
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {testimonials
                  .filter((t) => t.featured)
                  .map((t) => (
                    <div
                      key={t.name}
                      className="rounded-2xl border border-neutral-200 bg-white p-8"
                    >
                      <p className="mb-6 text-lg leading-relaxed text-neutral-700">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div>
                        <p className="font-semibold text-neutral-900">{t.name}</p>
                        <p className="text-sm text-neutral-500">
                          {t.role}, {t.company}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing - phase gated */}
        {shouldShowSection(siteSettings, 'pricing') && pricingPlans.length > 0 && (
          <section id="pricing" className="bg-neutral-50 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-4 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
                {locale === 'he' ? 'תמחור שקוף והוגן' : 'Transparent & Fair Pricing'}
              </h2>
              <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                {pricingPlans
                  .sort((a, b) => a.order - b.order)
                  .map((plan) => (
                    <div
                      key={plan.name}
                      className={`rounded-2xl border bg-white p-8 ${
                        plan.highlighted
                          ? 'border-primary-500 shadow-lg ring-2 ring-primary-500'
                          : 'border-neutral-200 shadow-sm'
                      }`}
                    >
                      <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
                      {plan.price > 0 ? (
                        <p className="mt-2 text-3xl font-bold text-neutral-900">
                          ${plan.price}
                          <span className="text-base font-normal text-neutral-500">
                            /{locale === 'he' ? 'חודש' : 'mo'}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-2 text-2xl font-bold text-neutral-900">
                          {locale === 'he' ? 'מותאם אישית' : 'Custom'}
                        </p>
                      )}
                      <ul className="mt-6 space-y-3">
                        {plan.features.split('\n').map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                            <span className="mt-0.5 text-primary-500">&#10003;</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/${locale}${plan.ctaUrl}`}
                        className={`mt-8 block rounded-lg px-6 py-3 text-center text-sm font-semibold transition-colors ${
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
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqItems.length > 0 && (
          <section id="faq" className="bg-white py-20 md:py-28">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-16 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
                {locale === 'he' ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {faqItems
                  .sort((a, b) => a.order - b.order)
                  .map((item, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-neutral-200 bg-white"
                    >
                      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-lg font-medium text-neutral-900">
                        {item.question}
                        <span className="ms-4 transition-transform group-open:rotate-180">
                          &#9662;
                        </span>
                      </summary>
                      <div className="px-6 pb-4 text-neutral-600">{item.answer}</div>
                    </details>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-primary-600 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              {locale === 'he' ? 'מוכנים להתחיל?' : 'Ready to get started?'}
            </h2>
            <p className="mb-10 text-lg text-primary-100">
              {locale === 'he'
                ? 'קבעו הדגמה אישית וגלו איך RevBrain יכול לקצר לכם פרויקטי מיגרציה מחודשים לשבועות'
                : 'Schedule a personal demo and discover how RevBrain can shorten your migration projects from months to weeks'}
            </p>
            <Link
              href={`/${locale}${cta.url}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-lg transition-colors hover:bg-primary-50"
            >
              <Calendar className="h-5 w-5" />
              {cta.label}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer - still uses legacy content */}
      <Footer content={legacyContent} />
    </div>
  );
}

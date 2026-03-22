import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { getPageMetadata } from '@/lib/seo';
import { getTeamMembers } from '@/lib/contentful/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return getPageMetadata({
    title: locale === 'he' ? 'אודות' : 'About Us',
    description:
      locale === 'he'
        ? 'צוות עם ניסיון עמוק ב-Salesforce, Revenue Operations ובהנדסת תוכנה.'
        : 'A team with deep Salesforce, Revenue Operations and software engineering experience.',
    locale: locale as Locale,
    path: '/about',
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const teamMembers = await getTeamMembers(locale as Locale);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Company Story */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
            {locale === 'he' ? 'הסיפור שלנו' : 'Our Story'}
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600">
            {locale === 'he'
              ? 'RevBrain נולד מתוך הבנה עמוקה של הכאב שבמיגרציות Salesforce CPQ. אופיר כהן, מומחה Revenue Operations ותיק, ודניאל אבירם, מוביל טכנולוגי עם מעל 16 שנות ניסיון, הבינו שאפשר לפתור את הבעיה הזו עם AI — ולחסוך לשותפי Salesforce חודשים של עבודה ידנית.'
              : 'RevBrain was born from a deep understanding of the pain behind Salesforce CPQ migrations. Ofir Cohen, a seasoned Revenue Operations expert, and Daniel Aviram, a technology leader with over 16 years of experience, realized that AI could solve this problem — saving Salesforce partners months of manual work.'}
          </p>
        </div>

        {/* Values */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: locale === 'he' ? 'אוטומציה' : 'Automation',
              desc:
                locale === 'he'
                  ? '90% מעבודת המיגרציה מתבצעת אוטומטית. יותר זמן לדברים החשובים.'
                  : '90% of migration work is automated. More time for what matters.',
            },
            {
              title: locale === 'he' ? 'דיוק' : 'Accuracy',
              desc:
                locale === 'he'
                  ? 'Validation Suite מלא מוודא שלמות ותקינות של כל מיגרציה. אפס הפתעות.'
                  : 'Full Validation Suite ensures completeness and correctness of every migration. Zero surprises.',
            },
            {
              title: locale === 'he' ? 'לשותפים' : 'Partner-First',
              desc:
                locale === 'he'
                  ? 'נבנה במיוחד עבור שותפי Salesforce ויועצים. מאיץ פרויקטים ומשפר רווחיות.'
                  : 'Built specifically for Salesforce partners and consultants. Accelerates projects and improves profitability.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-neutral-200 bg-white p-8 text-center"
            >
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">{value.title}</h3>
              <p className="text-neutral-600">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mt-20">
          <h2 className="mb-4 text-center text-3xl font-bold text-neutral-900 md:text-4xl">
            {locale === 'he' ? 'הצוות' : 'The Team'}
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
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all"
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
                    <h3 className="text-xl font-semibold text-neutral-900">{member.name}</h3>
                    <p className="mb-4 text-sm font-medium text-primary-600">{member.role}</p>
                    <p className="text-sm leading-relaxed text-neutral-600">{member.bio}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-neutral-900">
          {locale === 'he' ? 'מדיניות עוגיות' : 'Cookie Policy'}
        </h1>
        <div className="prose prose-neutral max-w-none">
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            {locale === 'he'
              ? '⚠️ מסמך זה דורש סקירה משפטית לפני פרסום.'
              : '⚠️ This document requires legal review before publication.'}
          </p>
          <h2>{locale === 'he' ? 'מה הן עוגיות?' : 'What Are Cookies?'}</h2>
          <p>
            {locale === 'he'
              ? 'עוגיות הן קבצים קטנים המאוחסנים במכשיר שלכם כאשר אתם מבקרים באתר.'
              : 'Cookies are small files stored on your device when you visit a website.'}
          </p>
          <h2>{locale === 'he' ? 'איך אנחנו משתמשים בעוגיות' : 'How We Use Cookies'}</h2>
          <p>
            {locale === 'he'
              ? 'אנו משתמשים בשתי קטגוריות של עוגיות:'
              : 'We use two categories of cookies:'}
          </p>
          <ul>
            <li>
              <strong>{locale === 'he' ? 'הכרחיות' : 'Necessary'}</strong>:{' '}
              {locale === 'he'
                ? 'עוגיית שפה (locale) לזכירת העדפת השפה שלכם. תמיד פעילה.'
                : 'Locale cookie to remember your language preference. Always active.'}
            </li>
            <li>
              <strong>{locale === 'he' ? 'אנליטיקה' : 'Analytics'}</strong>:{' '}
              {locale === 'he'
                ? 'PostHog (מאוחסן באיחוד האירופי) לניתוח נתונים אנונימי. מופעלת רק לאחר הסכמתכם.'
                : 'PostHog (EU-hosted) for anonymous analytics. Only activated after your consent.'}
            </li>
          </ul>
          <h2>{locale === 'he' ? 'ניהול עוגיות' : 'Managing Cookies'}</h2>
          <p>
            {locale === 'he'
              ? 'תוכלו לשנות את העדפות העוגיות שלכם בכל עת דרך באנר העוגיות באתר.'
              : 'You can change your cookie preferences at any time through the cookie banner on the site.'}
          </p>
        </div>
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';

export default async function PrivacyPage({
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
          {locale === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
        </h1>
        <div className="prose prose-neutral max-w-none">
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            {locale === 'he'
              ? '⚠️ מסמך זה דורש סקירה משפטית לפני פרסום. הטקסט שלהלן הוא טיוטה ראשונית.'
              : '⚠️ This document requires legal review before publication. The text below is an initial draft.'}
          </p>
          <h2>{locale === 'he' ? 'מבוא' : 'Introduction'}</h2>
          <p>
            {locale === 'he'
              ? 'RevBrain ("אנחנו", "שלנו") מפעילה את revbrain.ai. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלכם.'
              : 'RevBrain ("we", "our") operates revbrain.ai. This policy explains how we collect, use, and protect your personal information.'}
          </p>
          <h2>{locale === 'he' ? 'מידע שאנו אוספים' : 'Information We Collect'}</h2>
          <p>
            {locale === 'he'
              ? 'אנו אוספים מידע שאתם מספקים לנו ישירות: שם, אימייל, חברה, וטלפון בעת מילוי טופס צור קשר.'
              : 'We collect information you provide directly: name, email, company, and phone when submitting a contact form.'}
          </p>
          <h2>{locale === 'he' ? 'עוגיות וניתוח נתונים' : 'Cookies & Analytics'}</h2>
          <p>
            {locale === 'he'
              ? 'אנו משתמשים ב-PostHog לניתוח נתונים אנונימי. עוגיות אנליטיקה מופעלות רק לאחר הסכמתכם. PostHog מאוחסן באיחוד האירופי.'
              : 'We use PostHog for anonymous analytics. Analytics cookies are only activated after your consent. PostHog is hosted in the EU.'}
          </p>
          <h2>{locale === 'he' ? 'יצירת קשר' : 'Contact Us'}</h2>
          <p>
            {locale === 'he'
              ? 'לשאלות בנוגע למדיניות זו, פנו אלינו: hello@revbrain.ai'
              : 'For questions about this policy, contact us: hello@revbrain.ai'}
          </p>
        </div>
      </div>
    </div>
  );
}

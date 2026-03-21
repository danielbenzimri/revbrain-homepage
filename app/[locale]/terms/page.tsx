import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';

export default async function TermsPage({
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
          {locale === 'he' ? 'תנאי שימוש' : 'Terms of Service'}
        </h1>
        <div className="prose prose-neutral max-w-none">
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            {locale === 'he'
              ? '⚠️ מסמך זה דורש סקירה משפטית לפני פרסום.'
              : '⚠️ This document requires legal review before publication.'}
          </p>
          <h2>{locale === 'he' ? 'תנאים כלליים' : 'General Terms'}</h2>
          <p>
            {locale === 'he'
              ? 'על ידי גישה לאתר revbrain.ai אתם מסכימים לתנאי שימוש אלו. אם אינכם מסכימים, אנא הימנעו משימוש באתר.'
              : 'By accessing revbrain.ai you agree to these terms of service. If you do not agree, please refrain from using the site.'}
          </p>
          <h2>{locale === 'he' ? 'שירותים' : 'Services'}</h2>
          <p>
            {locale === 'he'
              ? 'RevBrain מספקת פלטפורמת AI לאוטומציה של מיגרציות Salesforce CPQ ל-Revenue Cloud Advanced.'
              : 'RevBrain provides an AI platform for automating Salesforce CPQ to Revenue Cloud Advanced migrations.'}
          </p>
          <h2>{locale === 'he' ? 'יצירת קשר' : 'Contact'}</h2>
          <p>hello@revbrain.ai</p>
        </div>
      </div>
    </div>
  );
}

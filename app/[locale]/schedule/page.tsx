import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const calcomUsername = process.env.NEXT_PUBLIC_CALCOM_USERNAME || 'revbrain';

  return (
    <div className="min-h-screen bg-white pt-32">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900">
          {locale === 'he' ? 'קבעו הדגמה' : 'Schedule a Demo'}
        </h1>
        <p className="mb-8 text-lg text-neutral-600">
          {locale === 'he'
            ? 'בחרו מועד נוח ונראה לכם איך RevBrain יכול לקצר מיגרציות מחודשים לשבועות'
            : "Pick a convenient time and we'll show you how RevBrain can shorten migrations from months to weeks"}
        </p>
        <a
          href={`https://cal.com/${calcomUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
        >
          {locale === 'he' ? 'פתח את לוח הזמנים' : 'Open Scheduling Calendar'}
        </a>
        <p className="mt-6 text-sm text-neutral-500">
          {locale === 'he'
            ? 'הפגישה תיערך ב-Google Meet ותימשך כ-30 דקות'
            : 'The meeting will be held on Google Meet and last about 30 minutes'}
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/locale';
import type { Locale } from '@/lib/locale';
import { getPageMetadata } from '@/lib/seo';
import { Shield, Lock, Eye, Server, Users, FileCheck } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return getPageMetadata({
    title: locale === 'he' ? 'אבטחה ואמינות' : 'Security & Trust',
    locale: locale as Locale,
    path: '/security',
  });
}

const securityItems = [
  {
    icon: Lock,
    title: { he: 'הצפנה', en: 'Encryption' },
    desc: {
      he: 'כל הנתונים מוצפנים בתעבורה (TLS) ובמנוחה. אנו משתמשים בהצפנת AES-256.',
      en: 'All data encrypted in transit (TLS) and at rest. We use AES-256 encryption.',
    },
  },
  {
    icon: Users,
    title: { he: 'הרשאות מבוססות תפקידים', en: 'Role-Based Access Control' },
    desc: {
      he: 'כל משתמש רואה רק את מה שהוא מורשה. 10 רמות הרשאה שונות.',
      en: 'Every user sees only what they are authorized to. 10 different permission levels.',
    },
  },
  {
    icon: FileCheck,
    title: { he: 'מסלול ביקורת', en: 'Audit Trail' },
    desc: {
      he: 'כל שינוי מתועד. ניתן לחזור אחורה ולראות מי שינה מה ומתי.',
      en: 'Every change is logged. You can trace back who changed what and when.',
    },
  },
  {
    icon: Server,
    title: { he: 'אחסון נתונים', en: 'Data Hosting' },
    desc: {
      he: 'הנתונים מאוחסנים בתשתיות ענן מובילות עם גיבויים יומיים.',
      en: 'Data is stored on leading cloud infrastructure with daily backups.',
    },
  },
  {
    icon: Shield,
    title: { he: 'פרטיות', en: 'Privacy' },
    desc: {
      he: 'אנו מחויבים לפרטיות הנתונים שלכם. אנו לא מוכרים או משתפים מידע.',
      en: 'We are committed to your data privacy. We never sell or share information.',
    },
  },
  {
    icon: Eye,
    title: { he: 'שקיפות', en: 'Transparency' },
    desc: {
      he: 'מדיניות פרטיות ותנאי שימוש ברורים ונגישים.',
      en: 'Clear and accessible privacy policy and terms of service.',
    },
  },
];

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const lang = locale as 'he' | 'en';

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
            {locale === 'he' ? 'אבטחה ואמינות' : 'Security & Trust'}
          </h1>
          <p className="text-lg text-neutral-600">
            {locale === 'he'
              ? 'הנתונים שלכם בטוחים אצלנו. אנחנו לוקחים אבטחת מידע ברצינות.'
              : 'Your data is safe with us. We take information security seriously.'}
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title.en}
                className="rounded-2xl border border-neutral-200 bg-white p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900">{item.title[lang]}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{item.desc[lang]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

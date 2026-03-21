import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'RevBrain - AI-Powered Salesforce CPQ to Revenue Cloud Migration',
  description:
    'Automate 90% of your Salesforce CPQ to Revenue Cloud Advanced migration with AI. Built for Salesforce partners tackling complex migrations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html className={inter.variable} suppressHydrationWarning>
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['he', 'en'];

export function middleware(request: NextRequest): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;

  // Skip if already has locale prefix
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return;

  // Check cookie first (returning visitor)
  const savedLocale = request.cookies.get('locale')?.value;
  if (savedLocale && LOCALES.includes(savedLocale)) {
    const url = new URL(`/${savedLocale}${pathname}${request.nextUrl.search}`, request.url);
    const response = NextResponse.redirect(url);
    return response;
  }

  // Detect from Accept-Language, default to Hebrew (primary market)
  const acceptLang = request.headers.get('accept-language') || '';
  const locale = acceptLang.includes('he') ? 'he' : acceptLang.includes('en') ? 'en' : 'he';

  const url = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

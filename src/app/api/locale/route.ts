import { NextResponse, type NextRequest } from 'next/server';
import { LOCALE_COOKIE, LOCALES } from '@/lib/config';

// Changement de langue : /api/locale?lang=en&next=/pricing
export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang') ?? '';
  const next = request.nextUrl.searchParams.get('next') ?? '/';
  // Redirection uniquement vers un chemin interne (pas d'open redirect).
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  if ((LOCALES as readonly string[]).includes(lang)) {
    response.cookies.set(LOCALE_COOKIE, lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }
  return response;
}

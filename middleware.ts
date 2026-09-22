import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (
    hasLocale ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  // The catalog is Arabic-only content, so default every fresh visit to
  // Arabic rather than guessing from Accept-Language — English chrome
  // wrapped around all-Arabic products was inconsistent. Visitors can
  // still switch to EN manually via the locale switcher.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|.*\\..*).*)"],
};

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n/config";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Run next-intl middleware to resolve routing and locale headers
  const response = intlMiddleware(req);

  const pathname = nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

  // Protected paths
  const isProtectedPath =
    pathnameWithoutLocale.startsWith("/account") ||
    pathnameWithoutLocale.startsWith("/admin");

  if (isProtectedPath && !isLoggedIn) {
    const localeMatch = pathname.match(/^\/(ar|en)/);
    const locale = localeMatch ? localeMatch[1] : defaultLocale;

    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin path protection
  if (pathnameWithoutLocale.startsWith("/admin")) {
    const userRole = (req.auth?.user as any)?.role;
    if (userRole !== "ADMIN") {
      const localeMatch = pathname.match(/^\/(ar|en)/);
      const locale = localeMatch ? localeMatch[1] : defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|images|icons|fonts|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|google51d91d5f190c0676.html).*)",
  ],
};

export type Locale = "en" | "ar";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export const localePrefixes: Record<Locale, string> = {
  en: "en",
  ar: "ar",
};


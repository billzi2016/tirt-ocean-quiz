export type Locale = 'zh' | 'en';

export interface LocaleConfig {
  code: Locale;
  label: string;
  pathPrefix: string;
}

export const locales: LocaleConfig[] = [
  { code: 'en', label: 'en', pathPrefix: '' },
  { code: 'zh', label: 'zh', pathPrefix: '/zh' },
];

export const defaultLocale: Locale = 'en';

export function normalizeLocale(input: string | undefined): Locale {
  return locales.some((locale) => locale.code === input) ? (input as Locale) : defaultLocale;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const config = locales.find((item) => item.code === locale) ?? locales.find((item) => item.code === defaultLocale) ?? locales[0];
  return `${config.pathPrefix}${pathname}` || '/';
}

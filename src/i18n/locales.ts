export type Locale = 'zh' | 'en';

export interface LocaleConfig {
  code: Locale;
  label: string;
  pathPrefix: string;
}

export const locales: LocaleConfig[] = [
  { code: 'zh', label: 'zh', pathPrefix: '' },
  { code: 'en', label: 'en', pathPrefix: '/en' },
];

export const defaultLocale: Locale = 'zh';

export function normalizeLocale(input: string | undefined): Locale {
  return locales.some((locale) => locale.code === input) ? (input as Locale) : defaultLocale;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const config = locales.find((item) => item.code === locale) ?? locales[0];
  return `${config.pathPrefix}${pathname}` || '/';
}

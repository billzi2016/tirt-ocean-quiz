export type Locale = 'en' | 'zh' | 'es' | 'fr' | 'ja' | 'ru' | 'ko' | 'pt' | 'hi' | 'de';

export interface LocaleConfig {
  code: Locale;
  label: string;
  pathPrefix: string;
}

export const locales: LocaleConfig[] = [
  { code: 'en', label: 'EN', pathPrefix: '' },
  { code: 'zh', label: 'ZH', pathPrefix: '/zh' },
  { code: 'es', label: 'ES', pathPrefix: '/es' },
  { code: 'fr', label: 'FR', pathPrefix: '/fr' },
  { code: 'ja', label: 'JA', pathPrefix: '/ja' },
  { code: 'ru', label: 'RU', pathPrefix: '/ru' },
  { code: 'ko', label: 'KO', pathPrefix: '/ko' },
  { code: 'pt', label: 'PT', pathPrefix: '/pt' },
  { code: 'hi', label: 'HI', pathPrefix: '/hi' },
  { code: 'de', label: 'DE', pathPrefix: '/de' },
];

export const defaultLocale: Locale = 'en';

export function normalizeLocale(input: string | undefined): Locale {
  return locales.some((locale) => locale.code === input) ? (input as Locale) : defaultLocale;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const config = locales.find((item) => item.code === locale) ?? locales.find((item) => item.code === defaultLocale) ?? locales[0];
  return `${config.pathPrefix}${pathname}` || '/';
}

export const i18n = {
  defaultLocale: "uk",
  locales: ["uk", "ru", "ro"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

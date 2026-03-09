import type { Locale } from "./config";

const dictionaries = {
  uk: () => import("./dictionaries/uk.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  ro: () => import("./dictionaries/ro.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

import {
  dictionaries,
  type DictionaryKey,
} from "@/constants/i18n/dictionaries";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Language } from "@/lib/i18n/language-types";

export function useCopy<T extends DictionaryKey>(key: T) {
  const { language } = useLanguage();
  return dictionaries[key][language] as (typeof dictionaries)[T][Language];
}

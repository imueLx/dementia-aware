import {
  dictionaries,
  type DictionaryKey,
} from "@/constants/i18n/dictionaries";
import { useLanguage } from "@/lib/i18n/use-language";

export function useCopy<T extends DictionaryKey>(key: T) {
  const { language } = useLanguage();
  return dictionaries[key][language];
}

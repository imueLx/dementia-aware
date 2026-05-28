import { commonCopy } from "@/constants/i18n/common";
import { homeCopy } from "@/constants/i18n/home";
import { medicalCopy } from "@/constants/i18n/medical";
import { caregiverCopy } from "@/constants/i18n/caregiver";
import { dashboardCopy } from "@/constants/i18n/dashboard";
import { medicalResultsCopy } from "@/constants/i18n/medical-results";

export const dictionaries = {
  common: commonCopy,
  home: homeCopy,
  medical: medicalCopy,
  caregiver: caregiverCopy,
  dashboard: dashboardCopy,
  medicalResults: medicalResultsCopy,
} as const;

export type DictionaryKey = keyof typeof dictionaries;

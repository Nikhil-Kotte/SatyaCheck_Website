import { createContext } from "react";
import { HINDI_CONTENT } from "@/content.hi";
import { TELUGU_CONTENT } from "@/content.te";
import type { LanguageInfo, SiteContent } from "@/types";

// Helper to determine if a localized content object still has bracketed placeholders
export function containsPlaceholders(obj: unknown): boolean {
  const json = JSON.stringify(obj);
  return json.includes("[") && json.includes("]");
}

export const LANGUAGES: LanguageInfo[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    route: "/",
    isReady: true,
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    route: "/hi",
    isReady: !containsPlaceholders(HINDI_CONTENT),
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    route: "/te",
    isReady: !containsPlaceholders(TELUGU_CONTENT),
  },
];

export const LIVE_LANGUAGES = LANGUAGES.filter((l) => l.isReady);

export interface LanguageContextType {
  currentLang: string;
  languages: LanguageInfo[];
  liveLanguages: LanguageInfo[];
  content: SiteContent;
  switchLanguage: (code: string) => void;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

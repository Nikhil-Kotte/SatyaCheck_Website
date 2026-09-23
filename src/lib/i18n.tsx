import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CONTENT } from "@/content";
import { HINDI_CONTENT } from "@/content.hi";
import { TELUGU_CONTENT } from "@/content.te";
import {
  LANGUAGES,
  LIVE_LANGUAGES,
  LanguageContext,
  containsPlaceholders,
} from "./i18n-constants";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = useMemo(() => {
    if (location.pathname.startsWith("/hi")) return "hi";
    if (location.pathname.startsWith("/te")) return "te";
    return "en";
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const switchLanguage = (code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    if (!lang) return;
    if (lang.code === "en") navigate("/");
    else navigate(lang.route);
  };

  // Merge phase 1 translated fields into base English content
  const localizedContent = useMemo(() => {
    if (currentLang === "hi" && !containsPlaceholders(HINDI_CONTENT)) {
      return {
        ...CONTENT,
        hero: {
          ...CONTENT.hero,
          ...HINDI_CONTENT.hero,
        },
        waitlist: {
          ...CONTENT.waitlist,
          ...HINDI_CONTENT.waitlist,
        },
      };
    }
    if (currentLang === "te" && !containsPlaceholders(TELUGU_CONTENT)) {
      return {
        ...CONTENT,
        hero: {
          ...CONTENT.hero,
          ...TELUGU_CONTENT.hero,
        },
        waitlist: {
          ...CONTENT.waitlist,
          ...TELUGU_CONTENT.waitlist,
        },
      };
    }
    return CONTENT;
  }, [currentLang]);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        languages: LANGUAGES,
        liveLanguages: LIVE_LANGUAGES,
        content: localizedContent,
        switchLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

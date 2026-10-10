import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMassContent, languageOptions, type Language } from "../data/massParts";
const LanguageContext = createContext({ language: "en" as Language, setLanguage: (_: Language) => {} });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = getMassContent(language).languageCopy.pageTitle;
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
export function useMassContent() {
  const context = useContext(LanguageContext);
  return { ...getMassContent(context.language), ...context, languageOptions };
}

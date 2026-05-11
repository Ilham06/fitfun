"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { t as translate, getActivityLabel as getActivity } from "@/lib/i18n";

const LanguageContext = createContext({ lang: "id", setLang: () => {}, t: () => "" });

export function LanguageProvider({ children, initialLang = "id" }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lang="))
      ?.split("=")[1];
    if (stored && (stored === "id" || stored === "en")) {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    document.cookie = `lang=${newLang};path=/;max-age=${365 * 24 * 60 * 60}`;
    window.location.reload();
  };

  const tFn = (key, params) => translate(lang, key, params);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: tFn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

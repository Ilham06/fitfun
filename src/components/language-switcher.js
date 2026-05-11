"use client";

import { useLanguage } from "@/components/language-provider";
import { Globe, ChevronRight } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8F9FA] transition-colors border-b border-[#F0F0F0]"
    >
      <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center">
        <Globe size={16} className="text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-800">{t("language")}</div>
        <div className="text-[11px] text-gray-400">{t("language_desc")}</div>
      </div>
      <span className="text-xs font-bold text-[#2D9C7E] bg-[#E8F5F0] px-2.5 py-1 rounded-full">
        {lang === "id" ? "ID" : "EN"}
      </span>
    </button>
  );
}

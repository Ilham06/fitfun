"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const dismissed = localStorage.getItem("install-dismissed");
    const dismissedAt = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismiss = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

    if (daysSinceDismiss < 3) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (ios) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("install-dismissed", String(Date.now()));
  };

  if (!showPrompt || isStandalone) return null;

  const title = lang === "id" ? "Install FitScan" : "Install FitScan";
  const description =
    lang === "id"
      ? "Dapatkan pengalaman terbaik — akses cepat, notifikasi, dan mode offline"
      : "Get the best experience — fast access, notifications, and offline mode";
  const installBtn = lang === "id" ? "Install Sekarang" : "Install Now";
  const iosInstructions =
    lang === "id"
      ? 'Ketuk tombol "Share" lalu pilih "Add to Home Screen"'
      : 'Tap the "Share" button then select "Add to Home Screen"';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[61] animate-slide-up">
        <div className="bg-white rounded-t-[28px] px-6 pt-3 pb-8 shadow-2xl max-w-md mx-auto">
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={16} className="text-gray-500" />
          </button>

          {/* Icon + Content */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#2D9C7E] flex items-center justify-center shadow-lg mb-4">
              <span className="text-white font-black text-2xl">F</span>
            </div>

            <h3 className="font-black text-lg text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-[280px]">
              {description}
            </p>

            {/* Feature badges */}
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1.5 bg-[#E8F5F0] text-[#2D9C7E] text-[11px] font-bold rounded-full">
                {lang === "id" ? "Offline" : "Offline"}
              </span>
              <span className="px-3 py-1.5 bg-[#F3E8FF] text-[#7C3AED] text-[11px] font-bold rounded-full">
                {lang === "id" ? "Cepat" : "Fast"}
              </span>
              <span className="px-3 py-1.5 bg-[#FFF8E1] text-[#F59E0B] text-[11px] font-bold rounded-full">
                {lang === "id" ? "Notifikasi" : "Notifications"}
              </span>
            </div>

            {isIOS ? (
              <div className="mt-5 w-full">
                <div className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-2xl">
                  <Smartphone size={20} className="text-gray-500 flex-shrink-0" />
                  <p className="text-xs text-gray-600 text-left leading-relaxed">
                    {iosInstructions}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="mt-5 w-full py-4 bg-[#2D9C7E] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(45,156,126,0.3)] active:scale-[0.98] transition-transform"
              >
                <Download size={18} />
                {installBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

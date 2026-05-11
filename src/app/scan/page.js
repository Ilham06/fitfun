"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Flame, Droplets, Bell, Camera, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function ScanPage() {
  const [mode, setMode] = useState("food");
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const router = useRouter();
  const { t } = useLanguage();

  const openCamera = () => cameraRef.current?.click();
  const openGallery = () => galleryRef.current?.click();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;

      if (mode === "food") {
        try {
          const res = await fetch("/api/food/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          });
          const data = await res.json();
          if (data.items) {
            sessionStorage.setItem("scanResult", JSON.stringify(data.items));
            router.push("/scan/result");
          } else {
            alert(data.error || t("scan_failed"));
            setScanning(false);
          }
        } catch {
          alert(t("network_error"));
          setScanning(false);
        }
      } else {
        try {
          const res = await fetch("/api/body/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          });
          const data = await res.json();
          if (data.measurements) {
            sessionStorage.setItem("bodyScanResult", JSON.stringify(data.measurements));
            router.push("/scan/body-confirm");
          } else {
            alert(data.error || t("scan_failed"));
            setScanning(false);
          }
        } catch {
          alert(t("network_error"));
          setScanning(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 flex flex-col relative">
      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraRef}
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Loading Overlay */}
      {scanning && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
            <Loader2 size={40} className="text-[#2D9C7E] animate-spin" />
          </div>
          <h2 className="text-xl font-black text-gray-800">{t("analyzing_ai")}</h2>
          <p className="text-sm font-medium text-gray-500 mt-2 text-center px-8">
            {t("please_wait_scan")} {mode === "food" ? t("food") : t("body")} scan.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#F1F5F9]"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-[#F1F5F9]">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-gray-700">12</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-[#F1F5F9]">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-gray-700">230</span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#F1F5F9]">
              <Bell size={14} className="text-gray-600" />
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-black text-3xl text-gray-900 tracking-tight">{t("scan_earn")}</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">{t("what_scan_today")}</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="px-5 py-2">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("food")}
            className={`flex-1 flex flex-col items-center p-5 rounded-3xl border-2 transition-all bg-white ${mode === "food"
                ? "border-[#2D9C7E] shadow-md scale-[1.02]"
                : "border-[#F1F5F9] shadow-sm hover:border-[#2D9C7E]/50"
              }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 text-3xl transition-colors ${mode === "food" ? "bg-[#E8F5F0]" : "bg-gray-50"}`}>
              🍳
            </div>
            <span className="font-bold text-base text-gray-800">{t("food_scan")}</span>
            <span className="text-xs font-medium text-gray-400 mt-1 text-center leading-relaxed">
              {t("meals_or_barcodes")}
            </span>
            <span className={`mt-3 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${mode === "food" ? "bg-[#2D9C7E] text-white shadow-sm" : "bg-gray-100 text-gray-500"}`}>
              +10 XP
            </span>
          </button>

          <button
            onClick={() => setMode("body")}
            className={`flex-1 flex flex-col items-center p-5 rounded-3xl border-2 transition-all bg-white ${mode === "body"
                ? "border-[#7B5EA7] shadow-md scale-[1.02]"
                : "border-[#F1F5F9] shadow-sm hover:border-[#7B5EA7]/50"
              }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 text-3xl transition-colors ${mode === "body" ? "bg-[#F0EBF5]" : "bg-gray-50"}`}>
              🔱
            </div>
            <span className="font-bold text-base text-gray-800">{t("body_scan")}</span>
            <span className="text-xs font-medium text-gray-400 mt-1 text-center leading-relaxed">
              {t("photo_or_tape")}
            </span>
            <span className={`mt-3 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${mode === "body" ? "bg-[#7B5EA7] text-white shadow-sm" : "bg-gray-100 text-gray-500"}`}>
              +15 XP
            </span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-[#F1F5F9] flex flex-col gap-3">
          <button
            onClick={openCamera}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#2D9C7E] text-white font-bold text-base shadow-[0_8px_16px_rgba(45,156,126,0.25)] hover:bg-[#258C6E] transition-all"
          >
            <Camera size={20} strokeWidth={2.5} />
            {t("take_photo")}
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("or")}</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <button
            onClick={openGallery}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-gray-700 font-bold text-base border-2 border-[#E2E8F0] hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ImagePlus size={20} strokeWidth={2.5} className="text-gray-500" />
            {t("upload_gallery")}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

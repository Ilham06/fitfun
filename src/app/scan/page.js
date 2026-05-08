"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Flame, Droplets, Bell, Ruler, Flashlight, Loader2 } from "lucide-react";

export default function ScanPage() {
  const [mode, setMode] = useState("food");
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

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
            alert(data.error || "Scan failed");
            setScanning(false);
          }
        } catch {
          alert("Network error");
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
            alert(data.error || "Scan failed");
            setScanning(false);
          }
        } catch {
          alert("Network error");
          setScanning(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24 flex flex-col">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1.5 shadow-sm">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-gray-700">12</span>
            </div>
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1.5 shadow-sm">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-gray-700">230</span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Bell size={14} className="text-gray-600" />
            </div>
          </div>
        </div>
        <div className="ml-1">
          <h1 className="font-black text-2xl text-gray-800">Scan & Earn</h1>
          <p className="text-xs text-gray-500 mt-0.5">What would you like to scan?</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="px-5 py-3">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("food")}
            className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all bg-white ${
              mode === "food"
                ? "border-[#2D9C7E] shadow-md"
                : "border-transparent shadow-sm"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#E8F5F0] flex items-center justify-center mb-2 text-2xl">
              🍳
            </div>
            <span className="font-bold text-sm text-gray-800">Food Scan</span>
            <span className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">
              Camera, gallery
              <br />or barcode
            </span>
            <span className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-[#E8F5F0] text-[#2D9C7E]">
              +10 XP
            </span>
          </button>
          <button
            onClick={() => setMode("body")}
            className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all bg-white ${
              mode === "body"
                ? "border-[#7B5EA7] shadow-md"
                : "border-transparent shadow-sm"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#F0EBF5] flex items-center justify-center mb-2 text-2xl">
              🔱
            </div>
            <span className="font-bold text-sm text-gray-800">Body Scan</span>
            <span className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">
              Photo or tape
              <br />measurement
            </span>
            <span className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-[#F0EBF5] text-[#7B5EA7]">
              +15 XP
            </span>
          </button>
        </div>
      </div>

      {/* Viewfinder */}
      <div className="px-5 flex-1">
        <div className="relative w-full aspect-[3/4] bg-[#1A2332] rounded-3xl overflow-hidden flex flex-col items-center justify-center">
          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-10 h-10 border-t-[3px] border-l-[3px] border-[#2D9C7E] rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-10 h-10 border-t-[3px] border-r-[3px] border-[#2D9C7E] rounded-tr-lg" />
          <div className="absolute bottom-20 left-6 w-10 h-10 border-b-[3px] border-l-[3px] border-[#2D9C7E] rounded-bl-lg" />
          <div className="absolute bottom-20 right-6 w-10 h-10 border-b-[3px] border-r-[3px] border-[#2D9C7E] rounded-br-lg" />

          {scanning ? (
            <>
              <Loader2 size={40} className="text-[#2D9C7E] animate-spin mb-4" />
              <p className="text-white/70 text-sm font-medium">Analyzing with AI...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20">
                <span className="text-4xl">
                  {mode === "food" ? "🍜" : "📏"}
                </span>
              </div>
              <p className="text-white/70 text-sm text-center px-10 font-medium">
                {mode === "food"
                  ? "Point camera at food\nor barcode"
                  : "Point camera at tape\nmeasure or note"}
              </p>
            </>
          )}

          {/* Bottom action */}
          <button
            onClick={handleCapture}
            disabled={scanning}
            className="absolute bottom-6 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center disabled:opacity-50"
          >
            <Flashlight size={22} className="text-white/80" />
          </button>
        </div>
      </div>

      {/* Capture Button */}
      <div className="py-4 flex items-center justify-center">
        <button
          onClick={handleCapture}
          disabled={scanning}
          className="w-16 h-16 rounded-full bg-[#2D9C7E] flex items-center justify-center shadow-[0_4px_20px_rgba(45,156,126,0.4)] hover:bg-[#258C6E] transition-colors disabled:opacity-60 border-4 border-[#E8F5F0]"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

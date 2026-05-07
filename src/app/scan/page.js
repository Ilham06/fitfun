"use client";

import Link from "next/link";
import { useState } from "react";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Camera, Image, Zap, Apple, Ruler } from "lucide-react";

export default function ScanPage() {
  const [mode, setMode] = useState("food");

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-text" />
          </Link>
          <h1 className="font-bold text-xl text-text">Scan</h1>
        </div>
        <p className="text-xs text-muted ml-12">What would you like to scan?</p>
      </div>

      {/* Mode Toggle Cards */}
      <div className="px-5 py-4">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("food")}
            className={`flex-1 flex flex-col items-center p-5 rounded-2xl border-2 transition-all bg-white ${
              mode === "food"
                ? "border-[#2D9C7E] shadow-md"
                : "border-transparent shadow-sm hover:border-[#2D9C7E]/30"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#E8F5F0] flex items-center justify-center mb-3">
              <Apple size={24} className="text-[#2D9C7E]" />
            </div>
            <span className="font-bold text-sm text-text">Food Scan</span>
            <span className="text-[11px] text-muted mt-1 text-center">
              Camera, gallery or barcode
            </span>
            <span className="mt-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(45,156,126,0.1)] text-[#2D9C7E]">
              GPT-4o Vision
            </span>
          </button>
          <button
            onClick={() => setMode("body")}
            className={`flex-1 flex flex-col items-center p-5 rounded-2xl border-2 transition-all bg-white ${
              mode === "body"
                ? "border-[#7B5EA7] shadow-md"
                : "border-transparent shadow-sm hover:border-[#7B5EA7]/30"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#F0EBF5] flex items-center justify-center mb-3">
              <Ruler size={24} className="text-[#7B5EA7]" />
            </div>
            <span className="font-bold text-sm text-text">Body Scan</span>
            <span className="text-[11px] text-muted mt-1 text-center">
              Photo of tape or note
            </span>
            <span className="mt-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(123,94,167,0.1)] text-[#7B5EA7]">
              GPT-4o Vision
            </span>
          </button>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="px-5 flex-1">
        <div className="relative w-full aspect-[3/4] bg-[#1E2A2A] rounded-3xl overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-8 left-8 w-8 h-8 border-t-[3px] border-l-[3px] border-white/50 rounded-tl-xl" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-[3px] border-r-[3px] border-white/50 rounded-tr-xl" />
          <div className="absolute bottom-16 left-8 w-8 h-8 border-b-[3px] border-l-[3px] border-white/50 rounded-bl-xl" />
          <div className="absolute bottom-16 right-8 w-8 h-8 border-b-[3px] border-r-[3px] border-white/50 rounded-br-xl" />

          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
            {mode === "food" ? (
              <Apple size={36} className="text-white/50" />
            ) : (
              <Ruler size={36} className="text-white/50" />
            )}
          </div>

          <p className="text-white/60 text-sm text-center px-8">
            {mode === "food"
              ? "Point camera at food or barcode"
              : "Point camera at tape measure or note"}
          </p>
        </div>
      </div>

      {/* Capture Button */}
      <div className="py-5 flex items-center justify-center gap-6">
        <button className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
          <Image size={20} className="text-muted" />
        </button>
        <Link
          href={mode === "food" ? "/scan/result" : "/scan/body-confirm"}
          className="w-16 h-16 rounded-full bg-[#2D9C7E] flex items-center justify-center shadow-[0_4px_14px_rgba(45,156,126,0.4)] hover:bg-[#258C6E] transition-colors"
        >
          <Camera size={26} className="text-white" />
        </Link>
        <button className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
          <Zap size={20} className="text-muted" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import BottomNav from "@/components/bottom-nav";

export default function ScanPage() {
  const [mode, setMode] = useState("food"); // "food" | "body"

  return (
    <div className="min-h-screen bg-bg pb-28 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-xl font-black text-text">Scan</h1>
        <p className="text-xs text-muted mt-1">
          Take a photo or select from gallery
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="px-5 mb-5">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("food")}
            className={`flex-1 flex flex-col items-center p-5 rounded-[14px] border-2 transition-all ${
              mode === "food"
                ? "border-food bg-[rgba(45,156,126,0.06)]"
                : "border-border bg-surface2 hover:border-food/30"
            }`}
          >
            <span className="text-3xl mb-2">🍎</span>
            <span className="font-bold text-sm">Food Scan</span>
            <span className="text-[11px] text-muted mt-1">
              Camera, gallery or barcode
            </span>
            <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(45,156,126,0.1)] text-food">
              GPT-4o Vision
            </span>
          </button>
          <button
            onClick={() => setMode("body")}
            className={`flex-1 flex flex-col items-center p-5 rounded-[14px] border-2 transition-all ${
              mode === "body"
                ? "border-body bg-[rgba(123,94,167,0.06)]"
                : "border-border bg-surface2 hover:border-body/30"
            }`}
          >
            <span className="text-3xl mb-2">📏</span>
            <span className="font-bold text-sm">Body Scan</span>
            <span className="text-[11px] text-muted mt-1">
              Photo of tape or note
            </span>
            <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(123,94,167,0.1)] text-body">
              GPT-4o Vision
            </span>
          </button>
        </div>
      </div>

      {/* Camera Viewfinder (mock) */}
      <div className="px-5 flex-1">
        <div className="relative w-full aspect-[3/4] bg-[#1a1a1a] rounded-[22px] overflow-hidden flex items-center justify-center">
          {/* Viewfinder overlay */}
          <div className="absolute inset-6 border-2 border-white/20 rounded-xl" />
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br-lg" />

          {/* Center icon */}
          <div className="text-white/40 text-5xl">
            {mode === "food" ? "🍽️" : "📐"}
          </div>

          {/* Hint text */}
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="text-white/60 text-xs">
              {mode === "food"
                ? "Point camera at food or barcode"
                : "Point camera at tape measure or note"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-5 flex items-center justify-center gap-6">
        <button className="w-12 h-12 rounded-xl bg-surface border border-border2 flex items-center justify-center text-lg shadow-sm">
          🖼️
        </button>
        <Link
          href={mode === "food" ? "/scan/result" : "/scan/body-confirm"}
          className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl shadow-[0_4px_14px_rgba(217,95,43,0.35)] hover:bg-[#C4501E] transition-colors"
        >
          📷
        </Link>
        <button className="w-12 h-12 rounded-xl bg-surface border border-border2 flex items-center justify-center text-lg shadow-sm">
          🔍
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

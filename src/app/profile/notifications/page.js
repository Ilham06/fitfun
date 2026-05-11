"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [permission, setPermission] = useState("default");
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function handleEnable() {
    if (!("Notification" in window)) return;
    setRegistering(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          await navigator.serviceWorker.ready;
          registration.active?.postMessage({
            type: "FIREBASE_CONFIG",
            config: {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            },
          });
        }
        const { requestNotificationToken } = await import("@/lib/firebase");
        const token = await requestNotificationToken();
        if (token) {
          await fetch("/api/notifications/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        }
        setSuccess(true);
      }
    } catch {
    } finally {
      setRegistering(false);
    }
  }

  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <div className="px-5 pt-12 pb-6">
        <Link
          href="/profile"
          className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#F0F0F0]"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </Link>
        <div className="mt-4">
          <h1 className="font-black text-2xl text-[#1E293B]">{t("notifications")}</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">{t("notifications_desc")}</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isGranted ? "bg-[#E8F5F0]" : "bg-[#F5F5F5]"}`}>
              {isGranted ? (
                <Bell size={22} className="text-[#2D9C7E]" />
              ) : (
                <BellOff size={22} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-gray-800">{t("notif_push_title")}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t("notif_push_desc")}</div>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                isGranted ? "bg-[#E8F5F0] text-[#2D9C7E]" : "bg-[#F5F5F5] text-gray-400"
              }`}
            >
              {isGranted ? t("notif_active") : t("notif_inactive")}
            </span>
          </div>

          {isDenied && (
            <div className="mt-4 p-3 bg-[#FFF3E0] rounded-2xl">
              <p className="text-xs text-[#F59E0B] font-medium">{t("notif_blocked")}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-[#E8F5F0] rounded-2xl">
              <p className="text-xs text-[#2D9C7E] font-medium">{t("notif_enabled_success")}</p>
            </div>
          )}
        </div>

        {!isGranted && !isDenied && (
          <button
            onClick={handleEnable}
            disabled={registering}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#2D9C7E] text-white text-sm font-bold shadow-[0_4px_14px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors disabled:opacity-60"
          >
            <Bell size={16} />
            {registering ? t("loading") : t("notif_enable")}
          </button>
        )}
      </div>
    </div>
  );
}

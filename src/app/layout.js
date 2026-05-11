import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NotificationPrompt from "@/components/notification-prompt";
import InstallPrompt from "@/components/install-prompt";
import { LanguageProvider } from "@/components/language-provider";
import { getLang } from "@/lib/get-lang";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "FitScan",
  description:
    "AI-powered nutrition tracking & body measurement PWA — scan food, track macros, measure progress.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitScan",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2D9C7E",
};

export default async function RootLayout({ children }) {
  const lang = await getLang();

  return (
    <html lang={lang} className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen antialiased">
        <LanguageProvider initialLang={lang}>
          <NotificationPrompt />
          <InstallPrompt />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

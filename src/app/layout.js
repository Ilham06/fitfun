import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NotificationPrompt from "@/components/notification-prompt";
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
};

export default async function RootLayout({ children }) {
  const lang = await getLang();

  return (
    <html lang={lang} className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen antialiased">
        <LanguageProvider initialLang={lang}>
          <NotificationPrompt />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

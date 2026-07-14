import type { Metadata } from "next";
import { Playfair_Display, Inter, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import "./components.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { LocaleProvider } from "@/i18n/client";
import { getT } from "@/i18n/server";
import { dir } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ChatWidget from "@/components/chat/ChatWidget";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic"], weight: ["500", "600", "700"], display: "swap" });
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic"], weight: ["400", "500", "700"], display: "swap" });

const SITE_URL = "https://mjq-investments.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luxury.ae — Premium Beauty, Hair & Personal Care in the UAE",
    template: "%s · Luxury.ae",
  },
  description:
    "Luxury.ae is a curated shopping and brand-discovery platform for premium beauty, hair care and grooming in the UAE. Authentic Marvis, Fino and Proraso, beautifully delivered.",
  openGraph: {
    title: "Luxury.ae — Premium Beauty & Personal Care in the UAE",
    description: "A curated destination for the world's most coveted grooming, hair and oral-care houses.",
    url: SITE_URL, siteName: "Luxury.ae", locale: "en_AE", type: "website",
  },
  robots: { index: true, follow: true },
};

const themeInit = `(function(){try{var t=localStorage.getItem('luxae-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getT();
  const fontVars = `${playfair.variable} ${inter.variable} ${cairo.variable} ${tajawal.variable}`;

  return (
    <html lang={locale} dir={dir(locale)} data-theme="light" className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <CartProvider>
            <ScrollReveal />
            <a href="#main" className="skip-link">{t("common.skip")}</a>
            <Header />
            {children}
            <Footer />
            <ChatWidget />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

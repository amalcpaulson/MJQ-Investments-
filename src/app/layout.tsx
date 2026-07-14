import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import "./components.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://luxury-ae.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luxury.ae — Premium Beauty, Hair & Personal Care in the UAE",
    template: "%s · Luxury.ae",
  },
  description:
    "Luxury.ae is a curated shopping and brand-discovery platform for premium beauty, hair care and grooming in the UAE. Authentic Marvis, Fino and Proraso, beautifully delivered.",
  keywords: [
    "Luxury.ae", "luxury beauty UAE", "Marvis toothpaste UAE",
    "Fino hair care", "Proraso grooming", "premium personal care Dubai",
  ],
  openGraph: {
    title: "Luxury.ae — Premium Beauty & Personal Care in the UAE",
    description:
      "A curated destination for the world's most coveted grooming, hair and oral-care houses — authentic and effortless.",
    url: SITE_URL,
    siteName: "Luxury.ae",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury.ae — Premium Beauty & Personal Care in the UAE",
    description: "Curated luxury beauty, hair and grooming, delivered across the UAE.",
  },
  robots: { index: true, follow: true },
};

// Set the saved theme before paint to avoid a flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem('luxae-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <a href="#collection" className="skip-link">Skip to products</a>
        {children}
      </body>
    </html>
  );
}

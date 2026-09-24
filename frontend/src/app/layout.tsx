import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { SITE_URL } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SparkWave Digital Systems — Digital Product, AI, Automation & Growth Partner",
    template: "%s · SparkWave Digital Systems",
  },
  description:
    "We design, develop, automate and grow digital products — custom software, web and mobile apps, AI solutions, business automation and digital marketing.",
  applicationName: "SparkWave Digital Systems",
};

export const viewport: Viewport = {
  themeColor: "#080A12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

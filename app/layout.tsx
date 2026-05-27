import { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "../components/SmoothScroll";
import PerformanceMonitor from "../components/PerformanceMonitor";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.doeja.me"),
  title: "DoeJÁ - Conectando doadores de alimentos a ONGs",
  description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Seu gesto pode mudar histórias.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} font-sans`}>
      <body>
        <SmoothScroll />
        <PerformanceMonitor />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

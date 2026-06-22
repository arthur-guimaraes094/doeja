import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "../components/SmoothScroll";
import PerformanceMonitor from "../components/PerformanceMonitor";
import PersistentBackground from "../components/PersistentBackground";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.doeja.me"),
  title: "DoeJÁ - Conectando doadores de alimentos a ONGs",
  description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Seu gesto pode mudar histórias.",
  keywords: [
    "doação de alimentos",
    "combate à fome",
    "ong de alimentos",
    "doar comida",
    "solidariedade",
    "DoeJÁ",
    "segurança alimentar",
    "instituições de caridade"
  ],
  openGraph: {
    title: "DoeJÁ - Conectando doadores de alimentos a ONGs",
    description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Seu gesto pode mudar histórias.",
    url: "https://www.doeja.me",
    siteName: "DoeJÁ",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "DoeJÁ - Conectando doadores de alimentos a ONGs"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DoeJÁ - Conectando doadores de alimentos a ONGs",
    description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Seu gesto pode mudar histórias.",
    images: ["/twitter-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SmoothScroll />
        <PerformanceMonitor />
        <PersistentBackground />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

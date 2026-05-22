import { Fredoka, Lilita_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka-next",
});

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita-next",
});

export const metadata = {
  title: "DoeJÁ - Conectando doadores de alimentos a ONGs",
  description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Seu gesto pode mudar histórias.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${lilitaOne.variable} theme-organic`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

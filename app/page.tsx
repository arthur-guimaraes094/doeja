import React from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HeartHandshakeIcon } from "../components/Icons";
import HeroSection from "../components/HeroSection";

export const metadata = {
  title: "DoeJÁ - Seu gesto pode mudar histórias",
  description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Apoie comunidades carentes e evite o desperdício de comida.",
  openGraph: {
    title: "DoeJÁ - Seu gesto pode mudar histórias",
    description: "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Apoie comunidades carentes e evite o desperdício de comida.",
    images: [{ url: "/logo.svg" }],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "DoeJÁ",
    "url": "https://www.doeja.me",
    "logo": "https://www.doeja.me/logo.svg",
    "description": "Facilitamos a conexão rápida e segura entre doadores de alimentos e ONGs locais. Seu gesto pode mudar histórias.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "knowsAbout": [
      "Doação de Alimentos",
      "Segurança Alimentar",
      "Combate à Fome",
      "Solidariedade",
      "ONGs de Caridade"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <Header />

      <main className="relative min-h-screen flex flex-col items-center pt-md md:pt-0 text-on-surface overflow-hidden">
        {/* Global background floating animation is rendered persistently by layout.tsx */}

        {/* Hero Section */}
        <HeroSection />

        {/* Bento Grid Section (Value Props) */}
        <section className="relative z-10 w-full max-w-7xl px-margin-mobile md:px-margin-desktop py-xl mt-lg grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Card 1 (colspan-2) - Soft Green */}
          <div className="md:col-span-2 tactile-card bg-[#edf2e2] border border-primary/15 p-lg rounded-[32px] flex flex-col md:flex-row items-center gap-lg shadow-lg">
            <div className="flex-1 space-y-md text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary">
                Transparência Total
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Acompanhe cada centavo da sua doação. Relatórios detalhados e
                fotos do impacto real nas comunidades atendidas.
              </p>
            </div>
            <Image
              src="/transparencia.webp"
              alt="Ilustração de Transparência Total"
              width={300}
              height={224}
              className="shrink-0 object-contain"
              style={{ width: "150px", height: "auto" }}
            />
          </div>

          {/* Card 2 - Soft Orange */}
          <div className="tactile-card bg-surface-container-low border border-secondary/15 p-lg rounded-[32px] flex flex-col justify-between text-left gap-md shadow-lg min-h-[280px]">
            <div className="space-y-md">
              <Image
                src="/coracao-verificado.webp"
                alt="Selo de ONG Verificada"
                width={300}
                height={224}
                className="object-contain"
                style={{ width: "86px", height: "auto" }}
              />
              <h3 className="font-display text-xl md:text-2xl font-bold text-secondary">
                ONGs Verificadas
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Trabalhamos apenas com instituições auditadas e com histórico
                comprovado de impacto social.
              </p>
            </div>
          </div>

          {/* Card 3 - Soft Green */}
          <div className="tactile-card bg-[#edf2e2] border border-primary/15 p-lg rounded-[32px] flex flex-col justify-between text-left gap-md shadow-lg min-h-[280px]">
            <div className="space-y-md">
              <Image
                src="/comunidade.webp"
                alt="Ilustração de Comunidade Viva"
                width={300}
                height={224}
                className="object-contain"
                style={{ width: "86px", height: "auto" }}
              />
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
                Comunidade Viva
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Junte-se e vamos juntos
                transformar o Brasil.
              </p>
            </div>
          </div>

          {/* Card 4 (colspan-2) - Soft Orange */}
          <div className="md:col-span-2 tactile-card bg-surface-container-low border border-secondary/15 p-lg rounded-[32px] flex flex-col md:flex-row-reverse items-center gap-lg shadow-lg">
            <div className="flex-1 space-y-md text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-secondary">
                Seja um Parceiro
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Sua empresa pode fazer a diferença. Conheça nossos planos
                corporativos de responsabilidade social.
              </p>
              <div className="inline-block">
                <button className="bg-secondary text-white px-8 py-3 rounded-full font-label-md hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer">
                  Saber Mais
                </button>
              </div>
            </div>
            <Image
              src="/parceria.webp"
              alt="Ilustração de Parceria"
              width={300}
              height={224}
              className="shrink-0 object-contain"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
        </section>

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-margin-mobile right-margin-mobile md:bottom-md md:right-md z-50">
          <button className="bg-secondary text-white px-5 py-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-sm cursor-pointer hover:shadow-secondary/20">
            <HeartHandshakeIcon size={24} aria-hidden="true" />
            <span className="font-label-md hidden md:block">Doar Agora</span>
          </button>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

"use client";

import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import Parallax from "../components/Parallax";
import { HeartHandshakeIcon } from "../components/Icons";
import FloatingVegetables2D from "../components/FloatingVegetables2D";
import { gsap, useGSAP } from "@/lib/gsap";
import Magnetic from "../components/Magnetic";
import SplitText from "../components/SplitText";
import ImageReveal from "../components/ImageReveal";
import Preloader from "../components/Preloader";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [preloaderActive, setPreloaderActive] = useState(true);

  useGSAP(() => {
    if (preloaderActive) return;

    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.35
    )
      .fromTo(
        ".hero-logo",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "back.out(1.5)" },
        "-=0.6"
      )
      .fromTo(
        ".hero-button",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.6"
      );
  }, { scope: containerRef, dependencies: [preloaderActive] });

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
      {/* Awwwards Intro Preloader */}
      <Preloader onComplete={() => setPreloaderActive(false)} />

      {/* Header */}
      <Header />

      <main ref={containerRef} className="relative min-h-screen flex flex-col items-center pt-md md:pt-0 text-on-surface overflow-hidden">
        {/* Global background floating animation */}
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-85">
          <FloatingVegetables2D />
        </div>

        {/* Hero Section */}
        <section className="relative w-full min-h-0 h-[calc(100svh-72px)] md:h-[calc(100vh-72px)] flex items-center justify-center py-4 md:py-8 z-10">
          <div className="relative z-10 max-w-4xl px-margin-mobile text-center space-y-sm md:space-y-lg w-full flex flex-col items-center">
            <div className="space-y-sm md:space-y-md">
              <h1 className="font-display text-[40px] md:text-[48px] font-bold leading-tight text-on-background">
                <SplitText text="Seu gesto pode mudar histórias" start={!preloaderActive} />
              </h1>
              <p className="hero-subtitle font-headline-md text-[20px] md:text-[24px] text-on-surface" style={{ opacity: 0 }}>
                <span className="text-primary font-extrabold">Doe</span>
                <span className="text-secondary font-extrabold">JÁ</span> e leve
                mais do que alimento, leve{" "}
                <span className="text-primary font-extrabold">cuidado</span> e{" "}
                <span className="text-primary font-extrabold">esperança</span>.
              </p>
            </div>

            <div className="hero-logo" style={{ opacity: 0 }}>
              <Parallax speed={-0.08} className="flex justify-center items-center w-full max-w-3xl mx-auto mt-2 md:mt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="Logo DoeJÁ"
                  className="h-[200px] md:h-[25vh] md:max-h-[260px] md:min-h-[180px] w-auto object-contain"
                />
              </Parallax>
            </div>

            <div className="flex flex-col sm:flex-row gap-sm md:gap-md justify-center pt-xs md:pt-md">
              <Magnetic>
                <div className="hero-button" style={{ opacity: 0 }}>
                  <button className="bg-secondary text-white px-10 py-4 rounded-full font-display font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                    Quero Doar Agora
                  </button>
                </div>
              </Magnetic>
              <Magnetic>
                <div className="hero-button" style={{ opacity: 0 }}>
                  <button className="border-2 border-primary text-primary px-10 py-4 rounded-full font-display font-medium text-lg bg-white hover:bg-surface-container active:scale-95 transition-all cursor-pointer">
                    Ver Projetos
                  </button>
                </div>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* Bento Grid Section (Value Props) */}
        <section className="relative z-10 w-full max-w-7xl px-margin-mobile md:px-margin-desktop py-xl mt-lg grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Card 1 (colspan-2) - Soft Green */}
          <ScrollReveal className="md:col-span-2 group tactile-card bg-[#edf2e2]/95 border border-primary/15 p-lg rounded-[32px] flex flex-col md:flex-row items-center gap-lg shadow-lg">
            <div className="flex-1 space-y-md text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary">
                Transparência Total
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Acompanhe cada centavo da sua doação. Relatórios detalhados e
                fotos do impacto real nas comunidades atendidas.
              </p>
            </div>
            <ImageReveal
              src="/transparencia.webp"
              alt="Ilustração de Transparência Total"
              className="h-28 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            />
          </ScrollReveal>

          {/* Card 2 - Soft Orange */}
          <ScrollReveal className="group tactile-card bg-surface-container-low/95 border border-secondary/15 p-lg rounded-[32px] flex flex-col justify-between text-left gap-md shadow-lg min-h-[280px]">
            <div className="space-y-md">
              <ImageReveal
                src="/coracao-verificado.webp"
                alt="Selo de ONG Verificada"
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <h3 className="font-display text-xl md:text-2xl font-bold text-secondary">
                ONGs Verificadas
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Trabalhamos apenas com instituições auditadas e com histórico
                comprovado de impacto social.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3 - Soft Green */}
          <ScrollReveal className="group tactile-card bg-[#edf2e2]/95 border border-primary/15 p-lg rounded-[32px] flex flex-col justify-between text-left gap-md shadow-lg min-h-[280px]">
            <div className="space-y-md">
              <ImageReveal
                src="/comunidade.webp"
                alt="Ilustração de Comunidade Viva"
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              />
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
                Comunidade Viva
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Junte-se a mais de 10.000 doadores ativos que estão
                transformando o Brasil diariamente.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4 (colspan-2) - Soft Orange */}
          <ScrollReveal className="md:col-span-2 group tactile-card bg-surface-container-low/95 border border-secondary/15 p-lg rounded-[32px] flex flex-col md:flex-row-reverse items-center gap-lg shadow-lg">
            <div className="flex-1 space-y-md text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-secondary">
                Seja um Parceiro
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Sua empresa pode fazer a diferença. Conheça nossos planos
                corporativos de responsabilidade social.
              </p>
              <Magnetic>
                <div className="inline-block">
                  <button className="bg-secondary text-white px-8 py-3 rounded-full font-label-md hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer">
                    Saber Mais
                  </button>
                </div>
              </Magnetic>
            </div>
            <ImageReveal
              src="/parceria.webp"
              alt="Ilustração de Parceria"
              className="h-28 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            />
          </ScrollReveal>
        </section>

        {/* Floating Action Button (FAB) */}
        <Magnetic range={60} speed={1.4}>
          <div className="fixed bottom-margin-mobile right-margin-mobile md:bottom-md md:right-md z-50">
            <button className="bg-secondary text-white px-5 py-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-sm cursor-pointer hover:shadow-secondary/20">
              <HeartHandshakeIcon size={24} aria-hidden="true" />
              <span className="font-label-md hidden md:block">Doar Agora</span>
            </button>
          </div>
        </Magnetic>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

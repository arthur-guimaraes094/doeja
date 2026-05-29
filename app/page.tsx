import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import Parallax from "../components/Parallax";
import { HeartHandshakeIcon } from "../components/Icons";
import FloatingVegetables2D from "../components/FloatingVegetables2D";

export default function Home() {
  return (
    <>
      {/* Header */}
      <Header />

      <main className="relative min-h-screen flex flex-col items-center pt-md md:pt-0 text-on-surface overflow-hidden">
        {/* Global background floating animation */}
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-85">
          <FloatingVegetables2D />
        </div>

        {/* Hero Section */}
        <section className="relative w-full min-h-0 h-[calc(100svh-72px)] md:h-[calc(100vh-72px)] flex items-center justify-center py-4 md:py-8 z-10">
          <div className="relative z-10 max-w-4xl px-margin-mobile text-center space-y-sm md:space-y-lg w-full flex flex-col items-center">
            <div className="space-y-sm md:space-y-md">
              <h1 className="font-display text-[40px] md:text-[48px] font-bold leading-tight text-on-background">
                Seu gesto pode mudar histórias
              </h1>
              <p className="font-headline-md text-[20px] md:text-[24px] text-on-surface-variant">
                <span className="text-primary font-extrabold">Doe</span>
                <span className="text-secondary font-extrabold">JÁ</span> e leve
                mais do que alimento, leve{" "}
                <span className="text-primary font-extrabold">cuidado</span> e{" "}
                <span className="text-primary font-extrabold">esperança</span>.
              </p>
            </div>

            <Parallax speed={-0.08} className="flex justify-center items-center w-full max-w-3xl mx-auto mt-2 md:mt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Logo DoeJÁ"
                className="h-[220px] md:h-[32vh] md:max-h-[320px] md:min-h-[200px] w-auto object-contain"
              />
            </Parallax>

            <div className="flex flex-col sm:flex-row gap-sm md:gap-md justify-center pt-xs md:pt-md">
              <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-display font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Quero Doar Agora
              </button>
              <button className="border-2 border-primary text-primary px-10 py-4 rounded-full font-display font-medium text-lg bg-white hover:bg-surface-container active:scale-95 transition-all cursor-pointer">
                Ver Projetos
              </button>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/transparencia.webp"
              alt="Ilustração de Transparência Total"
              className="h-28 w-auto object-contain shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            />
          </ScrollReveal>

          {/* Card 2 - Soft Orange */}
          <ScrollReveal className="group tactile-card bg-surface-container-low/95 border border-secondary/15 p-lg rounded-[32px] flex flex-col justify-between text-left gap-md shadow-lg min-h-[280px]">
            <div className="space-y-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/coracao-verificado.webp"
                alt="Selo de ONG Verificada"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/comunidade.webp"
                alt="Ilustração de Comunidade Viva"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
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
              <button className="bg-secondary text-white px-8 py-3 rounded-full font-label-md hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer">
                Saber Mais
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/parceria.webp"
              alt="Ilustração de Parceria"
              className="h-28 w-auto object-contain shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            />
          </ScrollReveal>
        </section>

        {/* Floating Action Button (FAB) */}
        <button className="fixed bottom-margin-mobile right-margin-mobile md:bottom-md md:right-md bg-secondary text-white px-5 py-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-sm z-50 cursor-pointer hover:shadow-secondary/20">
          <HeartHandshakeIcon size={24} aria-hidden="true" />
          <span className="font-label-md hidden md:block">Doar Agora</span>
        </button>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingVegetables2D from "../components/FloatingVegetables2D";

export default function Home() {
  // Setup client-side intersection observer for scroll reveal of Bento cards
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll(".tactile-card");
    cards.forEach((card) => {
      card.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700");
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <>
      {/* Header */}
      <Header />

      <main className="relative min-h-screen flex flex-col items-center pt-xl bg-background text-on-surface">
        {/* Hero Section */}
        <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center py-16 z-10">
          <div className="absolute inset-0 -top-24 z-0 pointer-events-none opacity-85">
            <FloatingVegetables2D />
          </div>

          <div className="relative z-10 max-w-4xl px-margin-mobile text-center space-y-lg w-full flex flex-col items-center">
            <div className="space-y-md">
              <h1 className="font-display-lg text-[40px] md:text-[48px] font-extrabold leading-tight text-on-background">
                Seu gesto pode mudar histórias
              </h1>
              <p className="font-headline-md text-[20px] md:text-[24px] text-on-surface-variant">
                <span className="text-primary font-extrabold">Doe</span><span className="text-secondary font-extrabold">JÁ</span> e leve mais do que alimento, leve <span className="text-primary font-extrabold">cuidado</span> e <span className="text-primary font-extrabold">esperança</span>.
              </p>
            </div>

            <div className="relative flex justify-center items-center h-[350px] md:h-[400px] w-full max-w-3xl mx-auto mt-6">
              <Image
                src="/logo.svg"
                alt="Logo DoeJÁ"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-md justify-center pt-md">
              <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-headline-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Quero Doar Agora
              </button>
              <button className="border-2 border-primary text-primary px-10 py-4 rounded-full font-headline-md bg-white hover:bg-surface-container active:scale-95 transition-all cursor-pointer">
                Ver Projetos
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Section (Value Props) */}
        <section className="w-full max-w-7xl px-margin-mobile md:px-margin-desktop py-xl mt-lg grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Card 1 (colspan-2) */}
          <div className="md:col-span-2 tactile-card bg-surface-container-low p-lg rounded-[32px] flex flex-col md:flex-row items-center gap-lg">
            <div className="flex-1 space-y-md text-left">
              <h3 className="font-headline-lg text-headline-lg text-primary">Transparência Total</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Acompanhe cada centavo da sua doação. Relatórios detalhados e fotos do impacto real nas comunidades atendidas.
              </p>
            </div>
            <div className="w-full md:w-48 aspect-square bg-primary-container rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[80px] text-on-primary-container">analytics</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="tactile-card bg-tertiary-container p-lg rounded-[32px] flex flex-col justify-between text-left">
            <div className="space-y-md">
              <span className="material-symbols-outlined text-[48px] text-on-tertiary-container">verified_user</span>
              <h3 className="font-headline-md text-headline-md text-on-tertiary-container">ONGs Verificadas</h3>
              <p className="font-body-md text-body-md text-on-tertiary-container/90">
                Trabalhamos apenas com instituições auditadas e com histórico comprovado de impacto social.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="tactile-card bg-secondary-fixed p-lg rounded-[32px] flex flex-col justify-between text-left">
            <div className="space-y-md">
              <span className="material-symbols-outlined text-[48px] text-on-secondary-fixed">diversity_3</span>
              <h3 className="font-headline-md text-headline-md text-on-secondary-fixed">Comunidade Viva</h3>
              <p className="font-body-md text-body-md text-on-secondary-fixed/90">
                Junte-se a mais de 10.000 doadores ativos que estão transformando o Brasil diariamente.
              </p>
            </div>
          </div>

          {/* Card 4 (colspan-2) */}
          <div className="md:col-span-2 tactile-card bg-surface-container-highest p-lg rounded-[32px] flex flex-col md:flex-row-reverse items-center gap-lg overflow-hidden">
            <div className="flex-1 space-y-md text-left">
              <h3 className="font-headline-lg text-headline-lg text-secondary">Seja um Parceiro</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Sua empresa pode fazer a diferença. Conheça nossos planos corporativos de responsabilidade social.
              </p>
              <button className="bg-secondary text-white px-md py-2 rounded-full font-label-md hover:bg-secondary/90 transition-colors cursor-pointer">
                Saber Mais
              </button>
            </div>
            <div className="w-full md:w-64 h-48 relative shrink-0 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/handshake.jpg"
                alt="Parceria e Confiança"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Floating Action Button (FAB) */}
        <button className="fixed bottom-margin-mobile right-margin-mobile md:bottom-md md:right-md bg-secondary text-white px-5 py-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-sm z-50 cursor-pointer hover:shadow-secondary/20">
          <span className="material-symbols-outlined">volunteer_activism</span>
          <span className="font-label-md hidden md:block">Doar Agora</span>
        </button>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

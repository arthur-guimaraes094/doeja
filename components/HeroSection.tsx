"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import KineticText from "./KineticText";
import Parallax from "./Parallax";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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
  }, { scope: containerRef, dependencies: [] });

  return (
    <section ref={containerRef} className="relative w-full min-h-0 h-[calc(100svh-72px)] md:h-[calc(100vh-72px)] flex items-center justify-center py-4 md:py-8 z-10">
      <div className="relative z-10 max-w-4xl px-margin-mobile text-center space-y-sm md:space-y-lg w-full flex flex-col items-center">
        <div className="space-y-sm md:space-y-md">
          <h1 className="font-display text-[40px] md:text-[48px] font-medium leading-tight text-on-background">
            <KineticText text="Seu gesto pode mudar histórias" start={true} />
          </h1>
          <p className="hero-subtitle font-headline-md text-[20px] md:text-[24px] text-on-surface" style={{ opacity: 0 }}>
            <span className="text-primary font-extrabold">Doe</span>
            <span className="text-secondary-container font-extrabold">JÁ</span> e leve
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
          <div className="hero-button" style={{ opacity: 0 }}>
            <button className="bg-secondary text-white px-10 py-4 rounded-full font-display font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Quero Doar Agora
            </button>
          </div>
          <div className="hero-button" style={{ opacity: 0 }}>
            <button className="border-2 border-primary text-primary px-10 py-4 rounded-full font-display font-medium text-lg bg-white hover:bg-surface-container hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Ver Projetos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

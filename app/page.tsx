"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DaisySvg from "../components/DaisySvg";
import WomanSvg from "../components/WomanSvg";
import HandsSvg from "../components/HandsSvg";
import { useTheme } from "../hooks/useTheme";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Theme Toggler (Floating Control) */}
      <button 
        id="theme-toggle" 
        className="fixed z-[100] flex items-center gap-2 px-5 py-3 bg-accent-color text-text-white border-project-style radius-project-btn text-sm font-bold cursor-pointer shadow-project-btn transition-all duration-300 hover:bg-accent-hover hover:scale-105 top-auto bottom-[90px] right-[15px] md:top-[95px] md:bottom-auto md:right-5" 
        onClick={toggleTheme}
        aria-label="Alternar Tema"
      >
        <span className="text-base">🎨</span>
        <span>
          Estilo: {theme === "theme-organic" ? "Orgânico" : "Retro Pôster"}
        </span>
      </button>

      {/* Header */}
      <Header />

      {/* Main Content Layout */}
      <main className="grow flex items-center py-10">
        <div className="w-[90%] max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-5 py-7 md:py-0">
          
          {/* Left Illustration: Daisy */}
          <div className="illustration-wrapper w-[160px] md:w-[180px] lg:w-[250px] flex justify-center items-center order-2 md:order-1">
            <DaisySvg />
          </div>

          {/* Center Box: Main Text and Logo */}
          <div className="flex-1 max-w-[600px] flex flex-col items-center text-center gap-[30px] w-full mb-5 md:mb-0 order-1 md:order-2">
            <h1 className="text-[26px] lg:text-[32px] leading-[1.4] text-text-primary font-bold">
              Seu gesto pode mudar histórias<br />
              <span className="highlight-doe">Doe</span><span className="highlight-ja">JÁ</span> e leve mais do que alimento, leve cuidado e esperança.
            </h1>
            <div className="mt-[15px] p-[15px] rounded-[20px] bg-white/40 shadow-project-hero border-project-style">
              <HandsSvg />
            </div>
          </div>

          {/* Right Illustration: Celebrating Woman */}
          <div className="illustration-wrapper w-[160px] md:w-[180px] lg:w-[250px] flex justify-center items-center order-3">
            <WomanSvg />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DaisySvg from "../components/DaisySvg";
import WomanSvg from "../components/WomanSvg";
import HandsSvg from "../components/HandsSvg";

export default function Home() {
  const [theme, setTheme] = useState("theme-organic");

  // Load theme from localStorage on client-side mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("doeja-theme") || "theme-organic";
    const handle = requestAnimationFrame(() => {
      setTheme(savedTheme);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Update body class and localStorage whenever theme changes
  useEffect(() => {
    document.body.className = `theme-organic theme-retro`; // clear or set class
    document.body.className = theme;
    localStorage.setItem("doeja-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "theme-organic" ? "theme-retro" : "theme-organic"));
  };

  return (
    <>
      {/* Theme Toggler (Floating Control) */}
      <button 
        id="theme-toggle" 
        className="theme-toggle-btn" 
        onClick={toggleTheme}
        aria-label="Alternar Tema"
      >
        <span className="toggle-icon">🎨</span>
        <span className="toggle-text">
          Estilo: {theme === "theme-organic" ? "Orgânico" : "Retro Pôster"}
        </span>
      </button>

      {/* Header */}
      <Header />

      {/* Main Content Layout */}
      <main className="hero-section">
        <div className="hero-container">
          
          {/* Left Illustration: Daisy */}
          <div className="illustration-wrapper left-ill">
            <DaisySvg />
          </div>

          {/* Center Box: Main Text and Logo */}
          <div className="center-content">
            <h1 className="hero-title">
              Seu gesto pode mudar histórias<br />
              <span className="highlight-doe">Doe</span><span className="highlight-ja">JÁ</span> e leve mais do que alimento, leve cuidado e esperança.
            </h1>
            <div className="center-logo-wrapper">
              <HandsSvg />
            </div>
          </div>

          {/* Right Illustration: Celebrating Woman */}
          <div className="illustration-wrapper right-ill">
            <WomanSvg />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

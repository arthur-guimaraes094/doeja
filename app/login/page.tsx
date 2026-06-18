"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { gsap, useGSAP } from "@/lib/gsap";

const FloatingVegetables2D = dynamic(
  () => import("@/components/FloatingVegetables2D"),
  { ssr: false }
);

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const handleExit = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        router.push(href);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting login form:", formData);
    // Add auth logic here when needed
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center p-margin-mobile md:p-md text-on-surface overflow-hidden bg-background"
    >
      {/* Dynamic backdrop canvas vegetable animations */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-80">
        <FloatingVegetables2D />
      </div>

      {/* Main Login Card */}
      <div
        ref={cardRef}
        style={{ opacity: 0 }}
        className="relative grid grid-cols-1 md:grid-cols-12 w-full max-w-4xl min-h-[580px] bg-white border border-surface-tint/10 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl z-10"
      >
        {/* Left Panel - Brand Showcase (Hidden on Mobile) */}
        <div className="hidden md:flex md:col-span-5 bg-primary-container flex-col justify-between p-10 text-primary relative">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleExit(e, "/")}
            className="inline-block transition-transform hover:scale-105 duration-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Logo DoeJÁ" className="h-10 w-auto object-contain" />
          </Link>

          {/* Donation Box Illustration */}
          <div className="flex-1 flex items-center justify-center py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/caixa-doacao.webp"
              alt="Caixa de doação de alimentos DoeJÁ"
              className="w-[90%] h-auto max-h-[260px] object-contain drop-shadow-[0_10px_15px_rgba(63,84,19,0.15)]"
            />
          </div>

          {/* "Bem-vindo!" Text */}
          <div>
            <h2 className="font-display text-4xl font-extrabold text-primary leading-tight tracking-tight">
              Bem-vindo!
            </h2>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="col-span-1 md:col-span-7 bg-[#fff8f6] flex flex-col justify-between p-8 md:p-12 relative min-h-[480px] md:min-h-0">
          
          {/* Top Row: Mobile Logo / Back Link */}
          <div className="flex justify-between items-center w-full mb-6">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center">
              <Link href="/" onClick={(e) => handleExit(e, "/")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="Logo DoeJÁ" className="h-9 w-auto object-contain" />
              </Link>
            </div>

            {/* Back Button */}
            <Link
              href="/"
              onClick={(e) => handleExit(e, "/")}
              className="absolute top-6 right-8 text-on-surface-variant/70 hover:text-primary transition-all duration-200 flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-primary-container/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Voltar
            </Link>
          </div>

          {/* Center Form Container */}
          <div className="my-auto w-full max-w-[384px] mx-auto space-y-6">
            {/* Header Title */}
            <div className="space-y-1">
              <h1 className="font-display text-4xl font-extrabold text-secondary tracking-tight">
                Login
              </h1>
              <p className="text-sm text-on-surface-variant font-medium">
                Conecte-se para continuar espalhando solidariedade.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CPF/CNPJ/Email Input */}
              <div className="relative flex items-center bg-white border border-outline-variant rounded-full px-5 py-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5 text-on-surface-variant/40 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="CPF, CNPJ ou E-mail"
                  required
                  className="w-full ml-3 bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm md:text-base"
                />
              </div>

              {/* Password Input */}
              <div className="relative flex items-center bg-white border border-outline-variant rounded-full px-5 py-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5 text-on-surface-variant/40 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha"
                  required
                  className="w-full ml-3 bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm md:text-base"
                />
              </div>

              {/* Checkbox and Forgot Password */}
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant px-2 pt-1 select-none">
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-primary transition-colors group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                        formData.rememberMe
                          ? "bg-primary border-primary shadow-sm"
                          : "border-outline-variant bg-white group-hover:border-primary"
                      }`}
                    >
                      {formData.rememberMe && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3.5"
                          className="w-3.5 h-3.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span>Lembrar de mim</span>
                </label>
                <a href="#" className="hover:text-primary hover:underline transition-all duration-200">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Login Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-[#975600] active:scale-[0.98] text-white py-3.5 rounded-full font-display font-bold text-base md:text-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Separator "Ou" */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/60"></div>
              </div>
              <span className="relative bg-[#fff8f6] px-3.5 text-xs font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                Ou
              </span>
            </div>

            {/* Cadastre-se Button */}
            <div>
              <button className="w-full bg-surface-container-highest hover:bg-[#e4d7d1] active:scale-[0.98] text-on-surface py-3.5 rounded-full font-display font-bold text-base md:text-lg transition-all border border-outline-variant/30 cursor-pointer">
                Cadastre-se
              </button>
            </div>
          </div>

          {/* Footer note / privacy info */}
          <div className="text-center text-[10px] text-on-surface-variant/50 pt-6">
            © {new Date().getFullYear()} DoeJÁ. Conectando pessoas e combatendo a fome.
          </div>
        </div>
      </div>
    </div>
  );
}

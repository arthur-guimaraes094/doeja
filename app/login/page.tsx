"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nome: "",
    telefone: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const remember = localStorage.getItem("doeja_remember_me") !== "false";
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          rememberMe: remember,
        }));
      }, 0);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/\D/g, "");

    let formattedValue = "";
    if (cleanValue.length > 0) {
      formattedValue = `(${cleanValue.slice(0, 2)}`;

      if (cleanValue.length > 2) {
        formattedValue += `) ${cleanValue.slice(2, 6)}`;
      }
      if (cleanValue.length > 6) {
        if (cleanValue.length <= 10) {
          formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6, 10)}`;
        } else {
          formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
        }
      }
    }

    setFormData((prev) => ({ ...prev, telefone: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("doeja_remember_me", formData.rememberMe ? "true" : "false");
      if (!formData.rememberMe) {
        // Encontra todas as chaves do supabase no localStorage e remove-as para evitar conflitos
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
            localStorage.removeItem(key);
          }
        }
      }
    }

    try {
      if (isLoginTab) {
        // LOGIN Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        // CADASTRO (Register) Flow
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg("As senhas não coincidem.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nome: formData.nome,
              telefone: formData.telefone,
            },
          },
        });

        if (error) throw error;

        // Note: If email confirmation is enabled in Supabase dashboard, data.user will exist but session will be null.
        const isConfirmed = data.session !== null;
        if (isConfirmed) {
          setSuccessMsg("Cadastro e login realizados com sucesso!");
          setTimeout(() => {
            router.push("/");
          }, 1200);
        } else {
          setSuccessMsg("Cadastro realizado com sucesso! Verifique seu e-mail para ativar sua conta.");
          setIsLoginTab(true);
          // Clear registration fields
          setFormData((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
            nome: "",
            telefone: "",
          }));
        }
      }
    } catch (err: any) {
      console.error("Auth process error:", err);
      if (err.message === "Invalid login credentials") {
        setErrorMsg("Login ou senha inválidos.");
      } else {
        setErrorMsg(err.message || "Erro durante o processamento da autenticação.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center p-margin-mobile md:p-md text-on-surface overflow-hidden bg-background"
    >
      {/* Main Login Card */}
      <div
        ref={cardRef}
        className="relative grid grid-cols-1 md:grid-cols-12 w-full max-w-4xl min-h-[580px] bg-white border border-surface-tint/10 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl z-10"
      >
        {/* Left Panel - Brand Showcase (Hidden on Mobile) */}
        <div className="hidden md:flex md:col-span-5 bg-primary-container flex-col justify-between p-10 text-primary relative">
          {/* Logo */}
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-105 duration-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Logo DoeJÁ" className="h-10 w-auto object-contain" />
          </Link>

          {/* Donation Box Illustration */}
          <div className="flex-1 flex items-center justify-center py-6 relative">
            <Image
              src="/caixa-doacao.webp"
              alt="Caixa de doação de alimentos DoeJÁ"
              width={260}
              height={260}
              priority
              className="w-[90%] h-auto max-h-[260px] object-contain drop-shadow-[0_10px_15px_rgba(63,84,19,0.15)]"
              style={{ height: "auto" }}
            />
          </div>

          {/* Title Text */}
          <div>
            <h2 className="font-display text-4xl font-extrabold text-primary leading-tight tracking-tight">
              {isLoginTab ? "Bem-vindo!" : "Participe!"}
            </h2>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="col-span-1 md:col-span-7 bg-[#fff8f6] flex flex-col justify-between p-8 md:p-12 relative min-h-[480px] md:min-h-0">

          {/* Top Row: Mobile Logo / Back Link */}
          <div className="flex justify-between items-center w-full mb-6">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center">
              <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="Logo DoeJÁ" className="h-9 w-auto object-contain" />
              </Link>
            </div>

            {/* Back Button */}
            <Link
              href="/"
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
                {isLoginTab ? "Login" : "Cadastro"}
              </h1>
              <p className="text-sm text-on-surface-variant font-medium">
                {isLoginTab
                  ? "Conecte-se para continuar espalhando solidariedade."
                  : "Crie sua conta para começar a doar ou apoiar."}
              </p>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-green-200">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome (Only for Cadastro) */}
              {!isLoginTab && (
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
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome Completo"
                    required={!isLoginTab}
                    className="w-full ml-3 bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm md:text-base"
                  />
                </div>
              )}

              {/* Email Input */}
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha"
                  required
                  className="w-full ml-3 bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Confirm Password Input (Only for Cadastro) */}
              {!isLoginTab && (
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
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmar Senha"
                    required={!isLoginTab}
                    className="w-full ml-3 bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm md:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
                    aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Telefone (Only for Cadastro) */}
              {!isLoginTab && (
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.148-3.88-6.705-6.705l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <input
                    type="tel"
                    name="telefone"
                    maxLength={15}
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                    placeholder="Telefone"
                    className="w-full ml-3 bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm md:text-base"
                  />
                </div>
              )}



              {/* Checkbox and Forgot Password (Only for Login) */}
              {isLoginTab && (
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
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${formData.rememberMe
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
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-[#975600] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-display font-bold text-base md:text-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
                >
                  {loading ? "Processando..." : isLoginTab ? "Login" : "Cadastrar"}
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

            {/* Switch Mode Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(!isLoginTab);
                  setErrorMsg("");
                  setSuccessMsg("");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="w-full bg-surface-container-highest hover:bg-[#e4d7d1] active:scale-[0.98] text-on-surface py-3.5 rounded-full font-display font-bold text-base md:text-lg transition-all border border-outline-variant/30 cursor-pointer"
              >
                {isLoginTab ? "Cadastre-se" : "Já tenho conta"}
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-on-surface-variant/50 pt-6">
            © {new Date().getFullYear()} DoeJÁ. Conectando pessoas e combatendo a fome.
          </div>
        </div>
      </div>
    </div>
  );
}

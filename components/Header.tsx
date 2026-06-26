"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Module-level cache (client-only persistent memory across mounts)
let cachedUser: any = null;
let cachedIsOng = false;
let hasInitialized = false;
let hasHydratedGlobal = false;

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<any>(cachedUser);
  const [isOng, setIsOng] = useState<boolean>(cachedIsOng);
  const [isLoading, setIsLoading] = useState(!hasInitialized);
  const [isMounted, setIsMounted] = useState(hasHydratedGlobal);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsLoggingOut(true);
    
    // Aguarda o término da animação de morphing (500ms)
    setTimeout(async () => {
      await supabase.auth.signOut();
      setIsLoggingOut(false);
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const checkUserType = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("usuario")
          .select("tipo")
          .eq("id_usuario", userId)
          .maybeSingle();
        
        if (!error && data) {
          const ongVal = data.tipo === "ong";
          cachedIsOng = ongVal;
          setIsOng(ongVal);
        }
      } catch (err) {
        console.error("Erro ao obter tipo do usuário no header:", err);
      }
    };

    setTimeout(() => {
      setIsMounted(true);
      if (hasInitialized) {
        setUser(cachedUser);
        setIsOng(cachedIsOng);
        setIsLoading(false);
      }
    }, 0);
    hasHydratedGlobal = true;

    // Obter sessão inicial do usuário
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      cachedUser = u;
      hasInitialized = true;
      setUser(u);
      setIsLoading(false);
      if (u) {
        checkUserType(u.id);
      }
    });

    // Ouvir mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      cachedUser = u;
      hasInitialized = true;
      setUser(u);
      setIsLoading(false);
      if (u) {
        checkUserType(u.id);
      } else {
        cachedIsOng = false;
        setIsOng(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Hide when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setIsVisible(false);
            setIsMobileMenuOpen(false); // Close mobile menu on scroll
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 border-b border-surface-variant bg-[#edf2e2] transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.svg" 
            alt="Logo DoeJÁ" 
            className="h-10 w-auto object-contain"
          />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-lg">
          <Link className="font-body-lg text-body-lg text-on-surface-variant/70 hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all duration-200" href="/doacoes">Doações</Link>
          <a className="font-body-lg text-body-lg text-on-surface-variant/70 hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all duration-200" href="#">ONGs</a>
          <a className="font-body-lg text-body-lg text-on-surface-variant/70 hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all duration-200" href="#">Seja um parceiro!</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-end w-24 h-10 shrink-0 relative" ref={dropdownRef}>
            {!isMounted || isLoading ? (
              /* Quiet skeleton loader to prevent layout shifts or flashing */
              <div className="h-10 w-24 bg-on-surface-variant/10 rounded-full animate-pulse" />
            ) : (
              <>
                {/* Morphing Button Container */}
                <div
                  className={`h-10 rounded-full transition-all duration-500 ease-in-out relative flex items-center justify-center overflow-hidden ${
                    user && !isLoggingOut
                      ? "w-10 bg-transparent hover:bg-primary-container/20 text-on-surface-variant hover:text-primary cursor-pointer"
                      : "w-24 bg-secondary-container text-on-secondary-container shadow-md hover:scale-95 cursor-pointer"
                  }`}
                >
                  {/* Profile Icon Node */}
                  <button
                    onClick={() => {
                      if (user && !isLoggingOut) {
                        setIsDropdownOpen(!isDropdownOpen);
                      }
                    }}
                    className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ease-in-out ${
                      user && !isLoggingOut
                        ? "opacity-100 scale-100 rotate-0"
                        : "opacity-0 scale-75 rotate-90 pointer-events-none"
                    }`}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  {/* Login Text Link Node */}
                  <Link
                    href="/login"
                    onClick={(e) => {
                      if (user && !isLoggingOut) {
                        e.preventDefault();
                      }
                    }}
                    className={`absolute inset-0 flex items-center justify-center font-headline-md text-body-md font-bold transition-all duration-500 ease-in-out ${
                      user && !isLoggingOut
                        ? "opacity-0 scale-75 -rotate-90 pointer-events-none"
                        : "opacity-100 scale-100 rotate-0"
                    }`}
                  >
                    Login
                  </Link>
                </div>

                {/* Profile Dropdown Menu (Outside overflow-hidden) */}
                {user && !isLoggingOut && (
                  <div
                    className={`absolute right-0 top-12 w-48 bg-white border border-surface-variant/30 rounded-2xl shadow-xl py-2 z-50 origin-top-right transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] ${
                      isDropdownOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto blur-0"
                        : "opacity-0 scale-50 -translate-y-4 pointer-events-none blur-sm"
                    }`}
                  >
                    <Link
                      href="/perfil"
                      className="block px-4 py-2.5 text-body-md text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-colors font-medium"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    {isOng ? (
                      <Link
                        href="/resgates"
                        className="block px-4 py-2.5 text-body-md text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-colors font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Resgates
                      </Link>
                    ) : (
                      <Link
                        href="/minhas-doacoes"
                        className="block px-4 py-2.5 text-body-md text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-colors font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Minhas Doações
                      </Link>
                    )}
                    <Link
                      href="/chat"
                      className="block px-4 py-2.5 text-body-md text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-colors font-medium"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Mensagens
                    </Link>
                    <div className="border-t border-surface-variant/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-body-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Botão de Menu Hambúrguer para Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-container/20 text-on-surface-variant hover:text-primary transition-colors"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Slide-over Mobile Menu Backdrop and Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-40 md:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 top-[73px] bg-black/30 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="relative w-full max-w-[280px] bg-[#edf2e2] h-[calc(100vh-73px)] shadow-2xl flex flex-col justify-between py-6 px-6 border-l border-surface-variant/20 z-10 transition-transform duration-300">
            <nav className="flex flex-col gap-6">
              <Link 
                className="font-headline-md text-headline-sm text-on-surface-variant/80 hover:text-primary py-2 border-b border-surface-variant/10 transition-colors"
                href="/doacoes"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Doações
              </Link>
              <a 
                className="font-headline-md text-headline-sm text-on-surface-variant/80 hover:text-primary py-2 border-b border-surface-variant/10 transition-colors"
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ONGs
              </a>
              <a 
                className="font-headline-md text-headline-sm text-on-surface-variant/80 hover:text-primary py-2 border-b border-surface-variant/10 transition-colors"
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Seja um parceiro!
              </a>
            </nav>
            
            <div className="text-center text-body-sm text-on-surface-variant/50">
              DoeJÁ © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

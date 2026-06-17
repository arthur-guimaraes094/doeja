"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <header className={`sticky top-0 z-50 border-b border-surface-variant bg-[#edf2e2] transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
        <div className="flex items-center cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.svg" 
            alt="Logo DoeJÁ" 
            className="h-10 w-auto object-contain"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-lg">
          <a className="font-body-lg text-body-lg text-primary border-b-2 border-primary pb-1 font-bold" href="#">Doações</a>
          <a className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">ONGs</a>
          <a className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Seja um parceiro!</a>
        </nav>
        
        <div className="flex items-center gap-md">
          <button className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Conta</button>
          <Link href="/login" className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-headline-md text-body-md shadow-md hover:scale-95 transition-transform">Login</Link>
        </div>
      </div>
    </header>
  );
}

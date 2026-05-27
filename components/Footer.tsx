import React from "react";
import { GlobeIcon, ShareIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="w-full relative z-10 mt-xl border-t border-surface-variant bg-[#edf2e2] min-h-[140px] pb-10">
      {/* Main Footer Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop pt-lg pb-4 space-y-md md:space-y-0 max-w-7xl mx-auto">
        
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.svg" 
            alt="Logo DoeJÁ" 
            className="h-10 w-auto object-contain mb-1"
          />
          <p className="font-label-md text-label-md text-on-surface-variant text-center md:text-left">
            © 2026 DoeJÁ. Conectando generosidade a quem precisa.
          </p>
        
        
        <nav className="flex flex-wrap justify-center gap-md">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacidade</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Termos de Uso</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Contato</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Sobre Nós</a>
        </nav>
        
        <div className="flex gap-md">
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Website">
            <GlobeIcon size={24} aria-hidden="true" />
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Compartilhar">
            <ShareIcon size={24} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

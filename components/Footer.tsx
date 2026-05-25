import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full relative mt-xl border-t border-surface-variant bg-[#edf2e2]/80 backdrop-blur-md min-h-[140px] pb-10">
      {/* Main Footer Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop pt-lg pb-4 space-y-md md:space-y-0 max-w-7xl mx-auto">
        
          <div className="relative h-10 w-28 mb-1">
            <Image 
              src="/logo.svg" 
              alt="Logo DoeJÁ" 
              fill
              className="object-contain object-center md:object-left"
            />
          </div>
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
            <span className="material-symbols-outlined">public</span>
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Compartilhar">
            <span className="material-symbols-outlined">share</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

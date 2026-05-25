import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-variant bg-surface">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
        <div className="flex items-center cursor-pointer">
          <div className="relative h-10 w-28">
            <Image 
              src="/logo.svg" 
              alt="Logo DoeJÁ" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-lg">
          <a className="font-body-lg text-body-lg text-primary border-b-2 border-primary pb-1 font-bold" href="#">Doações</a>
          <a className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">ONGs</a>
          <a className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Seja um parceiro!</a>
        </nav>
        
        <div className="flex items-center gap-md">
          <button className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Conta</button>
          <button className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-headline-md text-body-md shadow-md hover:scale-95 transition-transform">Login</button>
        </div>
      </div>
    </header>
  );
}

import React from "react";

export default function Header() {
  return (
    <header className="bg-header-bg border-b-project-style py-[15px] relative z-10">
      <div className="w-[90%] max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <svg 
            className="transition-transform duration-300 group-hover:-rotate-10 group-hover:scale-110" 
            width="40" 
            height="40" 
            viewBox="0 0 200 200"
          >
            <circle 
              cx="100" 
              cy="100" 
              r="85" 
              fill="#a3c767" 
              stroke="var(--stroke-color)" 
              strokeWidth="var(--stroke-width)" 
            />
            <path 
              d="M 60,110 Q 100,50 140,110" 
              fill="none" 
              stroke="white" 
              strokeWidth="12" 
              strokeLinecap="round" 
            />
            <circle 
              cx="100" 
              cy="120" 
              r="25" 
              fill="#f2911b" 
              stroke="var(--stroke-color)" 
              strokeWidth="var(--stroke-width)" 
            />
          </svg>
          <span className="text-[28px] font-bold text-text-primary">DoeJÁ</span>
        </div>
        <nav className="hidden md:flex gap-[30px]">
          <a 
            href="#" 
            className="relative text-lg font-semibold text-nav-link-color hover:text-nav-link-hover after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-text-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Doações
          </a>
          <a 
            href="#" 
            className="relative text-lg font-semibold text-nav-link-color hover:text-nav-link-hover after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-text-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            ONG's
          </a>
          <a 
            href="#" 
            className="relative text-lg font-semibold text-nav-link-color hover:text-nav-link-hover after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-text-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Seja um parceiro!
          </a>
        </nav>
        <button className="bg-accent-color text-text-white border-project-style radius-project-btn px-6 py-2.5 text-lg font-bold cursor-pointer shadow-project-btn transition-all duration-300 hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0">
          Login
        </button>
      </div>
    </header>
  );
}


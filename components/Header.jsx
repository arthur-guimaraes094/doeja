import React from "react";

export default function Header() {
  return (
    <header className="main-header">
      <div className="nav-container">
        <div className="logo">
          <svg className="header-logo-svg" width="40" height="40" viewBox="0 0 200 200">
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
          <span className="logo-text">DoeJÁ</span>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-link">Doações</a>
          <a href="#" className="nav-link">ONG's</a>
          <a href="#" className="nav-link">Seja um parceiro!</a>
        </nav>
        <button className="login-btn">Login</button>
      </div>
    </header>
  );
}

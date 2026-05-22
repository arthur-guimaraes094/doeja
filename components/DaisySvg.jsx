import React, { useState, useEffect } from "react";

export default function DaisySvg() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg id="svg-daisy" className="ill-svg" viewBox="0 0 200 200">
      {/* Flower Stem */}
      <path 
        d="M100 130 Q105 160 95 190" 
        stroke="#7BA832" 
        strokeWidth="10" 
        fill="none" 
        strokeLinecap="round" 
      />
      <path 
        d="M102 150 Q120 145 115 135" 
        stroke="#7BA832" 
        strokeWidth="8" 
        fill="#7BA832" 
        strokeLinecap="round" 
      />
      
      {/* Flower Petals */}
      <g 
        id="daisy-petals" 
        fill="white" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)"
      >
        <circle cx="100" cy="50" r="22" />
        <circle cx="100" cy="130" r="22" />
        <circle cx="60" cy="90" r="22" />
        <circle cx="140" cy="90" r="22" />
        <circle cx="72" cy="62" r="22" />
        <circle cx="128" cy="118" r="22" />
        <circle cx="72" cy="118" r="22" />
        <circle cx="128" cy="62" r="22" />
      </g>

      {/* Flower Center (Yellow) */}
      <circle 
        cx="100" 
        cy="90" 
        r="32" 
        fill="#FFD214" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      
      {/* Eyes */}
      <ellipse className="eye" cx="88" cy="85" rx="4.5" ry={isBlinking ? "0.5" : "4.5"} fill="black" />
      <ellipse className="eye" cx="112" cy="85" rx="4.5" ry={isBlinking ? "0.5" : "4.5"} fill="black" />
      
      {/* Smile */}
      <path 
        d="M 88,96 Q 100,108 112,96" 
        fill="none" 
        stroke="black" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

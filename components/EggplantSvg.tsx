import React, { useState, useEffect } from "react";

export default function EggplantSvg() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Blinks randomly between 3 and 7 seconds
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg id="svg-eggplant" viewBox="0 0 100 120" width="80" height="96">
      {/* Eggplant Stem */}
      <path 
        d="M50 30 Q50 10 60 10" 
        stroke="#7BA832" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round" 
      />
      <path 
        d="M35 30 Q50 20 65 30 Q60 40 50 38 Q40 40 35 30 Z" 
        fill="#7BA832" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
        strokeLinecap="round" 
      />
      
      {/* Eggplant Body */}
      <path 
        d="M30 40 C20 60 15 90 35 105 C55 120 75 115 80 95 C85 75 70 50 70 40 C70 40 55 35 30 40 Z" 
        fill="#784B8E" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      
      {/* Face */}
      <ellipse className="eye" cx="44" cy="65" rx="3" ry={isBlinking ? "0.5" : "3"} fill="black" />
      <ellipse className="eye" cx="62" cy="65" rx="3" ry={isBlinking ? "0.5" : "3"} fill="black" />
      
      {/* Cheeks */}
      <circle cx="39" cy="70" r="3" fill="#FF8E8E" opacity="0.6"/>
      <circle cx="67" cy="70" r="3" fill="#FF8E8E" opacity="0.6"/>
      
      {/* Mouth */}
      <path 
        d="M 49,70 Q 53,74 57,70" 
        fill="none" 
        stroke="black" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

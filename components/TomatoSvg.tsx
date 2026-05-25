import React, { useState, useEffect } from "react";

export default function TomatoSvg() {
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
    <svg id="svg-tomato" viewBox="0 0 120 120" width="96" height="96">
      {/* Tomato Stem/Leaves */}
      <path 
        d="M60 25 Q60 10 65 10" 
        stroke="#7BA832" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round" 
      />
      <path 
        d="M40 28 Q60 15 80 28 Q70 38 60 33 Q50 38 40 28 Z" 
        fill="#7BA832" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
        strokeLinecap="round" 
      />
      
      {/* Tomato Body */}
      <circle 
        cx="60" 
        cy="65" 
        r="35" 
        fill="#E5493A" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      
      {/* Face */}
      <ellipse className="eye" cx="48" cy="60" rx="3.5" ry={isBlinking ? "0.5" : "3.5"} fill="black" />
      <ellipse className="eye" cx="72" cy="60" rx="3.5" ry={isBlinking ? "0.5" : "3.5"} fill="black" />
      
      {/* Cheeks */}
      <circle cx="42" cy="66" r="3.5" fill="#FF8E8E" opacity="0.6"/>
      <circle cx="78" cy="66" r="3.5" fill="#FF8E8E" opacity="0.6"/>
      
      {/* Smile */}
      <path 
        d="M 55,66 Q 60,72 65,66" 
        fill="none" 
        stroke="black" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

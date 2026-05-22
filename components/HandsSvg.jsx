import React from "react";

export default function HandsSvg() {
  return (
    <svg id="svg-hands" className="hands-svg" viewBox="0 0 200 200">
      {/* Green Circle Frame */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="none" 
        stroke="#A3C767" 
        strokeWidth="6" 
        strokeDasharray="10 6" 
      />
      {/* Four interlocking hands vector */}
      {/* Top Hand (Green) */}
      <path 
        d="M70,55 L130,55 Q135,55 135,60 L135,70 Q135,75 130,75 L115,75 L115,85 Q115,90 110,90 L90,90 Q85,90 85,85 L85,75 L70,75 Q65,75 65,70 L65,60 Q65,55 70,55 Z" 
        fill="#1a6b32" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      {/* Right Hand (Orange) */}
      <path 
        d="M145,70 L145,130 Q145,135 140,135 L130,135 Q125,135 125,130 L125,115 L115,115 Q110,115 110,110 L110,90 Q110,85 115,85 L125,85 L125,70 Q125,65 130,65 L140,65 Q145,65 145,70 Z" 
        fill="#f2911b" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      {/* Bottom Hand (Green) */}
      <path 
        d="M130,145 L70,145 Q65,145 65,140 L65,130 Q65,125 70,125 L85,125 L85,115 Q85,110 90,110 L110,110 Q115,110 115,115 L115,125 L130,125 Q135,125 135,130 L135,140 Q135,145 130,145 Z" 
        fill="#1a6b32" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      {/* Left Hand (Orange) */}
      <path 
        d="M55,130 L55,70 Q55,65 60,65 L70,65 Q75,65 75,70 L75,85 L85,85 Q90,85 90,90 L90,110 Q90,115 85,115 L75,115 L75,130 Q75,135 70,135 L60,135 Q55,135 55,130 Z" 
        fill="#f2911b" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)" 
      />
      {/* Center connection heart/circle */}
      <circle cx="100" cy="100" r="14" fill="#FDEDE4" stroke="#f2911b" strokeWidth="3" />
      <path 
        d="M100,105 Q100,105 97,102 Q94,99 94,96.5 A2.5,2.5 0 0,1 99,95 Q100,97 100,97 Q100,97 101,95 A2.5,2.5 0 0,1 106,96.5 Q106,99 103,102 Q100,105 100,105 Z" 
        fill="#f2911b" 
      />
    </svg>
  );
}

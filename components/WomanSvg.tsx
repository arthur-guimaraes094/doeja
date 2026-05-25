import React from "react";

export default function WomanSvg() {
  return (
    <svg id="svg-woman" className="ill-svg" viewBox="0 0 200 200">
      {/* Wavy Hair behind */}
      <path 
        d="M60 90 Q40 120 70 150 Q110 160 140 140 Q160 110 140 80 Q130 50 100 50 Q70 50 60 90 Z" 
        fill="#3A2312" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)"
      />
      
      {/* Celebrating Hand / Raised Arm */}
      <path 
        className="woman-arm" 
        d="M130 90 Q170 50 165 40 Q155 35 125 70 L115 85 Z" 
        fill="#E8B085" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)"
      />
      
      {/* Head */}
      <circle 
        cx="100" 
        cy="90" 
        r="30" 
        fill="#E8B085" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)"
      />
      
      {/* Curly Hair details */}
      <circle cx="75" cy="70" r="16" fill="#3A2312" />
      <circle cx="125" cy="70" r="16" fill="#3A2312" />
      <circle cx="100" cy="62" r="18" fill="#3A2312" />

      {/* Face Details */}
      {/* Eyes */}
      <circle cx="92" cy="90" r="3" fill="black" />
      <circle cx="108" cy="90" r="3" fill="black" />
      
      {/* Cheeks */}
      <circle cx="85" cy="96" r="4" fill="#FF8E8E" opacity="0.6"/>
      <circle cx="115" cy="96" r="4" fill="#FF8E8E" opacity="0.6"/>
      
      {/* Smile */}
      <path 
        d="M 94,98 Q 100,105 106,98" 
        fill="none" 
        stroke="black" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* Golden Earrings */}
      <circle cx="70" cy="95" r="5" fill="none" stroke="#FFD214" strokeWidth="2"/>
      <circle cx="130" cy="95" r="5" fill="none" stroke="#FFD214" strokeWidth="2"/>
      
      {/* Body / T-Shirt */}
      <path 
        d="M70 120 C70 120 75 180 60 190 L140 190 C125 180 130 120 130 120 Z" 
        fill="#E55944" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)"
      />
      {/* Neck */}
      <path d="M92 118 L92 125 L108 125 L108 118 Z" fill="#E8B085" />
      
      {/* Heart on T-Shirt */}
      <path 
        d="M100 155 Q100 155 94 149 Q88 143 88 138 A5,5 0 0 1 98 135 Q100 139 100 139 Q100 139 102 135 A5,5 0 0 1 112 138 Q112 143 106 149 Q100 155 100 155 Z" 
        fill="white" 
      />
      
      {/* Left Arm reaching out */}
      <path 
        d="M72 125 Q40 135 30 145 Q35 155 50 145 L72 135 Z" 
        fill="#E8B085" 
        stroke="var(--stroke-color)" 
        strokeWidth="var(--stroke-width)"
      />
    </svg>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // E.g., -0.15 (slower movement) or 0.15 (faster movement)
  className?: string;
}

export default function Parallax({ children, speed = 0.12, className = "" }: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            // Calculate vertical center relative offset
            const scrollMiddle = window.scrollY + window.innerHeight / 2;
            const elementMiddle = window.scrollY + rect.top + rect.height / 2;
            const relativeOffset = (scrollMiddle - elementMiddle) * speed;
            setOffset(relativeOffset);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Execute once initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

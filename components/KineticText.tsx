"use client";

import React, { useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  start?: boolean;
}

export default function KineticText({ 
  text, 
  className = "", 
  delay = 0,
  start = true 
}: KineticTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);


  useGSAP(() => {
    if (!start) return;
    const chars = containerRef.current?.querySelectorAll(".char-inner");
    if (!chars || chars.length === 0) return;

    // 1. Initial staggered reveal animation
    gsap.fromTo(
      chars,
      { y: "100%", fontWeight: 500 },
      {
        y: "0%",
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.02,
        delay,
        onComplete: () => {
          // Remove overflow-hidden from all wrapper spans so they don't clip the scaled/translated letters
          const wrappers = containerRef.current?.querySelectorAll(".char-wrapper");
          wrappers?.forEach((wrapper: any) => {
            wrapper.style.overflow = "visible";
          });
        }
      }
    );
  }, { scope: containerRef, dependencies: [start] });

  return (
    <span
      ref={containerRef}
      className={`inline-block select-none ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline-block">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="char-wrapper inline-block overflow-hidden"
            style={{ verticalAlign: "bottom" }}
          >
            <span 
              className="char-inner inline-block translate-y-[100%] origin-bottom"
              style={{ 
                willChange: "transform, font-weight"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  start?: boolean;
}

export default function SplitText({ 
  text, 
  className = "", 
  delay = 0,
  start = true 
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!start) return;
    const chars = containerRef.current?.querySelectorAll(".char-inner");
    if (!chars || chars.length === 0) return;

    gsap.fromTo(
      chars,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.02,
        delay,
      }
    );
  }, { scope: containerRef, dependencies: [start] });

  return (
    <span
      ref={containerRef}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline-block">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden"
            style={{ verticalAlign: "bottom" }}
          >
            <span className="char-inner inline-block translate-y-[100%]">
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

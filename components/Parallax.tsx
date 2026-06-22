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
    let isVisible = false;
    let elementMiddle = 0;

    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        elementMiddle = window.scrollY + rect.top + rect.height / 2;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          measure();
          handleScroll();
        }
      },
      { rootMargin: "20% 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    
    const handleScroll = () => {
      if (!isVisible) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollMiddle = window.scrollY + window.innerHeight / 2;
          const relativeOffset = (scrollMiddle - elementMiddle) * speed;
          setOffset(relativeOffset);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    
    // Initial measurement
    measure();
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      {children}
    </div>
  );
}

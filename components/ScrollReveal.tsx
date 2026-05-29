"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

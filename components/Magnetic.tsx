"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticProps {
  children: React.ReactElement<any>;
  range?: number;
  speed?: number;
}

export default function Magnetic({ children, range = 50, speed = 1.2 }: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rect: DOMRect | null = null;

    const handleMouseEnter = () => {
      rect = el.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (!rect) {
        rect = el.getBoundingClientRect();
      }
      const { left, top, width, height } = rect;
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      const distance = Math.sqrt(x * x + y * y);

      if (distance < range) {
        // Attract element
        gsap.to(el, {
          x: x * 0.35 * speed,
          y: y * 0.35 * speed,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Return to center
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
      }
    };

    const handleMouseLeave = () => {
      rect = null;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, speed]);

  return React.cloneElement(children, { ref });
}

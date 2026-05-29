"use client";

import React, { useRef, useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(true);

  // Declare proximity helper function at the top of component scope so it is naturally hoisted
  function initProximityEffect(chars: NodeListOf<Element>) {
    const mouse = { x: -9999, y: -9999 };

    // Record page-relative coordinates of the mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cache the initial layout coordinates of each character relative to the document
    interface CharCache {
      el: any;
      x: number;
      y: number;
      // Physics tracking for smooth manual interpolation (lerp)
      currentWeight: number;
      currentScale: number;
      currentY: number;
      isAtDefault: boolean;
    }
    
    let charCache: CharCache[] = [];

    const updateCache = () => {
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      charCache = Array.from(chars).map((charEl: any) => {
        const rect = charEl.getBoundingClientRect();
        return {
          el: charEl,
          x: rect.left + scrollX + rect.width / 2,
          y: rect.top + scrollY + rect.height / 2,
          currentWeight: 500,
          currentScale: 1,
          currentY: 0,
          isAtDefault: true
        };
      });
    };

    // Initialize cache
    updateCache();

    // Re-cache coordinates on window resize to ensure correctness
    window.addEventListener("resize", updateCache);

    // High performance animation loop via GSAP ticker (only math, no layout reads!)
    const onTick = () => {
      charCache.forEach((cache) => {
        const dx = mouse.x - cache.x;
        const dy = mouse.y - cache.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Proximity radius of influence
        const radius = 160;

        let targetWeight = 500;
        let targetScale = 1;
        let targetY = 0;

        if (distance < radius) {
          const factor = 1 - distance / radius;
          const easeFactor = factor * factor; // Quadratic falloff for smooth acceleration

          targetWeight = 500 + easeFactor * 300; // Interpolate weight from 500 to 800
          targetScale = 1 + easeFactor * 0.22;   // Scale up to 1.22x
          targetY = -easeFactor * 8;             // Lift character up by up to 8px
        }

        // Apply Lerp for smooth transition (spring physics simulation)
        const lerpSpeed = 0.16;
        cache.currentWeight += (targetWeight - cache.currentWeight) * lerpSpeed;
        cache.currentScale += (targetScale - cache.currentScale) * lerpSpeed;
        cache.currentY += (targetY - cache.currentY) * lerpSpeed;

        // Check if character is practically at its target to snap and avoid micro-calculations
        const isNearTarget = Math.abs(cache.currentWeight - targetWeight) < 0.5 &&
                             Math.abs(cache.currentScale - targetScale) < 0.005 &&
                             Math.abs(cache.currentY - targetY) < 0.05;

        if (isNearTarget) {
          cache.currentWeight = targetWeight;
          cache.currentScale = targetScale;
          cache.currentY = targetY;
        }

        // If it is not at its base state, update styles directly in DOM bypassing GSAP tweens
        const isDefault = cache.currentWeight === 500 && cache.currentScale === 1 && cache.currentY === 0;

        if (!isDefault) {
          cache.el.style.fontWeight = Math.round(cache.currentWeight).toString();
          // Use translate3d to offload rendering to the GPU (compositor layer)
          cache.el.style.transform = `translate3d(0, ${cache.currentY.toFixed(2)}px, 0) scale(${cache.currentScale.toFixed(3)})`;
          cache.isAtDefault = false;
        } else if (!cache.isAtDefault) {
          // Clear styles once to reset to stylesheet defaults
          cache.el.style.fontWeight = "";
          cache.el.style.transform = "";
          cache.isAtDefault = true;
        }
      });
    };

    gsap.ticker.add(onTick);

    // Save cleanup handle on the characters collection
    (chars as any)._cleanup = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateCache);
      gsap.ticker.remove(onTick);
      chars.forEach((charEl: any) => {
        charEl.style.fontWeight = "";
        charEl.style.transform = "";
      });
    };
  }

  useEffect(() => {
    // Check if the device has a mouse/trackpad pointer asynchronously to prevent cascading render warnings
    const checkTouch = !window.matchMedia("(pointer: fine)").matches;
    const frameId = requestAnimationFrame(() => {
      setIsMobile(checkTouch);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

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

          // Initialize proximity interactions once entry animation finishes (desktop only)
          if (!isMobile) {
            initProximityEffect(chars);
          }
        }
      }
    );
  }, { scope: containerRef, dependencies: [start, isMobile] });

  // Cleanup on unmount (with copied ref target to avoid layout/unmount race conditions)
  useEffect(() => {
    const currentContainer = containerRef.current;
    return () => {
      const chars = currentContainer?.querySelectorAll(".char-inner");
      if (chars && (chars as any)._cleanup) {
        (chars as any)._cleanup();
      }
    };
  }, []);

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

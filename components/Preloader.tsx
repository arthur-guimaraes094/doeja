"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const words = ["Alimento", "Cuidado", "Solidariedade", "Esperança", "DoeJÁ"];

  useGSAP(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const counter = counterRef.current;
    const header = headerRef.current;
    const status = statusRef.current;

    if (!container || !path) return;

    const wordElements = container.querySelectorAll(".preloader-word");

    const curtain = { ySide: 100, yCenter: 100 };

    const tl = gsap.timeline({
      onUpdate: () => {
        if (path) {
          path.setAttribute(
            "d",
            `M 0 0 L 100 0 L 100 ${curtain.ySide} Q 50 ${curtain.yCenter} 0 ${curtain.ySide} Z`
          );
        }
      },
      onComplete: () => {
        // Just in case, ensure it's hidden and has no pointer events
        gsap.set(container, { display: "none", pointerEvents: "none" });
      },
    });

    // 1. Text cycle sequence
    wordElements.forEach((word, index) => {
      const isLast = index === wordElements.length - 1;
      
      if (!isLast) {
        tl.fromTo(
          word,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
        ).to(
          word,
          { opacity: 0, y: -40, duration: 0.35, ease: "power3.in" },
          "+=0.12"
        );
      } else {
        // Last word "DoeJÁ" stays for a bit
        tl.fromTo(
          word,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
      }
    });

    // 2. Animate counter concurrently with the text cycle (0 to 100)
    if (counter) {
      tl.to(
        counter,
        {
          innerText: 100,
          duration: 3.5,
          snap: { innerText: 1 },
          ease: "power1.out",
          onUpdate: function () {
            const val = Math.floor(Number(counter.innerText));
            counter.innerText = val.toString().padStart(3, "0");
          },
        },
        0 // Start at the same time as word 0
      );
    }

    // 3. Exit Transition (retracting curtain morph)
    const exitTime = "+=0.2";
    tl.addLabel("exit", exitTime);
    
    // Fade out metadata UI
    tl.to([counter?.parentElement, header, status], {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    }, "exit");

    // Fade and slide out the last word "DoeJÁ"
    const lastWord = wordElements[wordElements.length - 1];
    tl.to(lastWord, {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: "power4.inOut",
    }, "exit");

    // Morph the SVG path to curve and pull up by animating coordinates on the curtain object
    // Both animations finish at exit + 1.0s for a seamless, unified merging transition at the top.
    tl.to(
      curtain,
      {
        ySide: 0,
        duration: 1.0,
        ease: "power3.inOut",
      },
      "exit"
    );

    tl.to(
      curtain,
      {
        yCenter: 0,
        duration: 0.8,
        ease: "power3.inOut",
      },
      "exit+=0.2"
    );

    // Call onComplete when the page starts to become visible (curtain is >90% pulled up)
    tl.call(() => {
      if (onComplete) onComplete();
    }, undefined, "exit+=0.85");

    // Disable mouse interactions and hide the container
    tl.set(container, {
      pointerEvents: "none",
    });
  }, { scope: containerRef, dependencies: [] });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-[9999] overflow-hidden select-none"
    >
      {/* Liquid morphing background */}
      <svg
        className="absolute inset-0 w-full h-full fill-[#211a17] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          ref={pathRef}
          d="M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z"
        />
      </svg>

      {/* Elegant minimal top header */}
      <div
        ref={headerRef}
        className="absolute top-margin-mobile left-margin-mobile md:top-md md:left-md z-10 font-display text-[10px] md:text-xs font-semibold tracking-[0.2em] text-white/50 uppercase"
      >
        DoeJÁ / Impacto Social
      </div>

      {/* Loading indicator */}
      <div
        ref={statusRef}
        className="absolute top-margin-mobile right-margin-mobile md:top-md md:right-md z-10 flex items-center gap-xs text-white/40"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
        <span className="font-display text-[10px] md:text-xs tracking-[0.15em] uppercase font-semibold">
          Carregando
        </span>
      </div>

      {/* Centered cycling words */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
        {words.map((word, index) => (
          <span
            key={index}
            className="preloader-word absolute font-display text-4xl md:text-6xl font-extrabold text-white tracking-tight opacity-0 whitespace-nowrap"
            style={{
              transform: "translateY(40px)",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Minimal counter */}
      <div className="absolute bottom-margin-mobile right-margin-mobile md:bottom-lg md:right-lg z-10 font-display font-medium text-4xl md:text-7xl text-white/20 tracking-tighter">
        <span ref={counterRef} className="tabular-nums font-semibold text-white/60">
          000
        </span>
        <span className="text-xs md:text-sm font-semibold tracking-wider text-white/40 ml-1">
          %
        </span>
      </div>
    </div>
  );
}

import React, { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export default function ImageReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const img = container.querySelector(".reveal-img");
    if (!img) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      container,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.inOut",
      }
    ).fromTo(
      img,
      { scale: 1.3 },
      {
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
      },
      "-=1.0"
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
      style={{ clipPath: "inset(100% 0% 0% 0%)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`reveal-img object-contain ${imgClassName}`}
      />
    </div>
  );
}

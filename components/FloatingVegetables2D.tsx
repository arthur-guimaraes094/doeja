"use client";

import React, { useRef, useEffect } from "react";

interface FloatingItem2D {
  img: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  vrot: number;
  baseSpeedY: number;
}

export default function FloatingVegetables2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageUrls = [
      { url: "/Abobora.webp", ratio: 711 / 615 },
      { url: "/Banana.webp", ratio: 1 },
      { url: "/Espinafre.webp", ratio: 1 },
      { url: "/Laranja.webp", ratio: 398 / 461 },
      { url: "/Maca.webp", ratio: 1 },
      { url: "/Morango.webp", ratio: 940 / 1230 },
      { url: "/Melancia.webp", ratio: 1428 / 1230 },
      { url: "/Pessego.webp", ratio: 1222 / 1230 },
      { url: "/Beringela.webp", ratio: 744 / 1230 },
      { url: "/Coco.webp", ratio: 1262 / 1230 },
    ];

    const images: HTMLImageElement[] = [];
    const items: FloatingItem2D[] = [];

    // Load SVG images
    imageUrls.forEach((itemInfo) => {
      const img = new Image();
      img.src = itemInfo.url;
      images.push(img);
    });

    let width = 0;
    let height = 0;

    // Initialize floating items (fewer on mobile for performance)
    const initItems = () => {
      items.length = 0;
      const count = width < 768 ? 15 : 25;
      
      for (let i = 0; i < count; i++) {
        const imgIndex = i % images.length;
        const img = images[imgIndex];
        const ratio = imageUrls[imgIndex].ratio;

        // Size in pixels (responsive sizing based on width)
        const sizeFactor = width < 768 ? 0.08 : 0.05; // 5% of screen width on desktop
        const baseWidth = Math.max(55, width * sizeFactor) * (1.0 + Math.random() * 0.4);
        const w = baseWidth * ratio;
        const h = baseWidth;

        // Random starting positions
        const x = Math.random() * width;
        const y = Math.random() * height;

        // Random velocities
        const vx = (Math.random() - 0.5) * 0.8;
        const baseSpeedY = 0.3 + Math.random() * 0.5; // Constant slow drift downwards
        const vy = baseSpeedY;

        items.push({
          img,
          x,
          y,
          vx,
          vy,
          width: w,
          height: h,
          rotation: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.008,
          baseSpeedY,
        });
      }
    };

    // Resize Observer to keep canvas buffer and layout sizes synchronized
    // Scale buffer by devicePixelRatio for sharp rendering on Retina/HiDPI screens
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      if (newWidth !== width || newHeight !== height) {
        const isMobile = newWidth < 768;
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
        width = newWidth;
        height = newHeight;
        canvas.width = newWidth * dpr;
        canvas.height = newHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = isMobile ? "medium" : "high";
        initItems();
      }
    });

    resizeObserver.observe(canvas);

    // Mouse Tracking Coordinates
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Scroll Physical Impulse
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Positive delta means scroll down -> push items UP (negative Y velocity in 2D canvas)
      // Clamping delta to prevent items from flying away too aggressively
      const maxImpulse = 3;
      const rawImpulse = delta * 0.01;
      const impulse = Math.max(-maxImpulse, Math.min(maxImpulse, rawImpulse));

      items.forEach((item) => {
        const randomFactor = 0.8 + Math.random() * 0.6;
        item.vy -= impulse * randomFactor; // Pushed opposite to scroll delta
        item.vrot += (Math.random() - 0.5) * impulse * 0.02;
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Animation Loop
    let animationFrameId: number;

    const updateAndDraw = () => {
      animationFrameId = requestAnimationFrame(updateAndDraw);

      ctx.clearRect(0, 0, width, height);

      // Inter-item collision detection and response
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i];
          const b = items[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const radiusA = Math.max(a.width, a.height) * 0.4;
          const radiusB = Math.max(b.width, b.height) * 0.4;
          const minDist = radiusA + radiusB;

          if (dist < minDist && dist > 0.1) {
            // Normalized collision axis
            const nx = dx / dist;
            const ny = dy / dist;

            // Overlap amount → proportional push strength
            const overlap = minDist - dist;
            const pushForce = overlap * 0.15;

            // Push both items apart equally
            a.vx -= nx * pushForce;
            a.vy -= ny * pushForce;
            b.vx += nx * pushForce;
            b.vy += ny * pushForce;

            // Separate positions to prevent sticking
            const separation = overlap * 0.5;
            a.x -= nx * separation;
            a.y -= ny * separation;
            b.x += nx * separation;
            b.y += ny * separation;

            // Add a little spin on contact
            a.vrot += (Math.random() - 0.5) * 0.02;
            b.vrot += (Math.random() - 0.5) * 0.02;
          }
        }
      }

      items.forEach((item) => {
        // Continuous slow wind force drift
        item.vx += Math.sin(Date.now() * 0.001 + item.x) * 0.005;
        item.vy += Math.cos(Date.now() * 0.001 + item.y) * 0.005;

        // Apply physical equations
        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.vrot;

        // Friction dampening
        item.vx *= 0.985;
        item.vy *= 0.985;
        item.vrot *= 0.985;

        // Restore Y base upward drift speed slowly
        item.vy += (item.baseSpeedY - item.vy) * 0.015;

        // Contact-only mouse repulsion
        const dx = item.x - mouseX;
        const dy = item.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Exact contact boundary threshold (half of maximum dimension)
        const radius = Math.max(item.width, item.height) * 0.55;

        if (distance < radius && distance > 0.1) {
          // High intensity direct contact repulsion
          const pushForce = ((radius - distance) / radius) * 2.8;
          item.vx += (dx / distance) * pushForce;
          item.vy += (dy / distance) * pushForce;
          
          // Spin element fast on contact
          item.vrot += (Math.random() - 0.5) * 0.06;
        }

        // Screen boundary wraps
        const marginW = item.width;
        const marginH = item.height;

        // Wrap horizontal bounds
        if (item.x > width + marginW) {
          item.x = -marginW;
        } else if (item.x < -marginW) {
          item.x = width + marginW;
        }

        // Wrap vertical bounds
        if (item.y > height + marginH) {
          item.y = -marginH;
          item.vy = item.baseSpeedY; // Reset to slow downward speed
        } else if (item.y < -marginH) {
          item.y = height + marginH;
          item.vy = item.baseSpeedY;
        }

        // Draw image onto 2D canvas context if fully loaded
        if (item.img.complete && item.img.naturalWidth !== 0) {
          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rotation);
          ctx.drawImage(item.img, -item.width / 2, -item.height / 2, item.width, item.height);
          ctx.restore();
        }
      });
    };

    updateAndDraw();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      aria-label="Fundo de vegetais e frutas 2D flutuantes com interatividade"
    />
  );
}

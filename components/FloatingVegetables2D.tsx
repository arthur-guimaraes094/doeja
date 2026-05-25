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

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const imageUrls = [
      { url: "/Abobora.svg", ratio: 711 / 615 },
      { url: "/Banana.svg", ratio: 1 },
      { url: "/Espinafre.svg", ratio: 1 },
      { url: "/Laranja.svg", ratio: 398 / 461 },
      { url: "/Maca.svg", ratio: 1 },
    ];

    const images: HTMLImageElement[] = [];
    const items: FloatingItem2D[] = [];

    // Load SVG images
    imageUrls.forEach((itemInfo) => {
      const img = new Image();
      img.src = itemInfo.url;
      images.push(img);
    });

    // Initialize 15 floating items
    const initItems = () => {
      items.length = 0;
      const count = 15;
      
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
        const baseSpeedY = -0.3 - Math.random() * 0.5; // Constant slow drift upwards
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

    // Re-initialize items when canvas sizes are ready
    initItems();

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
      const maxImpulse = 8;
      const rawImpulse = delta * 0.035;
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
          item.vy = item.baseSpeedY; // Reset to slow upward speed
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

    // Resize Handler
    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initItems(); // Recalculate dimensions for responsive sizes
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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

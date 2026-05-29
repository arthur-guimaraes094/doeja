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
      const count = width < 768 ? 6 : 12;
      
      for (let i = 0; i < count; i++) {
        const imgIndex = i % images.length;
        const img = images[imgIndex];
        const ratio = imageUrls[imgIndex].ratio;

        // Size in pixels (responsive sizing based on width)
        const sizeFactor = width < 768 ? 0.08 : 0.05; // 5% of screen width on desktop
        const baseWidth = Math.max(55, width * sizeFactor) * (1.0 + Math.random() * 0.4);
        const w = baseWidth * ratio;
        const h = baseWidth;

        // Distribute starting positions across the screen height for immediate visual presence on page load
        const x = Math.random() * width;
        const y = -h + Math.random() * (height + h);

        // Initial velocity - purely vertical falling (with initial vx = 0)
        const baseSpeedY = 0.4 + Math.random() * 0.6;
        const vx = 0;
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
        // Limit mobile to 1.0 DPR and desktop to 1.8 DPR to improve fill-rate performance
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.8);
        
        const isFirstInit = width === 0 && height === 0;
        const widthChanged = newWidth !== width;

        width = newWidth;
        height = newHeight;
        canvas.width = newWidth * dpr;
        canvas.height = newHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = isMobile ? "medium" : "high";
        
        // Only re-initialize items if it is the first load or if the width changed (e.g. orientation changes).
        // This prevents items from flashing/resetting when the browser address bar collapses/expands on scroll.
        if (isFirstInit || widthChanged) {
          initItems();
        }
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

      items.forEach((item) => {
        // Move item Y coordinate instantly with scroll delta for 1:1, delay-free scrolling
        item.y -= delta;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Page Visibility API to pause/resume rendering loop
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible) {
        lastTime = performance.now(); // Reset time to avoid massive jump
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateAndDraw = () => {
      animationFrameId = requestAnimationFrame(updateAndDraw);

      if (!isTabVisible) return;

      ctx.clearRect(0, 0, width, height);

      const nowTime = performance.now();
      const dt = Math.min((nowTime - lastTime) / 16.67, 4.0);
      lastTime = nowTime;

      // 1. Update Physics
      items.forEach((item) => {
        // Apply physical equations scaled by dt
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.rotation += item.vrot * dt;

        // Kinetic glide friction (lower friction for smoother inertia glide)
        const frictionFactor = Math.pow(0.992, dt);
        item.vx *= frictionFactor;
        item.vy *= frictionFactor;
        item.vrot *= frictionFactor;

        // Restore Y base upward drift speed slowly (adjusted for dt)
        item.vy += (item.baseSpeedY - item.vy) * 0.015 * dt;

        // Magnetic field hover repulsion (soft interaction field)
        const dx = item.x - mouseX;
        const dy = item.y - mouseY;
        const distSq = dx * dx + dy * dy;
        const influenceRadius = 220; // 220px field of influence
        const influenceRadiusSq = influenceRadius * influenceRadius;

        if (distSq < influenceRadiusSq) {
          const distance = Math.sqrt(distSq);
          if (distance > 0.1) {
            // Normalized direction vector from mouse to item
            const dirX = dx / distance;
            const dirY = dy / distance;

            // Distance factor (1 at center, 0 at boundary, using quadratic falloff for smoothness)
            const factor = (influenceRadius - distance) / influenceRadius;
            const force = factor * factor; // Smooth quadratic easing

            // Apply soft repulsion push force
            const pushForce = force * 0.45 * dt;
            item.vx += dirX * pushForce;
            item.vy += dirY * pushForce;

            // Add dynamic rotation based on mouse proximity
            item.vrot += (Math.random() - 0.5) * force * 0.015 * dt;

            // Direct contact extra kick (when mouse is very close)
            const contactRadius = Math.max(item.width, item.height) * 0.6;
            if (distance < contactRadius) {
              const contactFactor = (contactRadius - distance) / contactRadius;
              item.vx += dirX * contactFactor * 1.8 * dt;
              item.vy += dirY * contactFactor * 1.8 * dt;
              item.vrot += (Math.random() - 0.5) * contactFactor * 0.08 * dt;
            }
          }
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
        const bufferY = Math.max(height, 800);
        if (item.y > height + bufferY + marginH) {
          // When going too far below the viewport (e.g. by quick scroll up), wrap to top
          item.y = -marginH - Math.random() * 100;
          item.x = Math.random() * width;
          item.vy = item.baseSpeedY;
          item.vx = 0;
          item.vrot = (Math.random() - 0.5) * 0.008;
        } else if (item.y < -bufferY - marginH) {
          // When going too far above the viewport (e.g. by quick scroll down), wrap to bottom
          item.y = height + marginH + Math.random() * 100;
          item.x = Math.random() * width;
          item.vy = item.baseSpeedY;
          item.vx = 0;
          item.vrot = (Math.random() - 0.5) * 0.008;
        }
      });

      // 2. Resolve Collisions (Elastic circle-circle bounces)
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const itemA = items[i];
          const itemB = items[j];

          const dx = itemB.x - itemA.x;
          const dy = itemB.y - itemA.y;
          const distSq = dx * dx + dy * dy;

          const radiusA = Math.max(itemA.width, itemA.height) * 0.45;
          const radiusB = Math.max(itemB.width, itemB.height) * 0.45;
          const minDistance = radiusA + radiusB;
          const minDistanceSq = minDistance * minDistance;

          if (distSq < minDistanceSq) {
            const distance = Math.sqrt(distSq);
            if (distance > 0.1) {
              const dirX = dx / distance;
              const dirY = dy / distance;

              // Separate items to prevent overlapping
              const overlap = minDistance - distance;
              itemA.x -= dirX * overlap * 0.5;
              itemA.y -= dirY * overlap * 0.5;
              itemB.x += dirX * overlap * 0.5;
              itemB.y += dirY * overlap * 0.5;

              // Elastic collision velocity response
              const rvx = itemB.vx - itemA.vx;
              const rvy = itemB.vy - itemA.vy;

              // Relative velocity along normal direction
              const velAlongNormal = rvx * dirX + rvy * dirY;

              // Resolve only if items are moving towards each other
              if (velAlongNormal < 0) {
                const restitution = 0.5; // coefficient of bounciness
                const impulse = -(1 + restitution) * velAlongNormal * 0.5;

                itemA.vx -= dirX * impulse;
                itemA.vy -= dirY * impulse;
                itemB.vx += dirX * impulse;
                itemB.vy += dirY * impulse;

                // Transfer spin on bounce
                const spinTransfer = (itemA.vrot - itemB.vrot) * 0.15;
                itemA.vrot -= spinTransfer;
                itemB.vrot += spinTransfer;
                itemA.vrot += (Math.random() - 0.5) * 0.005;
                itemB.vrot += (Math.random() - 0.5) * 0.005;
              }
            }
          }
        }
      }

      // 3. Draw Items (Visible elements only)
      items.forEach((item) => {
        const marginH = item.height;
        const isVisible = item.y > -marginH && item.y < height + marginH;
        if (isVisible && item.img.complete && item.img.naturalWidth !== 0) {
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

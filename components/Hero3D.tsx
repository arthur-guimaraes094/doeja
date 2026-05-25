"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 15;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff8f6, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 5, 8);
    scene.add(keyLight);

    const greenFillLight = new THREE.PointLight(0xa8c66c, 2.5, 20);
    greenFillLight.position.set(-6, -3, 4);
    scene.add(greenFillLight);

    const orangeFillLight = new THREE.PointLight(0xf7941d, 2.0, 20);
    orangeFillLight.position.set(6, 3, 4);
    scene.add(orangeFillLight);

    // 5. Creating group to hold all animations
    const group = new THREE.Group();
    scene.add(group);

    // Group for logo letters
    const logoGroup = new THREE.Group();
    group.add(logoGroup);

    // 6. Loading and Extruding SVG Logo
    const svgLoader = new SVGLoader();
    svgLoader.load(
      "/logo.svg",
      (data) => {
        const paths = data.paths;

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const colorHex = path.color || new THREE.Color(0xffffff);

          const material = new THREE.MeshPhysicalMaterial({
            color: colorHex,
            roughness: 0.14,
            metalness: 0.08,
            clearcoat: 0.9,
            clearcoatRoughness: 0.1,
            flatShading: false,
            side: THREE.DoubleSide,
            depthWrite: true,
          });

          const shapes = SVGLoader.createShapes(path);

          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];

            // Extrude settings for tactile 3D letters
            const extrudeSettings = {
              depth: 3.5,
              bevelEnabled: true,
              bevelSegments: 5,
              steps: 1,
              bevelSize: 0.12,
              bevelThickness: 0.12,
            };

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const mesh = new THREE.Mesh(geometry, material);
            logoGroup.add(mesh);
          }
        }

        // Center the logo group geometries
        const box = new THREE.Box3().setFromObject(logoGroup);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Translate individual meshes so local pivot point is at center of logo bounding box
        logoGroup.children.forEach((child) => {
          child.position.sub(center);
        });

        // Set initial scale (negative Y flips SVG coordinate structure)
        logoGroup.scale.set(0.09, -0.09, 0.09);
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar o SVG no Canvas 3D:", error);
      }
    );

    // 7. Particles System (Orbital light points)
    const particleCount = 130;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const yOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 4.2 + Math.random() * 4.2; // Orbit radius between 4.2 and 8.4
      speeds[i] = 0.5 + Math.random() * 1.5;
      yOffsets[i] = (Math.random() - 0.5) * 5.5;

      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = yOffsets[i];
      positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x4d6617, // Brand primary green
      size: 0.16,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particleSystem);

    // 8. Mouse interaction tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const xVal = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const yVal = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouseX = xVal;
      targetMouseY = yVal;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // 9. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Animate 3D logo once paths have finished loading
      if (logoGroup.children.length > 0) {
        // Oscillating swing (yaw) rotation to maintain brand readability
        logoGroup.rotation.y = Math.sin(time * 0.55) * 0.28;
        logoGroup.rotation.x = Math.sin(time * 0.3) * 0.08;

        // Heartbeat pulse scale transition
        const pulseFactor = 1.0 + Math.sin(time * 2.5) * 0.025;
        logoGroup.scale.set(0.095 * pulseFactor, -0.095 * pulseFactor, 0.095 * pulseFactor);
      }

      // Smooth mouse rotation tilt follow
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      group.rotation.y = currentMouseX * 0.45;
      group.rotation.x = -currentMouseY * 0.35;

      // Orbit particles update
      const posArr = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += 0.003 * speeds[i];
        posArr[i * 3] = Math.cos(angles[i]) * radii[i];
        posArr[i * 3 + 1] = yOffsets[i] + Math.sin(time * 0.8 + i) * 0.12; // Waving orbit
        posArr[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Dynamic light movements based on mouse coordinates
      greenFillLight.position.x = -6 + currentMouseX * 3;
      greenFillLight.position.y = -3 + currentMouseY * 3;
      orangeFillLight.position.x = 6 - currentMouseX * 3;
      orangeFillLight.position.y = 3 - currentMouseY * 3;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Responsive resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      // Dispose logo geometries and materials
      logoGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] md:min-h-[400px] cursor-grab active:cursor-grabbing"
      aria-label="Logotipo 3D Interativo DoeJÁ"
    />
  );
}

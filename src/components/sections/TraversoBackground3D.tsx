"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface TraversoBackground3DProps {
  className?: string;
}

export default function TraversoBackground3D({ className = "" }: TraversoBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);

    // 2. WebGL Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 3. Simple & Elegant: 3 Calm Flowing Wave Lines
    const waveCount = 3;
    const pointsPerWave = 80;
    const waveData: {
      geometry: THREE.BufferGeometry;
      positions: Float32Array;
      line: THREE.Line;
      yBase: number;
      zBase: number;
      speed: number;
      freq: number;
      amp: number;
    }[] = [];

    const colors = [0x03aced, 0x67d5ea, 0x0284c7];
    const opacities = [0.45, 0.35, 0.25];

    for (let w = 0; w < waveCount; w++) {
      const positions = new Float32Array(pointsPerWave * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: colors[w],
        transparent: true,
        opacity: opacities[w],
        blending: THREE.NormalBlending,
      });

      const line = new THREE.Line(geometry, material);
      group.add(line);

      waveData.push({
        geometry,
        positions,
        line,
        yBase: (w - 1) * 2.5 - 2,
        zBase: (w - 1) * 2 - 4,
        speed: 0.45 + w * 0.12,
        freq: 0.16 + w * 0.03,
        amp: 1.4 + w * 0.3,
      });
    }

    // 4. Subtle, Calm Drifting Micro-Particles (Soft floating motes)
    const particleCount = 36;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: { vx: number; vy: number; vz: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 40;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 18;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 12 - 2;

      particleSpeeds.push({
        vx: (Math.random() - 0.5) * 0.006,
        vy: (Math.random() - 0.5) * 0.008,
        vz: (Math.random() - 0.5) * 0.004,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Soft circular radial gradient texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(3, 172, 237, 0.95)");
      gradient.addColorStop(0.4, "rgba(103, 213, 234, 0.5)");
      gradient.addColorStop(1, "rgba(3, 172, 237, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.7,
      map: particleTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    // 5. Gentle Mouse Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // 6. Resize Observer
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);

    // 7. Pause when offscreen
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // 8. Calm Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      // Gentle mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;
      group.rotation.y = mouse.x * 0.12;
      group.rotation.x = -mouse.y * 0.08;

      // Update 3 Smooth Wave Strands
      waveData.forEach((w, idx) => {
        const { positions, geometry, yBase, zBase, speed, freq, amp } = w;
        for (let i = 0; i < pointsPerWave; i++) {
          const norm = i / (pointsPerWave - 1);
          const x = (norm - 0.5) * 44;
          // Smooth progressive sine wave
          const y = yBase + Math.sin(x * freq + t * speed + idx * 1.1) * amp;
          const z = zBase + Math.cos(x * 0.08 + t * (speed * 0.6)) * 1.5;

          const i3 = i * 3;
          positions[i3] = x;
          positions[i3 + 1] = y;
          positions[i3 + 2] = z;
        }
        geometry.attributes.position.needsUpdate = true;
      });

      // Update Soft Micro-Particles
      const pArr = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pArr[i3] += particleSpeeds[i].vx;
        pArr[i3 + 1] += particleSpeeds[i].vy;
        pArr[i3 + 2] += particleSpeeds[i].vz;

        // Soft loop bounds
        if (pArr[i3] < -22) pArr[i3] = 22;
        if (pArr[i3] > 22) pArr[i3] = -22;
        if (pArr[i3 + 1] < -10) pArr[i3 + 1] = 10;
        if (pArr[i3 + 1] > 10) pArr[i3 + 1] = -10;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onPointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      waveData.forEach((w) => {
        w.geometry.dispose();
        (w.line.material as THREE.Material).dispose();
      });

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

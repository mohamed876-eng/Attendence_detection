import React, { useEffect, useRef } from 'react';
import { TimelineState } from '../types';

interface SmokeCanvasProps {
  timeline: TimelineState;
  targetFaceScenePos: { x: number; y: number }; // Absolute pixel coordinates in scene
  sceneWidth: number;
  sceneHeight: number;
}

interface SmokePuff {
  x: number;
  y: number;
  baseRadius: number;
  opacity: number;
  angle: number;
  angularVelocity: number;
  vx: number;
  vy: number;
  shade: number; // For subtle charcoal variance
}

export const SmokeCanvas: React.FC<SmokeCanvasProps> = ({
  timeline,
  targetFaceScenePos,
  sceneWidth,
  sceneHeight
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const puffsRef = useRef<SmokePuff[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  // Initialize smoke puff particles
  useEffect(() => {
    if (sceneWidth <= 0 || sceneHeight <= 0) return;

    const count = 95;
    const puffs: SmokePuff[] = [];

    for (let i = 0; i < count; i++) {
      puffs.push({
        x: Math.random() * sceneWidth,
        y: Math.random() * sceneHeight,
        baseRadius: 80 + Math.random() * 100,
        opacity: 0.88 + Math.random() * 0.12,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.007,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        shade: Math.floor(Math.random() * 12)
      });
    }

    puffsRef.current = puffs;
  }, [sceneWidth, sceneHeight]);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = sceneWidth * dpr;
    canvas.height = sceneHeight * dpr;
    ctx.scale(dpr, dpr);

    const now = performance.now();
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = now;

    const { apertureProgress, isReducedMotion } = timeline;
    const targetX = targetFaceScenePos.x;
    const targetY = targetFaceScenePos.y;

    // In reduced-motion mode, keep a fixed opening
    const effectiveAperture = isReducedMotion ? 0.95 : apertureProgress;

    // Calculate dynamic aperture radius
    const maxApertureRadius = Math.min(sceneWidth, sceneHeight) * 0.36;
    const currentApertureRadius = effectiveAperture * maxApertureRadius;

    // Clear canvas
    ctx.clearRect(0, 0, sceneWidth, sceneHeight);

    // Base black background matching #000000 canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, sceneWidth, sceneHeight);

    // Update and draw billowing smoke puff particles
    const puffs = puffsRef.current;
    const tSec = now * 0.001;

    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];

      if (!isReducedMotion) {
        // Natural billowing drift
        p.angle += p.angularVelocity;
        p.x += p.vx + Math.sin(tSec * 0.5 + i) * 0.2;
        p.y += p.vy + Math.cos(tSec * 0.4 + i) * 0.2;

        // Wrap around scene edges smoothly with margin
        const pad = p.baseRadius * 1.2;
        if (p.x < -pad) p.x = sceneWidth + pad;
        if (p.x > sceneWidth + pad) p.x = -pad;
        if (p.y < -pad) p.y = sceneHeight + pad;
        if (p.y > sceneHeight + pad) p.y = -pad;

        // Radial repulsion & curl when aperture is opening/open
        if (currentApertureRadius > 5) {
          const dx = p.x - targetX;
          const dy = p.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const repulseBoundary = currentApertureRadius * 1.25;

          if (dist < repulseBoundary) {
            // Push particle outward toward the rim
            const pushFactor = (1 - dist / repulseBoundary) * 60 * dt;
            p.x += (dx / dist) * pushFactor;
            p.y += (dy / dist) * pushFactor;

            // Swirl / curl tangentially around the rim to create curling eddies
            const curlSign = i % 2 === 0 ? 1 : -1;
            const curlSpeed = (1 - dist / repulseBoundary) * 45 * dt * curlSign;
            p.x += (-dy / dist) * curlSpeed;
            p.y += (dx / dist) * curlSpeed;
          }
        }
      }

      // Draw black smoke puff with subtle charcoal edges so movement stays visible against #000000
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      const rad = p.baseRadius;
      const grad = ctx.createRadialGradient(0, 0, rad * 0.1, 0, 0, rad);
      const s = p.shade;
      // Core: dense black
      grad.addColorStop(0, `rgba(0, 0, 0, ${p.opacity})`);
      // Mid: rich charcoal
      grad.addColorStop(0.52, `rgba(${16 + s}, ${18 + s}, ${24 + s}, ${p.opacity * 0.9})`);
      // Outer subtle charcoal highlight rim so curls and billows catch visible light against black
      grad.addColorStop(0.85, `rgba(${32 + s * 2}, ${36 + s * 2}, ${46 + s * 2}, ${p.opacity * 0.4})`);
      // Dissolve seamlessly to #000000
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Clear organic opening in the smoke mask using destination-out to reveal the portrait
    if (currentApertureRadius > 1) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      // Draw organic undulating aperture hole that curls at its boundary
      const numPoints = 64;
      ctx.beginPath();

      for (let j = 0; j <= numPoints; j++) {
        const theta = (j / numPoints) * Math.PI * 2;
        // Harmonic billowing modulation for curling boundary edges
        const wave1 = Math.sin(theta * 4 + tSec * 1.8) * 0.08;
        const wave2 = Math.cos(theta * 6 - tSec * 1.2) * 0.05;
        const wave3 = Math.sin(theta * 9 + tSec * 2.5) * 0.03;
        const rMod = 1 + wave1 + wave2 + wave3;
        const r = currentApertureRadius * rMod;

        const px = targetX + Math.cos(theta) * r;
        const py = targetY + Math.sin(theta) * r;

        if (j === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();

      // Soft gradient feather from center to curled rim
      const clearGrad = ctx.createRadialGradient(
        targetX,
        targetY,
        currentApertureRadius * 0.35,
        targetX,
        targetY,
        currentApertureRadius * 1.05
      );
      clearGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      clearGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)');
      clearGrad.addColorStop(0.9, 'rgba(0, 0, 0, 0.6)');
      clearGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = clearGrad;
      ctx.fill();
      ctx.restore();

      // Add foreground curling charcoal smoke wisps framing the opening
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      const rimWispsCount = 14;
      for (let k = 0; k < rimWispsCount; k++) {
        const angle = (k / rimWispsCount) * Math.PI * 2 + tSec * 0.28;
        const rimDist = currentApertureRadius * (0.92 + 0.14 * Math.sin(tSec + k));
        const wx = targetX + Math.cos(angle) * rimDist;
        const wy = targetY + Math.sin(angle) * rimDist;
        const wRadius = 42 + 16 * Math.sin(k * 2);

        const wGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, wRadius);
        wGrad.addColorStop(0, 'rgba(28, 32, 42, 0.65)');
        wGrad.addColorStop(0.55, 'rgba(20, 23, 30, 0.4)');
        wGrad.addColorStop(0.85, 'rgba(36, 42, 54, 0.2)');
        wGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = wGrad;
        ctx.beginPath();
        ctx.arc(wx, wy, wRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }, [timeline, targetFaceScenePos, sceneWidth, sceneHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="hadir-smoke-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TimelineState, AnimationPhase } from '../types';
import { CYCLE_TARGETS, TIMELINE } from '../config';
import { SmokeCanvas } from './SmokeCanvas';
import { FocusBrackets } from './FocusBrackets';

// Easing helper functions
const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
const easeInOutQuad = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

export const HeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 520, height: 520 });

  // Check for prefers-reduced-motion
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update container dimensions with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Unified animation state
  const [timelineState, setTimelineState] = useState<TimelineState>({
    elapsedMs: 0,
    cycleProgress: 0,
    phase: 'opening',
    activeTarget: CYCLE_TARGETS[0],
    apertureProgress: 0,
    bracketLockFactor: 0,
    portraitScale: 0.94,
    isReducedMotion: false
  });

  // Keep target index in ref for the animation loop
  const targetIndexRef = useRef(0);
  const hasSwappedInCycleRef = useRef(false);

  // Animation frame loop
  useEffect(() => {
    if (isReducedMotion) {
      // In reduced-motion mode: static locked view of the first target
      setTimelineState({
        elapsedMs: 2500,
        cycleProgress: 2500 / TIMELINE.CYCLE_DURATION_MS,
        phase: 'locked',
        activeTarget: CYCLE_TARGETS[0],
        apertureProgress: 1.0,
        bracketLockFactor: 1.0,
        portraitScale: 1.0,
        isReducedMotion: true
      });
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;

    const updateLoop = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const totalElapsed = timestamp - startTime;
      const elapsedInCycle = totalElapsed % TIMELINE.CYCLE_DURATION_MS;
      const cycleProgress = elapsedInCycle / TIMELINE.CYCLE_DURATION_MS;

      let phase: AnimationPhase = 'closed';
      let apertureProgress = 0;
      let bracketLockFactor = 0;
      let portraitScale = 0.94;

      // Phase 1: OPENING & LOCK (0ms - 1000ms)
      if (elapsedInCycle < TIMELINE.OPENING_END_MS) {
        phase = 'opening';
        const p = elapsedInCycle / TIMELINE.OPENING_END_MS;
        const eased = easeOutCubic(p);
        apertureProgress = eased;
        bracketLockFactor = eased;
        // Subtle push-in as brackets settle: 0.94 -> 1.03
        portraitScale = 0.94 + eased * 0.09;
        hasSwappedInCycleRef.current = false;
      }
      // Phase 2: LOCKED & HOLD (1000ms - 4000ms: 3 seconds steady hold)
      else if (elapsedInCycle < TIMELINE.HOLD_END_MS) {
        phase = 'locked';
        apertureProgress = 1.0;
        bracketLockFactor = 1.0;
        // Subtle breathing depth during lock hold (1.03 to 1.04)
        const holdProgress = (elapsedInCycle - TIMELINE.OPENING_END_MS) / (TIMELINE.HOLD_END_MS - TIMELINE.OPENING_END_MS);
        portraitScale = 1.03 + Math.sin(holdProgress * Math.PI) * 0.015;
      }
      // Phase 3: CLOSING (4000ms - 5000ms)
      else if (elapsedInCycle < TIMELINE.CLOSING_END_MS) {
        phase = 'closing';
        const p = (elapsedInCycle - TIMELINE.HOLD_END_MS) / (TIMELINE.CLOSING_END_MS - TIMELINE.HOLD_END_MS);
        const eased = easeInOutQuad(p);
        apertureProgress = 1.0 - eased;
        bracketLockFactor = 1.0 - eased;
        portraitScale = 1.03 - eased * 0.09;
      }
      // Phase 4: CLOSED (5000ms - 7000ms: 2 seconds closed for next student)
      else {
        phase = 'closed';
        apertureProgress = 0;
        bracketLockFactor = 0;
        portraitScale = 0.94;

        // Swap portrait and position once smoke fully covers it (at SWAP_AT_MS)
        if (elapsedInCycle >= TIMELINE.SWAP_AT_MS && !hasSwappedInCycleRef.current) {
          hasSwappedInCycleRef.current = true;
          const nextIndex = (targetIndexRef.current + 1) % CYCLE_TARGETS.length;
          targetIndexRef.current = nextIndex;
        }
      }

      setTimelineState({
        elapsedMs: elapsedInCycle,
        cycleProgress,
        phase,
        activeTarget: CYCLE_TARGETS[targetIndexRef.current],
        apertureProgress,
        bracketLockFactor,
        portraitScale,
        isReducedMotion: false
      });

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isReducedMotion]);

  const activeTarget = timelineState.activeTarget;
  const currentStudent = activeTarget.student;
  const currentPosition = activeTarget.position;

  // Calculate face scene coordinates in pixels
  const targetFaceScenePos = useMemo(() => {
    return {
      x: currentPosition.faceSceneCoords.x * dimensions.width,
      y: currentPosition.faceSceneCoords.y * dimensions.height
    };
  }, [currentPosition, dimensions]);

  // Calculate loose floating frame coordinates when cloud is closed
  const looseCenterPos = useMemo(() => {
    const t = timelineState.elapsedMs * 0.0015;
    return {
      x: dimensions.width * 0.5 + Math.sin(t) * 28,
      y: dimensions.height * 0.5 + Math.cos(t * 0.8) * 22
    };
  }, [dimensions, timelineState.elapsedMs]);

  // Portrait size inside the scene — kept at 50% so every student's portrait
  // fits fully within the scene bounds regardless of face offset within the image.
  const portraitSize = Math.min(dimensions.width, dimensions.height) * 0.50;

  // Position portrait using configurable faceCenter
  const portraitLeft = targetFaceScenePos.x - currentStudent.faceCenter.x * portraitSize;
  const portraitTop = targetFaceScenePos.y - currentStudent.faceCenter.y * portraitSize;

  return (
    <div
      ref={containerRef}
      className="hadir-hero-scene"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        aspectRatio: '1 / 1',
        minHeight: '380px',
        backgroundColor: '#000000',
        overflow: 'hidden',
        display: 'flex',
        borderRadius: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
      aria-label="Interactive Face Recognition Attendance Scene"
    >
      {/* Student Portrait Layer — invisible until smoke opens */}
      <div
        className="hadir-portrait-container"
        style={{
          position: 'absolute',
          left: `${portraitLeft}px`,
          top: `${portraitTop}px`,
          width: `${portraitSize}px`,
          height: `${portraitSize}px`,
          transform: `scale(${timelineState.portraitScale})`,
          transformOrigin: `${currentStudent.faceCenter.x * 100}% ${currentStudent.faceCenter.y * 100}%`,
          opacity: isReducedMotion ? 1 : timelineState.apertureProgress,
          transition: isReducedMotion ? 'none' : 'transform 0.25s ease-out',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <img
          src={currentStudent.image}
          alt={currentStudent.name}
          className="hadir-duotone-portrait"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'contrast(1.12) brightness(1.02) saturate(1.2)',
            display: 'block'
          }}
        />
      </div>

      {/* Dense Black Smoke Canvas Layer - stuck seamlessly on the black canvas */}
      <SmokeCanvas
        timeline={timelineState}
        targetFaceScenePos={targetFaceScenePos}
        sceneWidth={dimensions.width}
        sceneHeight={dimensions.height}
      />

      {/* Clean 4 White Focus Brackets */}
      <FocusBrackets
        timeline={timelineState}
        targetFaceScenePos={targetFaceScenePos}
        looseCenterPos={looseCenterPos}
        focusBoxSize={currentStudent.focusBoxSize}
      />
    </div>
  );
};

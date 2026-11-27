import React from 'react';
import { TimelineState } from '../types';

interface FocusBracketsProps {
  timeline: TimelineState;
  targetFaceScenePos: { x: number; y: number };
  looseCenterPos: { x: number; y: number };
  focusBoxSize: { width: number; height: number };
}

export const FocusBrackets: React.FC<FocusBracketsProps> = ({
  timeline,
  targetFaceScenePos,
  looseCenterPos,
  focusBoxSize
}) => {
  const { bracketLockFactor, phase, isReducedMotion } = timeline;

  // In reduced motion, brackets are already locked on the face
  const lockFactor = isReducedMotion ? 1 : bracketLockFactor;

  // Loose frame size over dark smoke
  const looseWidth = 220;
  const looseHeight = 220;

  // Current interpolated center position
  const currentCenterX = looseCenterPos.x + (targetFaceScenePos.x - looseCenterPos.x) * lockFactor;
  const currentCenterY = looseCenterPos.y + (targetFaceScenePos.y - looseCenterPos.y) * lockFactor;

  // Current interpolated dimensions (contracts as camera acquires focus)
  const currentWidth = looseWidth + (focusBoxSize.width - looseWidth) * lockFactor;
  const currentHeight = looseHeight + (focusBoxSize.height - looseHeight) * lockFactor;

  // Corner arm parameters: four thin white L-shaped corners with 90-degree angles and open gaps
  const armLength = 22; // 22px arm length
  const armThickness = 2; // thin 2px white lines

  const isLocked = phase === 'locked' || isReducedMotion;

  return (
    <div
      className={`hadir-focus-brackets-container ${isLocked ? 'is-locked' : ''}`}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20
      }}
    >
      {/* 4 Thin White L-shaped Corners Frame */}
      <div
        className="hadir-reticle"
        style={{
          position: 'absolute',
          left: `${currentCenterX}px`,
          top: `${currentCenterY}px`,
          width: `${currentWidth}px`,
          height: `${currentHeight}px`,
          transform: 'translate(-50%, -50%)',
          transition: isReducedMotion ? 'none' : 'box-shadow 0.2s ease',
          boxShadow: isLocked ? '0 0 24px rgba(255, 255, 255, 0.15)' : 'none'
        }}
      >
        {/* Top-Left Corner L */}
        <div
          className="corner-l corner-tl"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${armLength}px`,
            height: `${armLength}px`,
            borderTop: `${armThickness}px solid #FFFFFF`,
            borderLeft: `${armThickness}px solid #FFFFFF`,
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
          }}
        />

        {/* Top-Right Corner L */}
        <div
          className="corner-l corner-tr"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: `${armLength}px`,
            height: `${armLength}px`,
            borderTop: `${armThickness}px solid #FFFFFF`,
            borderRight: `${armThickness}px solid #FFFFFF`,
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
          }}
        />

        {/* Bottom-Left Corner L */}
        <div
          className="corner-l corner-bl"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${armLength}px`,
            height: `${armLength}px`,
            borderBottom: `${armThickness}px solid #FFFFFF`,
            borderLeft: `${armThickness}px solid #FFFFFF`,
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
          }}
        />

        {/* Bottom-Right Corner L */}
        <div
          className="corner-l corner-br"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: `${armLength}px`,
            height: `${armLength}px`,
            borderBottom: `${armThickness}px solid #FFFFFF`,
            borderRight: `${armThickness}px solid #FFFFFF`,
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
          }}
        />
      </div>
    </div>
  );
};

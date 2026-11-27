export interface FaceCenter {
  /** Normalized X position within portrait (0.0 to 1.0) */
  x: number;
  /** Normalized Y position within portrait (0.0 to 1.0) */
  y: number;
}

export interface FocusBoxSize {
  width: number;
  height: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  department: string;
  image: string;
  /** Configurable face center point within portrait */
  faceCenter: FaceCenter;
  /** Configurable focus box dimensions in pixels */
  focusBoxSize: FocusBoxSize;
  confidence: number;
  checkInTime: string;
  statusText: string;
}

export type ScenePositionId = 'upper-left' | 'center-right' | 'lower-center' | 'upper-right' | 'center-left' | 'center-mid';

export interface ScenePositionPreset {
  id: ScenePositionId;
  label: string;
  /** Normalized (0.0 to 1.0) scene coordinates where face center should align */
  faceSceneCoords: {
    x: number;
    y: number;
  };
}

export interface CycleTarget {
  student: StudentProfile;
  position: ScenePositionPreset;
}

export type AnimationPhase = 
  | 'opening'     // 0s - 1s (Smoke opens, brackets sweep & contract, portrait pushes in)
  | 'locked'      // 1s - 4s (Hold in focus for 3s, steady lock)
  | 'closing'     // 4s - 5s (Smoke curls & closes over face)
  | 'closed';     // 5s - 7s (Dense black smoke, brackets drift loose, target swapped)

export interface TimelineState {
  /** Total elapsed time in current cycle (0ms to 7000ms) */
  elapsedMs: number;
  /** Normalized progress within current cycle (0.0 to 1.0) */
  cycleProgress: number;
  /** Current animation phase */
  phase: AnimationPhase;
  /** Current student and scene position */
  activeTarget: CycleTarget;
  /** Current smoke aperture openness (0.0 = fully closed, 1.0 = fully open) */
  apertureProgress: number;
  /** Current brackets interpolation factor (0.0 = loose drift, 1.0 = locked on face) */
  bracketLockFactor: number;
  /** Current portrait push-in scale factor (e.g. 0.95 to 1.03) */
  portraitScale: number;
  /** Whether reduced-motion is requested */
  isReducedMotion: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  department: string;
  avatar: string;
  rating: number; // 1 to 5
  quote: string;
  isDemo?: boolean;
}

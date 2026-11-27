import { StudentProfile, ScenePositionPreset, CycleTarget } from './types';
import achrafImg from './assets/students/achraf.png';
import abdelkrimiImg from './assets/students/abdelkrimi.png';
import abdallahImg from './assets/students/abdallah.png';
import amineImg from './assets/students/amine.png';
import mazyouniImg from './assets/students/mazyouni.png';

/**
 * Predefined scene positions ensuring the entire face, portrait, and brackets
 * remain completely visible with ample margins inside the left scene.
 */
// Scene positions are tuned per-student so that every portrait stays
// fully inside the scene bounds regardless of face offset within the image.
// Each position is set at the CYCLE_TARGETS level, not globally here.
export const SCENE_POSITIONS: Record<string, ScenePositionPreset> = {
  upperLeft: {
    id: 'upper-left',
    label: 'Upper Left',
    faceSceneCoords: { x: 0.30, y: 0.32 }
  },
  centerRight: {
    id: 'center-right',
    label: 'Center Right',
    faceSceneCoords: { x: 0.68, y: 0.50 }
  },
  lowerCenter: {
    id: 'lower-center',
    label: 'Lower Center',
    faceSceneCoords: { x: 0.46, y: 0.60 }
  },
  upperRight: {
    id: 'upper-right',
    label: 'Upper Right',
    faceSceneCoords: { x: 0.65, y: 0.28 }
  },
  centerLeft: {
    id: 'center-left',
    label: 'Center Left',
    faceSceneCoords: { x: 0.32, y: 0.55 }
  },
  // Dedicated position for abdallah whose face is far-right in the image
  centerMid: {
    id: 'center-mid',
    label: 'Center Mid',
    faceSceneCoords: { x: 0.72, y: 0.42 }
  }
};

/**
 * Student configurations with precise face centers (from alpha-weighted centroid analysis)
 * and focus box sizes. Coordinates are normalized 0–1 within the 500×500 source image.
 */
export const STUDENTS: StudentProfile[] = [
  {
    id: 'achraf',
    name: 'Achraf E.',
    studentId: 'STU-9204',
    department: 'Software Engineering',
    image: achrafImg,
    // Alpha-centroid of top-40% content region: face center in normalized image coords
    faceCenter: { x: 0.486, y: 0.34 },
    focusBoxSize: { width: 136, height: 154 },
    confidence: 99.8,
    checkInTime: '08:31 AM',
    statusText: 'Verified • Present'
  },
  {
    id: 'abdelkrimi',
    name: 'Abdelkrim I.',
    studentId: 'STU-8419',
    department: 'Artificial Intelligence',
    image: abdelkrimiImg,
    faceCenter: { x: 0.532, y: 0.300 },
    focusBoxSize: { width: 140, height: 158 },
    confidence: 99.6,
    checkInTime: '08:33 AM',
    statusText: 'Verified • Present'
  },
  {
    id: 'abdallah',
    name: 'Abdallah M.',
    studentId: 'STU-7731',
    department: 'Computer Science',
    image: abdallahImg,
    faceCenter: { x: 0.742, y: 0.4 },
    focusBoxSize: { width: 132, height: 150 },
    confidence: 99.4,
    checkInTime: '08:35 AM',
    statusText: 'Verified • Present'
  },
  {
    id: 'amine',
    name: 'Amine B.',
    studentId: 'STU-6815',
    department: 'Data Science',
    image: amineImg,
    faceCenter: { x: 0.472, y: 0.402 },
    focusBoxSize: { width: 188, height: 206 },
    confidence: 99.7,
    checkInTime: '08:28 AM',
    statusText: 'Verified • Present'
  },
  {
    id: 'mazyouni',
    name: 'Mazyouni R.',
    studentId: 'STU-5503',
    department: 'Network Engineering',
    image: mazyouniImg,
    faceCenter: { x: 0.546, y: 0.438 },
    focusBoxSize: { width: 142, height: 162 },
    confidence: 99.5,
    checkInTime: '08:40 AM',
    statusText: 'Verified • Present'
  }
];

/**
 * Ordered cycle targets: each student appears at a different position,
 * cycling through all 5 students before repeating.
 */
export const CYCLE_TARGETS: CycleTarget[] = [
  { student: STUDENTS[0], position: SCENE_POSITIONS.upperLeft },      // Achraf → upper-left
  { student: STUDENTS[1], position: SCENE_POSITIONS.centerRight },    // Abdelkrim → center-right
  { student: STUDENTS[2], position: SCENE_POSITIONS.centerMid },      // Abdallah → dedicated center (face is far-right in image)
  { student: STUDENTS[3], position: SCENE_POSITIONS.upperRight },     // Amine → upper-right
  { student: STUDENTS[4], position: SCENE_POSITIONS.centerLeft },     // Mazyouni → center-left
  { student: STUDENTS[0], position: SCENE_POSITIONS.lowerCenter },    // Achraf → lower-center
  { student: STUDENTS[2], position: SCENE_POSITIONS.centerRight },    // Abdallah → center-right (second appearance)
  { student: STUDENTS[1], position: SCENE_POSITIONS.upperLeft },      // Abdelkrim → upper-left
  { student: STUDENTS[4], position: SCENE_POSITIONS.upperRight },     // Mazyouni → upper-right
  { student: STUDENTS[3], position: SCENE_POSITIONS.lowerCenter },    // Amine → lower-center
];

/**
 * Timeline constants matching specifications:
 * - 7s total cycle
 * - 5s open (1s open & lock, 3s hold, 1s close)
 * - 2s closed (reposition student under dense smoke)
 */
export const TIMELINE = {
  CYCLE_DURATION_MS: 7000,
  OPENING_END_MS: 1000,
  HOLD_END_MS: 4000,
  CLOSING_END_MS: 5000,
  SWAP_AT_MS: 5200 // Swap target safely while smoke is 100% opaque
};

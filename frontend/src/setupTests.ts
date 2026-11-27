import '@testing-library/jest-dom';

// Mock HTMLCanvasElement.getContext for JSDOM
HTMLCanvasElement.prototype.getContext = () => ({
  scale: () => {},
  clearRect: () => {},
  fillRect: () => {},
  save: () => {},
  restore: () => {},
  translate: () => {},
  rotate: () => {},
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  createRadialGradient: () => ({
    addColorStop: () => {}
  })
} as any);


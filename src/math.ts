const degToRadFactor = Math.PI / 180;
export function degToRad(degrees: number): number {
  return degrees * degToRadFactor;
}

const radToDegFactor = 180 / Math.PI;
export function radToDeg(radians: number): number {
  return radians * radToDegFactor;
}

export function remap(
  x: number,
  a0: number,
  a1: number,
  b0: number,
  b1: number,
) {
  return b0 + ((b1 - b0) * (x - a0)) / (a1 - a0);
}

export function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(x, max));
}

export function randomRange(min: number, max: number) {
  return remap(Math.random(), 0, 1, min, max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

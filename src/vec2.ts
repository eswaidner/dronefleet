export interface Vec2 {
  x: number;
  y: number;
}

export function create(x: number = 0, y: number = 0): Vec2 {
  return { x, y };
}

export function clone(v: Vec2): Vec2 {
  return create(v.x, v.y);
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return create(a.x + b.x, a.y + b.y);
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return create(a.x - b.x, a.y - b.y);
}

export function scale(a: Vec2, b: number): Vec2 {
  return create(a.x * b, a.y * b);
}

export function rotate(v: Vec2, radians: number): Vec2 {
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);
  const newX = v.x * cosTheta - v.y * sinTheta;
  const newY = v.x * sinTheta + v.y * cosTheta;
  return create(newX, newY);
}

export function sqMag(v: Vec2): number {
  return v.x * v.x + v.y * v.y;
}

export function mag(v: Vec2): number {
  return Math.sqrt(sqMag(v));
}

export function normalize(a: Vec2): Vec2 {
  const len = mag(a);
  if (len === 0) return create();

  return create(a.x / len, a.y / len);
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function det(a: Vec2, b: Vec2): number {
  return a.x * b.y - a.y * b.x;
}

export function angle(a: Vec2, b: Vec2): number {
  const magA = mag(a);
  const magB = mag(b);

  if (magA === 0 || magB === 0) return 0;

  const cosTheta = dot(a, b) / (magA * magB);
  return Math.acos(cosTheta);
}

export function signedAngle(a: Vec2, b: Vec2): number {
  const magA = Math.sqrt(a.x ** 2 + a.y ** 2);
  const magB = Math.sqrt(b.x ** 2 + b.y ** 2);

  if (magA === 0 || magB === 0) return 0;

  return Math.atan2(det(a, b), dot(a, b));
}

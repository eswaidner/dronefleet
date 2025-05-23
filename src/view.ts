import type { Vec2 } from "./vec2";
import { vec2 } from "./zen";

let _gfx: CanvasRenderingContext2D;
let _screenSize: Vec2 = vec2.create();
const _position: Vec2 = vec2.create();
let _pixelsPerUnit: number = 50;

function init() {
  const canvas = document.querySelector("#app")! as HTMLCanvasElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  _gfx = canvas.getContext("2d")!;
  new ResizeObserver(onResize).observe(canvas, { box: "content-box" });

  // force a reflow to immediately invoke resize callback
  window.getComputedStyle(canvas).width;
}

export function gfx(): CanvasRenderingContext2D {
  return _gfx;
}

export function position(): Vec2 {
  return vec2.clone(_position);
}

export function screenSize(): Vec2 {
  return vec2.clone(_screenSize);
}

export function pixelsPerUnit(): number {
  return _pixelsPerUnit;
}

export function setPixelsPerUnit(pixels: number) {
  _pixelsPerUnit = pixels;
}

export function screenToWorld(screenPos: Vec2): Vec2 {
  // normalize coordinates
  let pos = vec2.clone(screenPos);
  pos = vec2.scale(pos, 1 / _pixelsPerUnit);

  return vec2.add(pos, _position);
}

export function worldToScreen(worldPos: Vec2): Vec2 {
  let pos = vec2.sub(worldPos, _position);
  pos = vec2.scale(pos, _pixelsPerUnit);
  return pos;
}

function onResize(entries: ResizeObserverEntry[]) {
  for (const entry of entries) {
    const dpr = window.devicePixelRatio;
    const size = entry.devicePixelContentBoxSize[0];
    const displayWidth = Math.round(size.inlineSize / dpr);
    const displayHeight = Math.round(size.blockSize / dpr);

    _screenSize.x = displayWidth;
    _screenSize.y = displayHeight;

    const needResize =
      _gfx.canvas.width !== displayWidth ||
      _gfx.canvas.height !== displayHeight;

    if (needResize) {
      _gfx.canvas.width = displayWidth;
      _gfx.canvas.height = displayHeight;
    }
  }
}

init();

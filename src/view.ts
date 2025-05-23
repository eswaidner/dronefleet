import { mat3, vec2, type Vec2 } from "wgpu-matrix";
import { Transform } from "./transforms";

let _gfx: CanvasRenderingContext2D;
const _transform: Transform = new Transform({ pivot: vec2.create(0.5, 0.5) });
let _screenSize: Vec2 = vec2.create();
let _renderSize: Vec2 = vec2.create();
let _zoom: number = 0.01;

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

export function transform(): Transform {
  return _transform;
}

export function screenSize(): Vec2 {
  return vec2.clone(_screenSize);
}

export function renderSize(): Vec2 {
  return vec2.clone(_renderSize);
}

export function zoom(): number {
  return _zoom;
}

export function setZoom(zoom: number) {
  _zoom = zoom;
}

export function updateScale() {
  _transform.scale[0] = _zoom * _renderSize[0];
  _transform.scale[1] = _zoom * _renderSize[1];
}

export function screenToWorld(screenPos: Vec2): Vec2 {
  // normalize coordinates
  const spos = vec2.clone(screenPos);
  spos[0] /= _screenSize[0];
  spos[1] /= _screenSize[1];

  return vec2.transformMat3(spos, _transform.trs());
}

export function worldToScreen(worldPos: Vec2): Vec2 {
  const screenPos = vec2.create();
  const trs = _transform.trs();
  mat3.invert(trs, trs);
  vec2.transformMat3(worldPos, trs, screenPos);

  // scale coordinates
  screenPos[0] *= _screenSize[0];
  screenPos[1] *= _screenSize[1];

  return screenPos;
}

function onResize(entries: ResizeObserverEntry[]) {
  for (const entry of entries) {
    const dpr = window.devicePixelRatio;
    const size = entry.devicePixelContentBoxSize[0];
    const displayWidth = Math.round(size.inlineSize / dpr);
    const displayHeight = Math.round(size.blockSize / dpr);

    _renderSize[0] = displayWidth;
    _renderSize[1] = displayHeight;
    _screenSize[0] = displayWidth / dpr;
    _screenSize[1] = displayHeight / dpr;
    updateScale();

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

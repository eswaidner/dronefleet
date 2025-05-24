import { Schedule, vec2, View, type Vec2 } from "./zen";

const downKeys: Set<string> = new Set();
let keyPressesPrev: Set<string> = new Set();
let keyReleasesPrev: Set<string> = new Set();
let keyPressesNext: Set<string> = new Set();
let keyReleasesNext: Set<string> = new Set();
let _pointerScreenPos: Vec2 = vec2.create();
let _pointerWorldPos: Vec2 = vec2.create();

function init() {
  const inputSignal = Schedule.signalBefore(Schedule.update);
  Schedule.onSignal(inputSignal, { once: () => updateInput() });

  window.onkeydown = (e) => {
    const k = e.key.toLowerCase();

    // prevents repeating keydown events from messing up key press state
    if (!downKeys.has(k)) {
      keyPressesNext.add(k);
      downKeys.add(k);
    }
  };

  window.onkeyup = (e) => {
    const k = e.key.toLowerCase();
    downKeys.delete(k);
    keyReleasesNext.add(k);
  };

  // reset key downs when window is hidden
  // prevents keys 'sticking' down when window/tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") downKeys.clear();
  });

  View.app().addEventListener("pointermove", (e) => {
    const p = e as PointerEvent;
    const pos = getPointerPosition(e, View.app());

    _pointerScreenPos.x = pos.x;
    _pointerScreenPos.y = View.screenSize().y - pos.y;
    _pointerWorldPos = View.screenToWorld(_pointerScreenPos);
  });
}

export function isKeyDown(key: string): boolean {
  return downKeys.has(key.toLowerCase());
}

export function wasKeyPressed(key: string): boolean {
  return keyPressesPrev.has(key.toLowerCase());
}

export function wasKeyReleased(key: string): boolean {
  return keyReleasesPrev.has(key.toLowerCase());
}

export function pointerScreenPos(): Vec2 {
  return vec2.clone(_pointerScreenPos);
}

export function pointerWorldPos(): Vec2 {
  return vec2.clone(_pointerWorldPos);
}

function updateInput() {
  //guarantee each key state gets a full frame to be processed before removal
  keyPressesPrev.clear();
  keyReleasesPrev.clear();
  const kpp = keyPressesPrev;
  const krp = keyReleasesPrev;
  keyPressesPrev = keyPressesNext;
  keyReleasesPrev = keyReleasesNext;
  keyPressesNext = kpp;
  keyReleasesNext = krp;
}

function getPointerPosition(e: PointerEvent, baseElement: HTMLElement): Vec2 {
  const rect = baseElement.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return vec2.create(x, y);
}

init();

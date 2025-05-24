import { parts, type PartGroup, type PlacedPart } from "./drones";
import { degToRad, radToDeg } from "./math";
import { Position } from "./movement";
import {
  Attribute,
  Schedule,
  State,
  vec2,
  View,
  type Entity,
  type Signal,
  type Vec2,
} from "./zen";

export const renderSignal: Signal = Schedule.signalAfter(Schedule.update);

function init() {
  Schedule.onSignal(renderSignal, { once: render });

  createStars(400);
}

export type VisualElement = Path;
export interface Path {
  type: "path";
  points: Vec2[];
}

export class PartGroupRenderer extends Attribute {
  group: PartGroup;

  constructor(group: PartGroup) {
    super();
    this.group = group;
  }
}

function render() {
  const ctx = View.gfx();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const stars = State.query({ include: [Star, Position] });
  for (const s of stars) drawStar(s);

  drawGrid(1, 1001);

  const partGroups = State.query({ include: [PartGroupRenderer, Position] });
  for (const p of partGroups) drawPartGroup(p);
}

function createStars(qty: number) {
  for (let i = 0; i < qty; i++) {
    const randPos = vec2.scale(vec2.randomDir(), Math.random() * 750);
    const depth = Math.random() * 10 + 7;
    const size = Math.random() * 2;

    const star = State.createEntity();
    State.addAttribute(star, Star, new Star({ depth, size }));
    State.addAttribute(star, Position, new Position(randPos));
  }
}

class Star extends Attribute {
  depth: number;
  size: number;

  constructor(opts: { depth: number; size: number }) {
    super();
    this.depth = opts.depth;
    this.size = opts.size;
  }
}

function drawStar(e: Entity) {
  const ctx = View.gfx();

  const pos = State.getAttribute<Position>(e, Position)!;
  const star = State.getAttribute<Star>(e, Star)!;

  let screenPos = View.worldToScreen(pos.value);
  screenPos = vec2.scale(screenPos, 1 / star.depth);

  ctx.fillStyle = "white";
  ctx.fillRect(screenPos.x, screenPos.y, star.size, star.size);
}

function drawGrid(cellSize: number, size: number) {
  const ctx = View.gfx();
  ctx.strokeStyle = "#37706330";

  const gridSize = cellSize * size;
  const halfGridSize = 0.5 * gridSize;
  const cellSizePx = cellSize * View.pixelsPerUnit();
  const origin = vec2.create(-halfGridSize, -halfGridSize);

  const buildGridSize = 9;
  const halfBuildGrid = buildGridSize * 0.5;
  const buildGridCenter = View.worldToScreen(
    vec2.create(-halfBuildGrid, -halfBuildGrid),
  );

  // vertical lines
  for (let x = 0; x <= size; x++) {
    const startPos = View.worldToScreen(
      vec2.add(origin, vec2.create(x * cellSize, 0)),
    );
    const endPos = View.worldToScreen(
      vec2.add(origin, vec2.create(x * cellSize, size * cellSize)),
    );

    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.stroke();
  }

  // horizontal lines
  for (let y = 0; y <= size; y++) {
    const startPos = View.worldToScreen(
      vec2.add(origin, vec2.create(0, y * cellSize)),
    );
    const endPos = View.worldToScreen(
      vec2.add(origin, vec2.create(size * cellSize, y * cellSize)),
    );

    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#377063f0";
  const buildSize = cellSizePx * buildGridSize;
  ctx.strokeRect(buildGridCenter.x, buildGridCenter.y, buildSize, buildSize);
}

const offsets: Vec2[] = [
  vec2.create(0, -1),
  vec2.create(1, 0),
  vec2.create(0, 1),
  vec2.create(-1, 0),
];

function drawPartGroup(e: Entity) {
  const renderer = State.getAttribute<PartGroupRenderer>(e, PartGroupRenderer)!;
  const pos = State.getAttribute<Position>(e, Position)!;

  const ctx = View.gfx();

  // render parts
  for (let y = 0; y < renderer.group.parts.length; y++) {
    const row = renderer.group.parts[y];
    for (let x = 0; x < row.length; x++) {
      const part = row[x];

      const v = parts[part.id].visuals;
      const cellPos = vec2.add(pos.value, vec2.create(x - 4.5, y - 4.5));
      const pivot = vec2.create(0.5, 0.5);
      const rot = degToRad(part.orientation * 90);

      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();

      if (v.misc) drawVisualElements(v.misc, cellPos, pivot, rot);

      // draw sides
      const sideGroups = [v.top, v.right, v.bottom, v.left];
      for (let i = 0; i < 4; i++) {
        const side = (part.orientation + i) % 4;
        const offset = offsets[side];
        const neighbor = renderer.group.parts[y + offset.y]?.[x + offset.x];

        // skip interior sides
        if (neighbor && partSideActive(side, neighbor)) continue;

        const sideGroup = sideGroups[i];
        if (sideGroup) drawVisualElements(sideGroup, cellPos, pivot, rot);
      }

      ctx.stroke();
    }
  }
}

function partSideActive(globalSide: number, part: PlacedPart): boolean {
  const side = (globalSide + 2 - part.orientation + 4) % 4;
  const v = parts[part.id].visuals;

  switch (side) {
    case 0:
      return !!v.top;
    case 1:
      return !!v.right;
    case 2:
      return !!v.bottom;
    case 3:
      return !!v.left;
    default:
      throw new Error();
  }
}

function drawVisualElements(
  elems: VisualElement[],
  pos: Vec2,
  pivot: Vec2,
  rot: number,
) {
  const ctx = View.gfx();

  for (const e of elems) {
    if (e.type === "path" && e.points.length > 1) {
      const start = vec2.add(
        vec2.add(vec2.rotate(vec2.sub(e.points[0], pivot), rot), pivot),
        pos,
      );
      const screenStart = View.worldToScreen(start);

      ctx.moveTo(screenStart.x, screenStart.y);
      for (const pt of e.points) {
        const point = vec2.add(vec2.rotate(vec2.sub(pt, pivot), rot), pivot);
        const screenPos = View.worldToScreen(vec2.add(point, pos));
        ctx.lineTo(screenPos.x, screenPos.y);
      }
    }
  }
}

function drawAsteroid() {}

init();

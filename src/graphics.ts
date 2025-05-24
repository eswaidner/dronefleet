import { Position } from "./movement";
import {
  Attribute,
  Schedule,
  State,
  vec2,
  View,
  type Entity,
  type Signal,
} from "./zen";

export const renderSignal: Signal = Schedule.signalAfter(Schedule.update);

function init() {
  Schedule.onSignal(renderSignal, { once: render });

  createStars(400);
}

function render() {
  const ctx = View.gfx();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const stars = State.query({ include: [Star, Position] });
  for (const s of stars) drawStar(s);

  drawGrid(1, 1001);
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

function drawPartGroup() {}

function drawAsteroid() {}

init();

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

function drawPartGroup() {}

function drawAsteroid() {}

init();

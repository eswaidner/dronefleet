import {
  Attribute,
  Schedule,
  State,
  vec2,
  type Entity,
  type TaskContext,
  type Vec2,
} from "./zen";

export function initMovement() {
  Schedule.onSignal(Schedule.update, {
    query: { include: [Movement, Position] },
    foreach: move,
  });
}

export class Position extends Attribute {
  value: Vec2;

  constructor(val: Vec2 = vec2.create()) {
    super();
    this.value = val;
  }
}

export class Movement extends Attribute {
  decay: number;
  mass: number;
  force: Vec2 = vec2.create();
  velocity: Vec2 = vec2.create();
  maxSpeed?: number;

  constructor(options: { decay: number; mass: number }) {
    super();
    this.decay = options.decay;
    this.mass = options.mass;
  }
}

function move(e: Entity, ctx: TaskContext) {
  const movement = State.getAttribute<Movement>(e, Movement)!;
  const pos = State.getAttribute<Position>(e, Position)!;

  const accel = vec2.scale(movement.force, 1 / movement.mass);
  const decel = vec2.scale(movement.velocity, movement.decay);

  movement.velocity = vec2.add(movement.velocity, accel);
  movement.velocity = vec2.sub(movement.velocity, decel);

  // limit velocity to max speed
  if (movement.maxSpeed) {
    const speed = vec2.mag(movement.velocity);
    movement.velocity = vec2.scale(
      vec2.normalize(movement.velocity),
      Math.min(speed, movement.maxSpeed),
    );
  }

  // apply velocity
  const moveDelta = vec2.scale(movement.velocity, ctx.deltaTime);
  pos.value = vec2.add(pos.value, moveDelta);

  movement.force.x = 0;
  movement.force.y = 0;
}

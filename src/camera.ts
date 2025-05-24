import {
  Attribute,
  Graphics,
  Input,
  Schedule,
  State,
  vec2,
  View,
  type Entity,
} from "./zen";
import { Movement, Position } from "./movement";

export function initCamera() {
  Schedule.onSignal(Schedule.update, {
    query: { include: [CameraControl, Movement] },
    foreach: cameraControl,
  });

  const updateViewSig = Schedule.signalBefore(Graphics.renderSignal);
  Schedule.onSignal(updateViewSig, {
    query: { include: [Camera, Position] },
    foreach: updateView,
  });

  const camera = State.createEntity("camera");
  State.addAttribute(camera, Camera, new Camera());
  State.addAttribute(camera, CameraControl, new CameraControl({ force: 3 }));
  State.addAttribute(camera, Movement, new Movement({ decay: 0.15, mass: 1 }));
  State.addAttribute(camera, Position, new Position());
}

function updateView(e: Entity) {
  const pos = State.getAttribute<Position>(e, Position)!;

  View.position().x = pos.value.x;
  View.position().y = pos.value.y;
}

function cameraControl(e: Entity) {
  const cc = State.getAttribute<CameraControl>(e, CameraControl)!;
  const mv = State.getAttribute<Movement>(e, Movement)!;

  //TODO mouse drag movement
  //TODO zooming

  const up = Input.isKeyDown("w") ? -1 : 0;
  const left = Input.isKeyDown("a") ? -1 : 0;
  const down = Input.isKeyDown("s") ? 1 : 0;
  const right = Input.isKeyDown("d") ? 1 : 0;

  const inputDir = vec2.normalize(vec2.create(left + right, up + down));
  mv.force = vec2.add(mv.force, vec2.scale(inputDir, cc.moveForce));
}

export class Camera extends Attribute {}
export class CameraControl extends Attribute {
  moveForce: number;

  constructor(options: { force: number }) {
    super();
    this.moveForce = options.force;
  }
}

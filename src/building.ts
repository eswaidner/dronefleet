import { PartGroup } from "./drones";
import { PartGroupRenderer } from "./graphics";
import { Position } from "./movement";
import { Input, Schedule, State, vec2, type Vec2 } from "./zen";

export let hoveredCell: Vec2 | undefined;
export let buildPartGroup: PartGroup = new PartGroup();

export function initBuilding() {
  Schedule.onSignal(Schedule.update, { once: buildInput });

  const buildDrone = State.createEntity();
  State.addAttribute(
    buildDrone,
    PartGroupRenderer,
    new PartGroupRenderer(buildPartGroup),
  );
  State.addAttribute(buildDrone, Position, new Position());
}

function buildInput() {
  const pointerPos = Input.pointerWorldPos();

  const hover = vec2.floor(vec2.add(pointerPos, vec2.create(4.5, 4.5)));

  if (hover.x < 0 || hover.x >= 9 || hover.y < 0 || hover.y >= 9) {
    hoveredCell = undefined;
  } else {
    hoveredCell = hover;
  }

  //TODO pointer-based controls
  if (hoveredCell) {
    if (Input.wasKeyPressed("f")) {
      buildPartGroup.parts[hoveredCell.y][hoveredCell.x] = {
        id: "Block",
        orientation: 0,
      };
    }

    if (Input.wasKeyPressed("c")) {
      buildPartGroup.parts[hoveredCell.y][hoveredCell.x] = undefined;
    }
  }
}

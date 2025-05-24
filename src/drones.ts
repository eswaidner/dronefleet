import { PartGroupRenderer, type VisualElement } from "./graphics";
import { Position } from "./movement";
import { Attribute } from "./state";
import type { Vec2 } from "./vec2";
import { State, vec2 } from "./zen";

export const parts: Record<string, PartDescriptor> = {};

export async function initDrones() {
  const partsConfig = await (await fetch("./config/parts.json")).json();
  const visualConfig = await (await fetch("./config/visuals.json")).json();

  // load parts
  for (const part of partsConfig.parts) {
    parts[part.name] = part as PartDescriptor;
    parts[part.name].visuals = visualConfig[part.name] as PartVisuals;
  }

  const test = State.createEntity();
  State.addAttribute(
    test,
    PartGroupRenderer,
    new PartGroupRenderer({
      parts: [
        [
          { id: "Slope", orientation: 0 },
          { id: "Slope", orientation: 2 },
        ],
        [
          { id: "Block", orientation: 0 },
          { id: "Slope", orientation: 1 },
        ],
      ],
    }),
  );
  State.addAttribute(test, Position, new Position());
}

interface Fleet {
  id: string;
  name: string;
  modified: Date;
  drones: DroneDescriptor[];
}

interface DroneDescriptor {
  body: PartGroup;
  program: Instruction[];
}

export interface PartGroup {
  parts: PlacedPart[][];
}

export interface PlacedPart {
  id: string;
  orientation: number;
}

interface PartDescriptor {
  name: string;
  description: string;
  visuals: PartVisuals;
  price: number;
  maxHitpoints: number;
  fields: FieldDescriptor[];
  activeAction?: PartAction;
  passiveAction?: PartAction;
}

interface PartVisuals {
  misc?: VisualElement[];
  top?: VisualElement[];
  right?: VisualElement[];
  bottom?: VisualElement[];
  left?: VisualElement[];
}

interface FieldDescriptor {
  name: string;
  description: string;
  mutable: boolean;
  range?: [number, number];
}

interface PartAction {
  // start cb
  // update cb
}

interface Drone extends Attribute {
  fleet: Fleet;
  idx: number;
  parts: Part[];
  pc: number;
}

interface Part {
  idx: Vec2;
  fields: Record<string, Field>;
}

interface Field {
  name: string;
  value: number;
}

interface Instruction {
  op: Opcode;
  args: Value[];
}

type Opcode = "add"; //TODO remaining ops

type Value = Constant | Reference;

interface Constant {
  type: "constant";
  value: number;
}

interface Reference {
  type: "reference";
  partIndex: Vec2;
  fieldName: string;
}

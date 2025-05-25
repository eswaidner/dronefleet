import { type VisualElement } from "./graphics";
import { Attribute } from "./state";
import type { Vec2 } from "./vec2";

export const parts: Record<string, PartDescriptor> = {};

export async function initDrones() {
  const partsConfig = await (await fetch("./config/parts.json")).json();
  const visualConfig = await (await fetch("./config/visuals.json")).json();

  // load parts
  for (const part of partsConfig.parts) {
    parts[part.name] = part as PartDescriptor;
    parts[part.name].visuals = visualConfig[part.name] as PartVisuals;
  }
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

export class PartGroup {
  parts: (PlacedPart | undefined)[][];

  constructor() {
    this.parts = [];
    for (let y = 0; y < 9; y++) {
      const row: (PlacedPart | undefined)[] = [];
      for (let x = 0; x < 9; x++) row.push();
      this.parts.push(row);
    }
  }
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

import type { Attribute } from "./state";
import type { Vec2 } from "./vec2";

interface Fleet {
  id: string;
  name: string;
  modified: Date;
  drones: DroneDescriptor[];
}

interface DroneDescriptor {
  parts: PlacedPart[][];
  program: Instruction[];
}

interface PlacedPart {
  id: number;
  orientation: number;
}

interface PartDescriptor {
  name: string;
  description: string;
  price: number;
  maxHitpoints: number;
  activeAction?: PartAction;
  passiveAction?: PartAction;
  fields: FieldDescriptor[];
  params: object;
}

interface FieldDescriptor {
  name: string;
  description: string;
  mutable: boolean;
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

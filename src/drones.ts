import type { Vec2, Vec4 } from "wgpu-matrix";

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

interface Drone {
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
  value: Vec4;
}

interface Instruction {
  op: Opcode;
  args: Value[];
}

type Opcode = "add";

type Value = Constant | Reference;

interface Constant {
  type: "constant";
}

interface Reference {
  type: "reference";
}

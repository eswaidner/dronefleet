import { mat3, vec2, type Mat3, type Vec2 } from "wgpu-matrix";
import { Attribute } from "./zen";

export class Transform extends Attribute {
  pos: Vec2;
  rot: number;
  scale: Vec2;
  pivot: Vec2;

  constructor(
    properties: {
      pos?: Vec2;
      rot?: number;
      scale?: Vec2;
      pivot?: Vec2;
    } = {},
  ) {
    super();
    this.pos = properties.pos || vec2.create();
    this.rot = properties.rot || 0;
    this.scale = properties.scale || vec2.create(1, 1);
    this.pivot = properties.pivot || vec2.create();
  }

  trs(): Mat3 {
    const offset = vec2.add(vec2.create(), this.pos, this.pivot);

    const p = mat3.identity();
    mat3.translate(p, offset, p);

    const m = mat3.identity();
    mat3.mul(m, p, m);
    mat3.translate(m, this.pos, m);
    mat3.rotate(m, this.rot, m);
    mat3.scale(m, this.scale, m);
    mat3.mul(m, mat3.invert(p, p), m);

    return m;
  }

  inverseTrs(): Mat3 {
    return mat3.invert(this.trs());
  }
}

import { initCamera } from "./camera";
import { initMovement } from "./movement";
import "./style.css";
import { Schedule, vec2, View, Zen } from "./zen";

Zen.start();
initCamera();
initMovement();

Schedule.onSignal(Schedule.update, {
  once: () => {
    draw();
  },
});

function draw() {
  const ctx = View.gfx();

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const pos = View.worldToScreen(vec2.create(-0.5, -0.5));

  const ppu = View.pixelsPerUnit();
  ctx.strokeStyle = "#75b3ff";
  ctx.strokeRect(pos.x, pos.y, ppu, ppu);
}

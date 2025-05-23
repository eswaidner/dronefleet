import "./style.css";
import { Schedule, View, Zen } from "./zen";

Zen.start();

View.gfx().canvas.style.backgroundColor = "#0a211c";

Schedule.onSignal(Schedule.update, {
  once: () => {
    // draw();
  },
});

function draw() {
  const ctx = View.gfx();

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const ppu = View.pixelsPerUnit();
  ctx.strokeStyle = "#75b3ff";
  ctx.strokeRect(5 * ppu, 5 * ppu, ppu, ppu);
  ctx.strokeStyle = "#e76d6c";
  ctx.strokeRect(7 * ppu, 5 * ppu, ppu, ppu);
}

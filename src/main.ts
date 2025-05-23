import "./style.css";
import { Schedule, View, Zen } from "./zen";

Zen.start();

Schedule.onSignal(Schedule.update, {
  once: () => {
    draw();
  },
});

function draw() {
  const ctx = View.gfx();
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)} ${Math.floor(
        255 - 42.5 * j,
      )} 0)`;

      const ppu = View.pixelsPerUnit();
      ctx.fillRect(j * ppu, i * ppu, ppu, ppu);
    }
  }
}

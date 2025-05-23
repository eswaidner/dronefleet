import "./style.css";
import { Input, Schedule, View, Zen } from "./zen";

Zen.start();

Schedule.onSignal(Schedule.update, {
  once: () => {
    const worldPos = Input.pointerWorldPos();
    // console.log(worldPos[0], worldPos[1]);

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
      ctx.fillRect(j * 25, i * 25, 25, 25);
    }
  }
}

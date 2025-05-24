import { Schedule, type Signal } from "./zen";

export const renderSignal: Signal = Schedule.signalAfter(Schedule.update);

function init() {
  Schedule.onSignal(renderSignal, { once: render });
}

function render() {
  //TODO shape drawing
}

init();

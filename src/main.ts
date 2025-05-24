import { initBuilding } from "./building";
import { initCamera } from "./camera";
import { initDrones } from "./drones";
import { initMovement } from "./movement";
import "./style.css";
import { Zen } from "./zen";

Zen.start();
initDrones();
initCamera();
initMovement();
initBuilding();

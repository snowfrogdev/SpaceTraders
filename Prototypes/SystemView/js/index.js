import { addFPSCounter } from "./fps-counter.js";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

document.body.appendChild(app.view);

window.addEventListener("resize", resize);

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  // Adjust the stage's position
  app.stage.x = app.renderer.screen.width / 2;
  app.stage.y = app.renderer.screen.height / 2;
}

const systemDots = [];

// Set pivot and position
app.stage.pivot.set(0, 0);
app.stage.position.set(
  app.renderer.screen.width / 2,
  app.renderer.screen.height / 2
);

addFPSCounter(app);

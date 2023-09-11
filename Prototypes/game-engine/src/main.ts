import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core";
import { GameObject } from "./abstractions/game-object";
import { MeshFilterComponent } from "./components/mesh-filter.component";
import { MeshRendererComponent } from "./components/mesh-renderer.component";
import { Alpha } from "./abstractions/component";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

const engine = new Engine(canvas);

var scene = new Scene(engine);
scene.debugLayer.show({ embedMode: true, overlay: true });

var camera = new ArcRotateCamera("camera1", 0.1, 0.1, 15, Vector3.Zero(), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

var material = new GridMaterial("grid", scene);

var ground = CreateGround("ground1", { width: 100, height: 100, subdivisions: 2 }, scene);
ground.material = material;

const sphere = new GameObject("sphere");
const sphereMesh = CreateSphere("sphere", { segments: 16, diameter: 1 }, scene);
sphere.addComponent(new MeshFilterComponent(sphere, sphereMesh));
const sphereMaterial = new StandardMaterial("sphereMat", scene);
sphereMaterial.diffuseColor = new Color3(0, 0, 0);
sphereMaterial.specularColor = new Color3(0, 0, 0);
sphereMaterial.emissiveColor = new Color3(0.5, 0.5, 1);
sphere.addComponent(new MeshRendererComponent(sphere, sphereMaterial));

sphere.transform.setPosition(new Vector3(0, 1, 0));

const entities: GameObject[] = [sphere];

function processInput() {
  // Handle your input processing here
}

function update() {
  // Your fixed-time update logic goes here
  // This will be called at fixed intervals determined by MS_PER_UPDATE
}

function render(alpha: Alpha) {
  for (const entity of entities) {
    for (const component of entity.renderComponents) {
      component.update(alpha);
    }
  }
}

const MS_PER_UPDATE = 15;
let previous = performance.now();
let lag = 0.0;

engine.runRenderLoop(() => {
  const current = performance.now();
  const elapsed = current - previous;
  previous = current;
  lag += elapsed;

  processInput();

  while (lag >= MS_PER_UPDATE) {
    update();
    lag -= MS_PER_UPDATE;
  }

  render((lag / MS_PER_UPDATE) as Alpha);

  scene.render();
});

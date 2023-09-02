import { Repository } from "./repository.js";
import { fetchAllSystems } from "./space-traders-http-client.js";

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine

const systemRepo = new Repository("systems");

if ((await systemRepo.count()) < 12000) {
  for await (const systems of fetchAllSystems()) {
    for (const system of systems) {
      await systemRepo.save(system);
    }
  }
}

const systems = [];
for await (const system of systemRepo.list()) {
  systems.push(system);
}

let mesh;

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  scene.debugLayer.show({ embedMode: true, overlay: true });
  const camera = new BABYLON.ArcRotateCamera("Main Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.wheelDeltaPercentage = 0.01;
  camera.attachControl(canvas, true);

  mesh = new BABYLON.MeshBuilder.CreateSphere("Star", { size: 1 }, scene);
  const myMaterial = new BABYLON.StandardMaterial("Star", scene);
  myMaterial.emissiveTexture = new BABYLON.Texture("assets/2k_sun.jpg", scene);
  myMaterial.disableLighting = true;
  mesh.material = myMaterial;
  mesh.isVisible = false;

  for (const system of systems) {
    
  }







  const hl = new BABYLON.HighlightLayer("Highlight Layer", scene);
  hl.addMesh(mesh, BABYLON.Color3.Yellow());
  hl.innerGlow = true;
  hl.outerGlow = true;

  hl.blurHorizontalSize = 2;
  hl.blurVerticalSize = 2;

  const gl = new BABYLON.GlowLayer("Glow Layer", scene);
  gl.addIncludedOnlyMesh(mesh);
  gl.intensity = 0.15;
  gl.referenceMeshToUseItsOwnMaterial(mesh);

  return scene;
};

const scene = await createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  const deltaTime = scene.getEngine().getDeltaTime() / 1000; // Convert to seconds

  const rotationSpeed = 0.2; // rotations per second
  mesh.rotation.y += rotationSpeed * deltaTime; // Rotate around Y-axis using delta time

  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

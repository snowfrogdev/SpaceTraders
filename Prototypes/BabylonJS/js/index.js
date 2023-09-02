import { Repository } from "./repository.js";
import { fetchAllSystems } from "./space-traders-http-client.js";
import { ZCalculator } from "./star-z-calculator.js";

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

let starMesh;

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  scene.debugLayer.show({ embedMode: true, overlay: true });
  const camera = new BABYLON.ArcRotateCamera("Main Camera", 0, 0, 150000, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.wheelDeltaPercentage = 0.01;
  camera.maxZ = 300000;
  camera.attachControl(canvas, true);

  starMesh = new BABYLON.MeshBuilder.CreateSphere("Star", { size: 2, segments: 16 }, scene);
  const myMaterial = new BABYLON.StandardMaterial("Star", scene);
  myMaterial.emissiveTexture = new BABYLON.Texture("assets/2k_sun.jpg", scene);
  myMaterial.disableLighting = true;
  starMesh.material = myMaterial;
  starMesh.isVisible = false;

  const gl = new BABYLON.GlowLayer("Glow Layer", scene);
  gl.intensity = 0.15;

  const hl = new BABYLON.HighlightLayer("Highlight Layer", scene);
  hl.innerGlow = true;
  hl.outerGlow = true;
  hl.blurHorizontalSize = 2;
  hl.blurVerticalSize = 2;

  const zCalculator = new ZCalculator(7000, 7000, 0);
  for (const system of systems) {
    const starMeshInstance = starMesh.createInstance(`star-${system.symbol}`);
    starMeshInstance.scaling = new BABYLON.Vector3(1, 1, 1);

    const z = zCalculator.getZ(system.x, system.y);
    starMeshInstance.position = new BABYLON.Vector3(system.x, z, system.y);
  }

  hl.addMesh(starMesh, BABYLON.Color3.Yellow());
  gl.addIncludedOnlyMesh(starMesh);
  gl.referenceMeshToUseItsOwnMaterial(starMesh);

  return scene;
};

const scene = await createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  const deltaTime = scene.getEngine().getDeltaTime() / 1000; // Convert to seconds

  const rotationSpeed = 0.2; // rotations per second
  starMesh.rotation.y += rotationSpeed * deltaTime; // Rotate around Y-axis using delta time

  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

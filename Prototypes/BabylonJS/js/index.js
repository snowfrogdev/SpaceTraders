import { randomBetweenWithExclusion, randomBetween } from "./utils.js";
import { Repository } from "./repository.js";
import { fetchAllSystems, fetchAllMyShips, fetchAllWaypointsInSystem } from "./space-traders-api.js";
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

const myShips = [];
for await (const ships of fetchAllMyShips()) {
  for (const ship of ships) {
    myShips.push(ship);
  }
}

const system = await systemRepo.get(myShips[0].nav.systemSymbol);

const systemWaypoints = [];
for await (const waypoints of fetchAllWaypointsInSystem(myShips[0].nav.systemSymbol)) {
  for (const waypoint of waypoints) {
    systemWaypoints.push(waypoint);
  }
}

const rotatingMeshes = [];

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  scene.debugLayer.show({ embedMode: true, overlay: true });
  const camera = new BABYLON.ArcRotateCamera("Main Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.wheelDeltaPercentage = 0.01;
  camera.maxZ = 300000;
  camera.attachControl(canvas, true);

  /** STAR **/
  const starMesh = new BABYLON.MeshBuilder.CreateSphere("Star", { size: 1, segments: 16 }, scene);
  const starMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync("SGX0YM#1", scene);
  starMesh.material = starMaterial;
  starMesh.scaling = new BABYLON.Vector3(5, 5, 5);
  rotatingMeshes.push(starMesh);

  const zCalculator = new ZCalculator(7000, 7000, 0);

  const y = zCalculator.getZ(system.x, system.y);
  starMesh.position = new BABYLON.Vector3(system.x, y, system.y);
  const starLight = new BABYLON.PointLight("Star Light", starMesh.position, scene);
  starLight.range = 200;
  starLight.intensity = 10;

  const hemisphericLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
  hemisphericLight.intensity = 0.5; // Adjust this value for desired ambient light intensity

  // set camera close to star and aim it to look at star
  camera.setPosition(new BABYLON.Vector3(system.x, y + 50, system.y - 150));
  camera.setTarget(starMesh.position.clone());

  /** WAYPOINTS **/
  for (const waypoint of systemWaypoints) {
    const waypointOrbit = new BABYLON.TransformNode(`Waypoint Orbit ${waypoint.symbol}-${waypoint.type}`, scene);
    const waypointMesh = new BABYLON.MeshBuilder.CreateSphere(
      `Waypoint ${waypoint.symbol}-${waypoint.type}`,
      { size: 1, segments: 16 },
      scene
    );
    const waypointMaterial = new BABYLON.StandardMaterial(`Waypoint ${waypoint.symbol}-${waypoint.type}`, scene);
    waypointMaterial.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
    waypointMaterial.specularPower = 1;
    waypointMesh.material = waypointMaterial;
    waypointMesh.parent = waypointOrbit;

    if (waypoint.type === "MOON" || waypoint.type === "ORBITAL_STATION") {
      waypointOrbit.position = new BABYLON.Vector3(system.x + waypoint.x, starMesh.position.y, system.y + waypoint.y);
      waypointMaterial.diffuseTexture = new BABYLON.Texture("assets/2k_moon.jpg", scene);
      waypointMesh.position = new BABYLON.Vector3(
        randomBetweenWithExclusion(-5, 5, -1, 1),
        0,
        randomBetweenWithExclusion(-5, 5, -1, 1)
      );
      const size = randomBetween(0.5, 1.25);
      waypointMesh.scaling = new BABYLON.Vector3(size, size, size);
    } else {
      waypointOrbit.position = starMesh.position.clone();
      waypointMaterial.diffuseTexture = new BABYLON.Texture("assets/2k_neptune.jpg", scene);

      waypointMesh.position = new BABYLON.Vector3(waypoint.x, 0, waypoint.y);
      const size = randomBetween(1.5, 4);
      waypointMesh.scaling = new BABYLON.Vector3(size, size, size);
    }

    rotatingMeshes.push(waypointMesh);

    // Orbit line
    const radius = Math.sqrt(
      waypointMesh.position.x * waypointMesh.position.x + waypointMesh.position.z * waypointMesh.position.z
    );
    const points = [];
    const numPoints = 100;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      points.push(new BABYLON.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    points.push(points[0]);

    const orbitLine = BABYLON.MeshBuilder.CreateLines("Orbit Line", { points: points }, scene);
    orbitLine.parent = waypointOrbit;
  }

  return scene;
};

const scene = await createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  const deltaTime = scene.getEngine().getDeltaTime() / 1000; // Convert to seconds

  const rotationSpeed = 0.1; // rotations per second
  for (const mesh of rotatingMeshes) {
    mesh.rotation.y += rotationSpeed * deltaTime; // Rotate around Y-axis using delta time
  }
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

import { Repository } from "./services/repository.js";
import { fetchAllSystems, fetchAllMyShips, fetchAllWaypointsInSystem } from "./services/space-traders-api.js";
import { SystemEntity } from "./entities/system.entity.js";
import { WaypointEntity } from "./entities/waypoint.entity.js";
import { ShipEntity } from "./entities/ship.entity.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { stencil: true });

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

const systemDto = await systemRepo.get(myShips[0].nav.systemSymbol);

const systemWaypoints = [];
for await (const waypoints of fetchAllWaypointsInSystem(myShips[0].nav.systemSymbol)) {
  for (const waypoint of waypoints) {
    systemWaypoints.push(waypoint);
  }
}

const entities = [];

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  scene.debugLayer.show({ embedMode: true, overlay: true });

  const camera = new BABYLON.ArcRotateCamera("Main Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.wheelDeltaPercentage = 0.01;
  camera.maxZ = 300000;
  camera.attachControl(canvas, true);

  const systemEntity = SystemEntity.createFrom(systemDto);
  entities.push(systemEntity);

  const hemisphericLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
  hemisphericLight.intensity = 0.5;

  for (const waypoint of systemWaypoints) {
    const waypointEntity = WaypointEntity.createFrom(waypoint, systemEntity);
    entities.push(waypointEntity);
  }

  for (const ship of myShips) {
    const shipEntity = ShipEntity.createFrom(ship, systemEntity);
    entities.push(shipEntity);
  }

  for (const entity of entities) {
    await entity.init(scene);
  }

  const starMesh = systemEntity.starMesh;
  camera.setPosition(new BABYLON.Vector3(starMesh.position.x, starMesh.position.y + 50, starMesh.position.z - 150));
  camera.setTarget(starMesh.position.clone());

  return scene;
};

const scene = await createScene();

engine.runRenderLoop(function () {
  const deltaTime = scene.getEngine().getDeltaTime();
  entities.forEach((entity) => entity.update(deltaTime));

  entities.forEach((entity) => entity.render());

  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

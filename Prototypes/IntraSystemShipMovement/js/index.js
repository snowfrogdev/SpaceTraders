import { randomBetweenWithExclusion, randomBetween } from "./services/utils.js";
import { Repository } from "./services/repository.js";
import { fetchAllSystems, fetchAllMyShips, fetchAllWaypointsInSystem } from "./services/space-traders-api.js";
import { SystemEntity } from "./entities/system.entity.js";
import { RenderableComponent } from "./components/renderable.component.js";
import { createObjectLabel } from "./create-object-label.js";

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

function createShipMesh(ship, scene) {
  const shipOrbit = new BABYLON.TransformNode(`Waypoint Orbit ${ship.symbol}`, scene);
  const shipMesh = new BABYLON.MeshBuilder.CreateBox(`Ship ${ship.symbol}`, { size: 2 }, scene);
  const shipMaterial = new BABYLON.StandardMaterial(`Ship Material ${ship.symbol}`, scene);
  shipMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.1);
  shipMesh.material = shipMaterial;
  createObjectLabel(ship.symbol, shipMesh, scene);
  return shipMesh;
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

  /* for (const waypoint of systemWaypoints) {
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
      waypointOrbit.position = new BABYLON.Vector3(systemDto.x + waypoint.x, starMesh.position.y, systemDto.y + waypoint.y);
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

    // Create label for each waypoint
    createObjectLabel(waypoint.symbol, waypointMesh, scene);

    rotatingMeshes.push(waypointMesh);

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

  for (const ship of myShips) {
    const shipMesh = createShipMesh(ship, scene);
    shipMesh.parent = starMesh;
    shipMesh.position = new BABYLON.Vector3(ship.x, 0, ship.y);
  } */

  for (const entity of entities) {
    await entity.init(scene);
  }

  const systemMesh = systemEntity.getComponent(RenderableComponent).mesh;
  camera.setPosition(new BABYLON.Vector3(systemMesh.position.x, systemMesh.position.y + 50, systemMesh.position.z - 150));
  camera.setTarget(systemMesh.position.clone());

  return scene;
};

const scene = await createScene();

engine.runRenderLoop(function () {
  const deltaTime = scene.getEngine().getDeltaTime();
  entities.forEach((entity) => entity.update(deltaTime));

  for (const entity of entities) {
    for (const component of entity.components) {
      if (component instanceof RenderableComponent) {
        component.render();
      }
    }
  }

  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

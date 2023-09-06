import { Entity } from "../abstractions/entity.js";
import { createObjectLabel } from "../create-object-label.js";
import { randomBetweenWithExclusion, randomBetween } from "../services/utils.js";

export class WaypointEntity extends Entity {
  position = { x: 0, y: 0, z: 0 };
  rotation = { x: 0, y: 0, z: 0 };
  scale = { x: 1, y: 1, z: 1 };
  type = "";
  primaryEntity = null;
  waypointOrbit = null;
  waypointMesh = null;

  constructor(symbol, x, y, z) {
    super(symbol);
    this.position = { x, y, z };
  }

  static createFrom(waypointDto, primaryEntity) {
    const waypoint = new WaypointEntity(waypointDto.symbol, waypointDto.x, 0, waypointDto.y);
    waypoint.type = waypointDto.type;
    waypoint.primaryEntity = primaryEntity;
    return waypoint;
  }

  async init(scene) {
    this.waypointOrbit = new BABYLON.TransformNode(`Waypoint Orbit ${this.symbol}-${this.type}`, scene);
    this.waypointMesh = new BABYLON.MeshBuilder.CreateSphere(
      `Waypoint ${this.symbol}-${this.type}`,
      { size: 1, segments: 16 },
      scene
    );
    const waypointMaterial = new BABYLON.StandardMaterial(`Waypoint ${this.symbol}-${this.type}`, scene);
    waypointMaterial.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
    waypointMaterial.specularPower = 1;
    this.waypointMesh.material = waypointMaterial;
    this.waypointMesh.parent = this.waypointOrbit;

    if (this.type === "MOON" || this.type === "ORBITAL_STATION") {
      this.waypointOrbit.position = new BABYLON.Vector3(
        this.primaryEntity.position.x + this.position.x,
        this.primaryEntity.position.y,
        this.primaryEntity.position.z + this.position.z
      );
      waypointMaterial.emissiveTexture = new BABYLON.Texture("assets/2k_moon.jpg", scene);
      this.waypointMesh.position = new BABYLON.Vector3(
        randomBetweenWithExclusion(-6, 6, -1, 1),
        0,
        randomBetweenWithExclusion(-6, 6, -1, 1)
      );
      const size = randomBetween(0.5, 1.25);
      this.scale = { x: size, y: size, z: size };
      this.waypointMesh.scaling = new BABYLON.Vector3(size, size, size);
    } else {
      this.waypointOrbit.position = this.primaryEntity.starMesh.position.clone();
      waypointMaterial.emissiveTexture = new BABYLON.Texture("assets/2k_neptune.jpg", scene);
      this.waypointMesh.position = new BABYLON.Vector3(this.position.x, 0, this.position.z);
      const size = randomBetween(1.5, 4);
      this.scale = { x: size, y: size, z: size };
      this.waypointMesh.scaling = new BABYLON.Vector3(size, size, size);
    }

    // Create label for each waypoint
    createObjectLabel(this.symbol, this.waypointMesh);

    const radius = Math.sqrt(
      this.waypointMesh.position.x * this.waypointMesh.position.x + this.waypointMesh.position.z * this.waypointMesh.position.z
    );
    const points = [];
    const numPoints = 100;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      points.push(new BABYLON.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    points.push(points[0]);

    const orbitLine = BABYLON.MeshBuilder.CreateLines(`Orbit Line - ${this.symbol}`, { points: points }, scene);
    orbitLine.parent = this.waypointOrbit;
  }

  update(deltaTime) {
    // Intentionally left blank
  }

  render() {
    if (this.type === "MOON" || this.type === "ORBITAL_STATION") {
      // TODO: Figure out how to deal with these because the actual "game" coordinates
      // of moons and stations are the same as the planet they orbit.
      // For display purposes we are giving them a random offset.
      return;
    }

    this.waypointMesh.position = new BABYLON.Vector3(this.position.x, this.position.y, this.position.z);
    this.waypointMesh.rotation = new BABYLON.Vector3(this.rotation.x, this.rotation.y, this.rotation.z);
    this.waypointMesh.scaling = new BABYLON.Vector3(this.scale.x, this.scale.y, this.scale.z);
  }
}

import { Entity } from "../abstractions/entity.js";
import { createObjectLabel } from "../create-object-label.js";

export class ShipEntity extends Entity {
  position = { x: 0, y: 0, z: 0 };
  rotation = { x: 0, y: 0, z: 0 };
  scale = { x: 0.5, y: 0.5, z: 0.5 };
  nav = null;
  shipMesh = null;
  currentSystemEntity = null;
  waypointOrbit = null;
  isSelected = false;

  constructor(symbol, x, y, z) {
    super(symbol);
    this.position = { x, y, z };
  }

  static createFrom(shipDto, currentSystemEntity) {
    const departure = shipDto.nav.route.departure;
    const ship = new ShipEntity(shipDto.symbol, departure.x, currentSystemEntity.y, departure.y);
    ship.nav = shipDto.nav;
    ship.currentSystemEntity = currentSystemEntity;
    return ship;
  }

  async init(scene) {
    this.waypointOrbit = new BABYLON.TransformNode(`Ship Orbit ${this.symbol}-${this.type}`, scene);
    this.waypointOrbit.position = this.currentSystemEntity.starMesh.position.clone();

    this.createShipMesh(scene);
    this.shipMesh.parent = this.waypointOrbit;
    this.shipMesh.position = new BABYLON.Vector3(this.position.x, 0, this.position.z);
  }

  createShipMesh(scene) {
    this.shipMesh = new BABYLON.MeshBuilder.CreateBox(`Ship ${this.symbol}`, { size: 2 }, scene);
    const shipMaterial = new BABYLON.StandardMaterial(`Ship Material ${this.symbol}`, scene);
    shipMaterial.emissiveColor = new BABYLON.Color3(0.9, 0.1, 0.1);
    this.shipMesh.material = shipMaterial;
    createObjectLabel(this.symbol, this.shipMesh, "red", scene, (label) => {
      if (!this.isSelected) {
        this.isSelected = true;
        label.alpha = 1;
        label.color = "yellow";
        label.thickness = 3;
        return;
      }      

      this.isSelected = false;
      label.alpha = 0.9;
      label.color = "white";
      label.thickness = 1;
    });
  }

  update(deltaTime) {
    // Intentionally left blank
  }

  render() {
    if (this.nav.status === "IN_TRANSIT") {
      this.shipMesh.position = new BABYLON.Vector3(this.position.x, this.position.y, this.position.z);
      this.shipMesh.rotation = new BABYLON.Vector3(this.rotation.x, this.rotation.y, this.rotation.z);
      this.shipMesh.scaling = new BABYLON.Vector3(this.scale.x, this.scale.y, this.scale.z);
      return;
    }
    if (this.nav.status === "DOCKED" || this.nav.status === "ORBITING") {
      // position the ship mesh slightly above the ship's position
      this.shipMesh.position = new BABYLON.Vector3(this.position.x + 1.5, 2.5, this.position.z + 1.5);
      this.shipMesh.rotation = new BABYLON.Vector3(this.rotation.x, this.rotation.y, this.rotation.z);
      this.shipMesh.scaling = new BABYLON.Vector3(this.scale.x, this.scale.y, this.scale.z);
    }
    if (this.nav.status === "DOCKED") {
      this.shipMesh.visibility = 0;
    }
  }
}

import { Entity } from "../abstractions/entity.js";
import { ZCalculator } from "../services/star-z-calculator.js";

export class SystemEntity extends Entity {
  position = { x: 0, y: 0, z: 0 };
  rotation = { x: 0, y: 0, z: 0 };
  scale = { x: 6, y: 6, z: 6 };
  starMesh = null;

  constructor(symbol, x, y, z) {
    super(symbol);
    this.position = { x, y, z };
  }

  static createFrom(systemDto) {
    const zCalculator = new ZCalculator(7000, 7000, 0);
    const y = zCalculator.getZ(systemDto.x, systemDto.y);
    const system = new SystemEntity(systemDto.symbol, systemDto.x, y, systemDto.y);
    return system;
  }

  async init(scene) {
    this.starMesh = new BABYLON.MeshBuilder.CreateSphere("Star", { size: 1, segments: 16 }, scene);
    this.starMesh.position = new BABYLON.Vector3(this.position.x, this.position.y, this.position.z);
    const starMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync("SGX0YM#1", scene);
    this.starMesh.material = starMaterial;

    //const starLight = new BABYLON.PointLight("Star Light", this.starMesh.position, scene);
    //starLight.range = 200;
    //starLight.intensity = 10;
  }

  update(deltaTime) {
    // Intentionally left blank
  }

  render() {
    this.starMesh.position = new BABYLON.Vector3(this.position.x, this.position.y, this.position.z);
    this.starMesh.rotation = new BABYLON.Vector3(this.rotation.x, this.rotation.y, this.rotation.z);
    this.starMesh.scaling = new BABYLON.Vector3(this.scale.x, this.scale.y, this.scale.z);
  }
}

import { Entity } from "../abstractions/entity.js";
import { PositionComponent } from "../components/position.component.js";
import { RotationComponent } from "../components/rotation.component.js";
import { ScaleComponent } from "../components/scale.component.js";
import { RenderableComponent } from "../components/renderable.component.js";
import { ZCalculator } from "../services/star-z-calculator.js";

export class SystemEntity extends Entity {
  constructor(symbol, x, y, z) {
    super(symbol);
    this.addComponent(new PositionComponent(this, x, y, z));
    this.addComponent(new RotationComponent(this));
    this.addComponent(new ScaleComponent(this, 5, 5, 5));
  }

  async init(scene) {
    const starMesh = new BABYLON.MeshBuilder.CreateSphere("Star", { size: 1, segments: 16 }, scene);
    const starMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync("SGX0YM#1", scene);
    starMesh.material = starMaterial;
    this.addComponent(new RenderableComponent(this, starMesh));

    const starLight = new BABYLON.PointLight("Star Light", starMesh.position, scene);
    starLight.range = 200;
    starLight.intensity = 10;
  }

  static createFrom(systemDto) {
    const zCalculator = new ZCalculator(7000, 7000, 0);
    const y = zCalculator.getZ(systemDto.x, systemDto.y);
    const system = new SystemEntity(systemDto.symbol, systemDto.x, y, systemDto.y);
    console.log(system)
    return system;
  }
}

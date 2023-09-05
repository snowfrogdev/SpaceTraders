import { Component } from '../abstractions/component.js';
import { PositionComponent } from "./position.component.js";
import { RotationComponent } from "./rotation.component.js";
import { ScaleComponent } from "./scale.component.js";

export class RenderableComponent extends Component {
  constructor(entity, mesh) {
    super(entity);
    this.mesh = mesh;
  }

  render() {
    const position = this.entity.getComponent(PositionComponent);
    const rotation = this.entity.getComponent(RotationComponent);
    const scale = this.entity.getComponent(ScaleComponent);

    this.mesh.position = new BABYLON.Vector3(position.x, position.y, position.z);
    this.mesh.rotation = new BABYLON.Vector3(rotation.x, rotation.y, rotation.z);
    this.mesh.scaling = new BABYLON.Vector3(scale.x, scale.y, scale.z);
  }

  update(deltaTime) {
    // Intentionaly left blank
  }
}

import { Alpha, RenderComponent } from "../abstractions/component";
import { GameObject } from "../abstractions/game-object";
import { Material } from "../abstractions/material";
import { MeshFilterComponent } from "./mesh-filter.component";
import { TransformComponent } from "./transform.component";

export class MeshRendererComponent extends RenderComponent {
  constructor(gameObject: GameObject, material: Material) {
    super(gameObject);
    const meshFilter = this._gameObject.getComponent(MeshFilterComponent);
    if (!meshFilter) {
      throw new Error(`MeshRendererComponent on GameObject "${gameObject.name}" requires a MeshFilterComponent`);
    }
    meshFilter.addMaterial(material);
  }

  update(alpha: Alpha): void {
    const transform = this._gameObject.getComponent(TransformComponent);
    const meshFilter = this._gameObject.getComponent(MeshFilterComponent);

    if (!transform || !meshFilter) {
      throw new Error(`MeshRendererComponent on GameObject "${this._gameObject.name}" requires a TransformComponent and a MeshFilterComponent`);
    }

    const interpolatedPosition = transform.getInterpolatedPosition(alpha);
    const interpolatedRotation = transform.getInterpolatedRotation(alpha);
    const interpolatedScale = transform.getInterpolatedScale(alpha);

    meshFilter.updatePosition(interpolatedPosition);
    meshFilter.updateRotation(interpolatedRotation);
    meshFilter.updateScale(interpolatedScale);

    transform.setPreviousPosition(interpolatedPosition);
    transform.setPreviousRotation(interpolatedRotation);
    transform.setPreviousScale(interpolatedScale);
  }
}
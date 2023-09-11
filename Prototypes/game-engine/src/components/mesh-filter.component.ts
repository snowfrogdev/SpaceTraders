import { DataComponent } from "../abstractions/component";
import { GameObject } from "../abstractions/game-object";
import { Material } from "../abstractions/material";
import { Mesh } from "../abstractions/mesh";
import { Vector3 } from "../abstractions/vector3";

export class MeshFilterComponent extends DataComponent {
  constructor(gameObject: GameObject, readonly mesh: Mesh) {
    super(gameObject);
  }

  addMaterial(material: Material): void {
    this.mesh.material = material;
  }

  updatePosition(position: Vector3): void {
    this.mesh.position = position;
  }

  updateRotation(rotation: Vector3): void {
    this.mesh.rotation = rotation;
  }

  updateScale(scale: Vector3): void {
    this.mesh.scaling = scale;
  }
}

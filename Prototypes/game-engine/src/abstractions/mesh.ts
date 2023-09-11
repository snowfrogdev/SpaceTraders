import { Material } from "./material";
import { Vector3 } from "./vector3";

export interface Mesh {
  material: Material | null;
  position: Vector3;
  rotation: Vector3;
  scaling: Vector3;
}

export interface Vector3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;

  clone(): Vector3;
}
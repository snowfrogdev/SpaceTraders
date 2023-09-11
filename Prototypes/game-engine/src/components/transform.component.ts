import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Alpha, DataComponent } from "../abstractions/component";
import { GameObject } from "../abstractions/game-object";
import { Vector3 as Vec3 } from "../abstractions/vector3";
import { lerp } from "../utils";

export class TransformComponent extends DataComponent {
  private _previousPosition: Vec3 = new Vector3(0, 0, 0);
  public get previousPosition(): Vec3 {
    return this._previousPosition;
  }
  private _position: Vec3 = new Vector3(0, 0, 0);
  public get position(): Vec3 {
    return this._position;
  }

  private _previousRotation: Vec3 = new Vector3(0, 0, 0);
  public get previousRotation(): Vec3 {
    return this._previousRotation;
  }
  private _rotation: Vec3 = new Vector3(0, 0, 0);
  public get rotation(): Vec3 {
    return this._rotation;
  }

  private _previousScale: Vec3 = new Vector3(1, 1, 1);
  public get previousScale(): Vec3 {
    return this._previousScale;
  }
  private _scale: Vec3 = new Vector3(1, 1, 1);
  public get scale(): Vec3 {
    return this._scale;
  }

  constructor(gameObject: GameObject) {
    super(gameObject);
  }

  setPosition(position: Vec3): void {
    this._previousPosition = this._position;
    this._position = position;
  }

  setRotation(rotation: Vec3): void {
    this._previousRotation = this._rotation;
    this._rotation = rotation;
  }

  setScale(scale: Vec3): void {
    this._previousScale = this._scale;
    this._scale = scale;
  }

  getInterpolatedPosition(alpha: Alpha): Vec3 {
    return lerp(this._previousPosition, this._position, alpha);
  }

  setPreviousPosition(position: Vec3): void {
    this._previousPosition = position;
  }

  getInterpolatedRotation(alpha: Alpha): Vec3 {
    return lerp(this._previousRotation, this._rotation, alpha);
  }

  setPreviousRotation(rotation: Vec3): void {
    this._previousRotation = rotation;
  }

  getInterpolatedScale(alpha: Alpha): Vec3 {
    return lerp(this._previousScale, this._scale, alpha);
  }

  setPreviousScale(scale: Vec3): void {
    this._previousScale = scale;
  }
}

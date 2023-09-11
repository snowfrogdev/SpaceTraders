import { Alpha } from "./abstractions/component";
import { Vector3 } from "./abstractions/vector3";
import { Vector3 as Vec3 } from "@babylonjs/core/Maths/math.vector";

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function randomBetweenWithExclusion(min: number, max: number, exclusionMin: number, exclusionMax: number) {
  if (exclusionMin >= exclusionMax) {
    throw new Error("Invalid exclusion range");
  }

  const range = max - min;
  const exclusionRange = exclusionMax - exclusionMin;

  // If the exclusion range is outside of the main range, just return a simple random number
  if (exclusionMax <= min || exclusionMin >= max) {
    return Math.random() * range + min;
  }

  const adjustedMax = max - exclusionRange;
  let result = Math.random() * (adjustedMax - min) + min;

  if (result >= exclusionMin) {
    result += exclusionRange;
  }

  return result;
}

export function lerp(a: Vector3, b: Vector3, alpha: Alpha): Vector3 {
  return Vec3.Lerp(a as any, b as any, alpha)
}

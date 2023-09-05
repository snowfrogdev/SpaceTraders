export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
export function randomBetweenWithExclusion(min, max, exclusionMin, exclusionMax) {
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

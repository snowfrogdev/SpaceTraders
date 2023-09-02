/**
 * ZCalculator computes the Z value for a given (x, y) point in 3D space
 * based on a Gaussian function. The class provides flexibility in shaping
 * the curve through three parameters:
 *
 * - `peakValue`: Specifies the maximum height of the curve at the origin.
 *      This determines how high the curve reaches at its peak.
 *
 * - `spread`: Determines the spread or width of the curve.
 *      A smaller spread will produce a steeper, more narrowly focused curve,
 *      whereas a larger spread will produce a more gradual curve.
 *
 * - `noiseMagnitude`: Introduces a randomness factor to the Z value.
 *      This adjusts the computed Z value by a small amount,
 *      giving it some variability.
 *
 * The main method `getZ(x, y)` computes the Z value for the given (x, y)
 * coordinates based on the aforementioned parameters. After computing the
 * Z value and adding noise, the function will randomly select a value
 * within the range of [-Z, Z].
 */
export class ZCalculator {
  peakValue;
  spread;
  noiseMagnitude;

  constructor(peakValue, spread, noiseMagnitude) {
    this.peakValue = peakValue;
    this.spread = spread;
    this.noiseMagnitude = noiseMagnitude;
  }

  getZ(x, y) {
    // Calculate distance from origin
    const d = Math.sqrt(x * x + y * y);

    // Compute Z based on Gaussian function
    let Z = this.peakValue * Math.exp(-(d * d) / (2 * this.spread * this.spread));

    // Add noise to Z
    Z += (Math.random() - 0.5) * 2 * this.noiseMagnitude;

    // Randomly select a value within the range [-Z, Z]
    return Math.random() * Z * (Math.random() > 0.5 ? 1 : -1);
  }
}

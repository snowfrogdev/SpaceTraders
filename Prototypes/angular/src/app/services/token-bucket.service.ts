export class DualTokenBucketService {
  private tokensBucket1: number;
  private tokensBucket2: number;
  private lastRefillTimestamp: number;

  constructor(
    private capacityBucket1: number,
    private refillRateBucket1: number,
    private capacityBucket2: number,
    private refillRateBucket2: number
  ) {
    this.tokensBucket1 = capacityBucket1;
    this.tokensBucket2 = capacityBucket2;
    this.lastRefillTimestamp = performance.now();
  }

  private refill() {
    const now = performance.now();
    const elapsedTime = now - this.lastRefillTimestamp;

    const tokensToAddBucket1 = (elapsedTime * this.refillRateBucket1) / 1000;
    this.tokensBucket1 = Math.min(this.capacityBucket1, this.tokensBucket1 + tokensToAddBucket1);

    const tokensToAddBucket2 = (elapsedTime * this.refillRateBucket2) / 1000;
    this.tokensBucket2 = Math.min(this.capacityBucket2, this.tokensBucket2 + tokensToAddBucket2);

    this.lastRefillTimestamp = now;
  }

  consume(tokens: number): boolean {
    this.refill();

    if (tokens <= this.tokensBucket1) {
      this.tokensBucket1 -= tokens;
      return true;
    } else if (tokens <= this.tokensBucket2) {
      this.tokensBucket2 -= tokens;
      return true;
    }

    return false;
  }
}

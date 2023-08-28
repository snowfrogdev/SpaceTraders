const SHORT_BUCKET_CAPACITY = 2;
const SHORT_BUCKET_REFILL_RATE = 2;
const SHORT_BUCKET_BASE_REFILL_INTERVAL_IN_MS = 1000;

const BURST_BUCKET_CAPACITY = 10;
const BURST_BUCKET_REFILL_RATE = 1;
const BURST_BUCKET_BASE_REFILL_INTERVAL_IN_MS = 1000;

const DECREMENT_VALUE = 50; // Decrease refill interval by 50ms for each successful request

let currentShortTokens = SHORT_BUCKET_CAPACITY;
let shortBucketRefillIntervalInMs = SHORT_BUCKET_BASE_REFILL_INTERVAL_IN_MS;

let shortBucketIntervalId = setInterval(() => {
  currentShortTokens = Math.min(currentShortTokens + SHORT_BUCKET_REFILL_RATE, SHORT_BUCKET_CAPACITY);
}, shortBucketRefillIntervalInMs);

let currentBurstTokens = BURST_BUCKET_CAPACITY;
let burstBucketRefillIntervalInMs = BURST_BUCKET_BASE_REFILL_INTERVAL_IN_MS;

let burstBucketIntervalId = setInterval(() => {
  currentBurstTokens = Math.min(currentBurstTokens + BURST_BUCKET_REFILL_RATE, BURST_BUCKET_CAPACITY);
}, burstBucketRefillIntervalInMs);

export function consumeToken() {
  if (currentShortTokens > 0) {
    currentShortTokens--;
    return true;
  }

  if (currentBurstTokens > 0) {
    currentBurstTokens--;
    return true;
  }

  return false;
}

export function increaseRefillInterval(milliseconds) {
  shortBucketRefillIntervalInMs = Math.max(
    SHORT_BUCKET_BASE_REFILL_INTERVAL_IN_MS,
    shortBucketRefillIntervalInMs + milliseconds
  );
  clearInterval(shortBucketIntervalId);

  burstBucketRefillIntervalInMs = Math.max(
    BURST_BUCKET_BASE_REFILL_INTERVAL_IN_MS,
    burstBucketRefillIntervalInMs + milliseconds
  );
  clearInterval(burstBucketIntervalId);

  shortBucketIntervalId = setInterval(() => {
    currentShortTokens = Math.min(currentShortTokens + SHORT_BUCKET_REFILL_RATE, SHORT_BUCKET_CAPACITY);
  }, shortBucketRefillIntervalInMs);

  burstBucketIntervalId = setInterval(() => {
    currentBurstTokens = Math.min(currentBurstTokens + BURST_BUCKET_REFILL_RATE, BURST_BUCKET_CAPACITY);
  }, burstBucketRefillIntervalInMs);
}

export function decreaseRefillInterval() {
  shortBucketRefillIntervalInMs = Math.max(
    SHORT_BUCKET_BASE_REFILL_INTERVAL_IN_MS,
    shortBucketRefillIntervalInMs - DECREMENT_VALUE
  );
  clearInterval(shortBucketIntervalId);

  burstBucketRefillIntervalInMs = Math.max(
    BURST_BUCKET_BASE_REFILL_INTERVAL_IN_MS,
    burstBucketRefillIntervalInMs - DECREMENT_VALUE
  );
  clearInterval(burstBucketIntervalId);

  shortBucketIntervalId = setInterval(() => {
    currentShortTokens = Math.min(currentShortTokens + SHORT_BUCKET_REFILL_RATE, SHORT_BUCKET_CAPACITY);
  }, shortBucketRefillIntervalInMs);

  burstBucketIntervalId = setInterval(() => {
    currentBurstTokens = Math.min(currentBurstTokens + BURST_BUCKET_REFILL_RATE, BURST_BUCKET_CAPACITY);
  }, burstBucketRefillIntervalInMs);
}

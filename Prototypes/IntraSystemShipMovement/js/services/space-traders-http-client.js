import ky from "ky";
import { consumeToken, increaseRefillInterval, decreaseRefillInterval } from "./token-bucket.js";
import { SpaceTradersAuthToken } from "../app-settings.js";

const BASE_URL = "https://api.spacetraders.io/v2/";
const AUTH_TOKEN = SpaceTradersAuthToken;
// RPM stats
let totalRequests = 0;
const sessionStartTimestamp = Date.now();

export const httpClient = ky.create({
  prefixUrl: BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  },
  retry: 5,
  hooks: {
    beforeRequest: [
      async () => {
        while (!consumeToken()) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      },
      async () => {
        totalRequests++;
      },
    ],
    beforeRetry: [
      async ({ request, options, error, retryCount }) => {
        if (error?.response?.status === 429) {
          const retryAfterInSec = parseInt(error.response.headers.get("Retry-After"));
          increaseRefillInterval(retryAfterInSec * 1000);
        }
        while (!consumeToken()) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        totalRequests++;
      },
    ],
    afterResponse: [
      (request, options, response) => {
        if (response.status !== 429) {
          decreaseRefillInterval();
        }

        const elapsedMinutes = (Date.now() - sessionStartTimestamp) / 60000; // convert to minutes
        const averageRPM = totalRequests / elapsedMinutes;

        console.log(`Average RPM: ${averageRPM.toFixed(2)}`);

        return response;
      },
    ],
  },
});

import ky from "ky";
import { consumeToken, increaseRefillInterval, decreaseRefillInterval } from "./token-bucket.js";

const BASE_URL = "https://api.spacetraders.io/v2/";
const AUTH_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiRkFSVF9NT05LRVkiLCJ2ZXJzaW9uIjoidjIiLCJyZXNldF9kYXRlIjoiMjAyMy0wOS0wMiIsImlhdCI6MTY5MzcwMjY0Niwic3ViIjoiYWdlbnQtdG9rZW4ifQ.Wr5kI-Mc6brZPtNNp2SqnSTgB0l0sZTdsND4TW3jhCgW7wIrj_asKjF8wQ54S2QB-RChJ4l3z_gooBVxrSAUT8U4BbmlR84RAzLD-Pdp1zaQiFKhM8-kOoq36z8hJWry0IQD6Pfaj3ofZaFX-J47IkrVrl9jRRUuJGNDBp8fGWnfSFPeAxwOrNYiVlUbzb5lOjUa9XXU1C9wu927FGB9TBqyez5oU9LdJvjtcm6xX2ra5cExOQ0j-cZLD5MyqsH2FvFuVqmSC70GJPllQ6MinvGuz9KwGW-zwwZxFcw3YD-V8ya6If4KQaTbbpVwl6Xxun5JKapGF3yXJ31Y-uc1xA";

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

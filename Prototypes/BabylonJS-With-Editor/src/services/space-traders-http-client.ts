import ky, { HTTPError } from "ky";
import { consumeToken, increaseRefillInterval, decreaseRefillInterval } from "./token-bucket.js";

const BASE_URL = "https://api.spacetraders.io/v2/";
const AUTH_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiQkFXSVRBQkEiLCJ2ZXJzaW9uIjoidjIiLCJyZXNldF9kYXRlIjoiMjAyMy0wOC0yNiIsImlhdCI6MTY5MzE4MTY3Nywic3ViIjoiYWdlbnQtdG9rZW4ifQ.cp5ZmE3EQCQsi-sJ7e-MMzpWxOAWItGixG8ZumjgdmS-ihhPyTzc8fG4mFaTXmRA93jp4nI-XYcFBjuT4Q4A3FIXPzVyPbSoxUUvCCOeVjdT_e2bIGOPKsqnMbpl5vWQmGRkZAyxyDiHCX7IXamhBgBqXy-vIUb6tRjX8V5Rbbc-FQGBcCAip9XuSSCSG3vUgdHHrRzWcukTAaT-1oXKEu4pGWxNO-U_HG8rHD4cJGC62R_Q738tj2CqRpQHUB12I-NatdlAluQnxjIPnJ6zvntg0oQbUhgWSnBCqMXuAhXs5fNoAI5l38vBZUhbvMsSgOcFKS-SMSUt7A2WwoCw2w";

// RPM stats
let totalRequests = 0;
const sessionStartTimestamp = Date.now();

const api = ky.create({
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
    ],
    beforeRetry: [
      async ({ request, options, error, retryCount }) => {
        if ((<HTTPError>error)?.response?.status === 429) {
          const retryAfterInSec = parseInt((<HTTPError>error).response.headers.get("Retry-After"));
          increaseRefillInterval(retryAfterInSec * 1000);
        }
        while (!consumeToken()) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      },
    ],
    afterResponse: [
      (request, options, response) => {
        if (response.status !== 429) {
          decreaseRefillInterval();
        }

        // RPM calculation
        totalRequests++;

        const elapsedMinutes = (Date.now() - sessionStartTimestamp) / 60000; // convert to minutes
        const averageRPM = totalRequests / elapsedMinutes;

        console.log(`Average RPM: ${averageRPM.toFixed(2)}`);

        return response;
      },
    ],
  },
});

export async function* fetchAllSystems() {
  const pageLimit = 20;

  // Fetch the first page to get the total count
  const firstPageResponse = await api.get(`systems?page=1&limit=${pageLimit}`);
  const firstPageBody = await firstPageResponse.json();
  yield firstPageBody.data;

  const totalSystems = firstPageBody.meta.total;
  const totalPages = Math.ceil(totalSystems / pageLimit);

  // Start from the second page since we've already fetched the first page
  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    const pageResponse = await api.get(`systems?page=${currentPage}&limit=${pageLimit}`);
    const pageBody = await pageResponse.json();
    yield pageBody.data;
  }
}

export async function speedTest() {
  setInterval(async () => {
    api.get(`systems?page=1&limit=20`);
  }, 300);
}

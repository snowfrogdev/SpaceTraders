import ky from "ky";
import { consumeToken, increaseRefillInterval, decreaseRefillInterval } from "./token-bucket.js";

const BASE_URL = "https://api.spacetraders.io/v2/";
const AUTH_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiU01FR19NQSIsInZlcnNpb24iOiJ2MiIsInJlc2V0X2RhdGUiOiIyMDIzLTA4LTE5IiwiaWF0IjoxNjkyNDY0NTY0LCJzdWIiOiJhZ2VudC10b2tlbiJ9.epYBGxU9I9IZRmHBXD88lFPKMX-wfWiWpHgwEi-NzVmJnha_dxoCCoHoJE1Nw2m4bPlkCFswrhkQ8LQ6eGcHhrHnzkSHgmgqi7n34UuuiZ6U3n0dZMt2R5hui3M3dQjwkBusDfoWohKnBaPRU3UN45VnUkXvICml9iBQ0R5boo-EVBOsuAmxmnpr_tm8xnZTgXPcCQNgUgRg4iVvij-JXFxsYT8hof78ibBFbVNRrB4hqf0kdynBMzJEia9Qbca2CYosA7_MS-4L-_WnTt35EoTHRWC-CBkfFfKRdK2MX3RaEddJn8kGfGo8jIWocBzDgcAXUX5GNNMiS520cLSUWw";

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
        if (error?.response?.status === 429) {
          const retryAfterInSec = parseInt(error.response.headers.get("Retry-After"));
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

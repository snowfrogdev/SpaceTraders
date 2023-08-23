import { storeData } from "./db.js";

const BASE_URL = "https://api.spacetraders.io/v2/systems";
const INTERVAL_TIME = 367;
const LIMIT_PER_PAGE = 20;
const fetchButton = document.querySelector("#fetch");
const stopButton = document.querySelector("#stop");
let intervalId;
let isPaused = false;
let currentPage = 1;
/* fetchButton.addEventListener("click", startFetching);
stopButton.addEventListener("click", stopFetching); */

async function fetchPageData(page) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer " +
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiU01FR19NQSIsInZlcnNpb24iOiJ2MiIsInJlc2V0X2RhdGUiOiIyMDIzLTA4LTE5IiwiaWF0IjoxNjkyNDY0NTY0LCJzdWIiOiJhZ2VudC10b2tlbiJ9.epYBGxU9I9IZRmHBXD88lFPKMX-wfWiWpHgwEi-NzVmJnha_dxoCCoHoJE1Nw2m4bPlkCFswrhkQ8LQ6eGcHhrHnzkSHgmgqi7n34UuuiZ6U3n0dZMt2R5hui3M3dQjwkBusDfoWohKnBaPRU3UN45VnUkXvICml9iBQ0R5boo-EVBOsuAmxmnpr_tm8xnZTgXPcCQNgUgRg4iVvij-JXFxsYT8hof78ibBFbVNRrB4hqf0kdynBMzJEia9Qbca2CYosA7_MS-4L-_WnTt35EoTHRWC-CBkfFfKRdK2MX3RaEddJn8kGfGo8jIWocBzDgcAXUX5GNNMiS520cLSUWw", // use your token here
    },
  };

  const url = `${BASE_URL}?page=${page}&limit=${LIMIT_PER_PAGE}`;

  try {
    const response = await fetch(url, requestOptions);

    if (response.status === 429) {
      const responseBody = await response.json();
      const retryAfter = responseBody.error.data.retryAfter * 1000; // Convert to milliseconds

      console.warn(`Rate limited on page ${page}. Pausing for ${retryAfter}ms`);
      isPaused = true;

      setTimeout(() => {
        fetchPageData(page); // Retry the failed page fetch
        isPaused = false;
      }, retryAfter);
    } else {
      const body = await response.json();

      // If no more data or some other condition to stop fetching, clear the interval
      if (!body.data.length || body.data.length < LIMIT_PER_PAGE) {
        stopFetching();
        return;
      }

      storeData(body.data);
    }
  } catch (error) {
    console.error(`Error fetching page ${page}`, error);
  }
}
function startFetching() {
  intervalId = setInterval(() => {
    if (isPaused) {
      return;
    }

    fetchPageData(currentPage);
    currentPage++;
  }, INTERVAL_TIME);
}
function stopFetching() {
  clearInterval(intervalId); // Stop the interval
  console.log(`Finished fetching`);
}

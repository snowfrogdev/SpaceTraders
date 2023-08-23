const URL = "https://api.spacetraders.io/v2/my/ships?page=1&limit=10";
const INTERVAL_TIME = 367;

const fetchButton = document.querySelector("#fetch");
const stopButton = document.querySelector("#stop");

let intervalId;
let startTime;
let isPaused = false;
let count = 0;

fetchButton.addEventListener("click", startFetching);
stopButton.addEventListener("click", () => {
  clearInterval(intervalId);

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  console.log(
    `Total requests: ${count} in ${elapsedSeconds.toFixed(2)} seconds.`
  );
});

async function makeRequest(requestId) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer " +
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiU01FR19NQSIsInZlcnNpb24iOiJ2MiIsInJlc2V0X2RhdGUiOiIyMDIzLTA4LTE5IiwiaWF0IjoxNjkyNDY0NTY0LCJzdWIiOiJhZ2VudC10b2tlbiJ9.epYBGxU9I9IZRmHBXD88lFPKMX-wfWiWpHgwEi-NzVmJnha_dxoCCoHoJE1Nw2m4bPlkCFswrhkQ8LQ6eGcHhrHnzkSHgmgqi7n34UuuiZ6U3n0dZMt2R5hui3M3dQjwkBusDfoWohKnBaPRU3UN45VnUkXvICml9iBQ0R5boo-EVBOsuAmxmnpr_tm8xnZTgXPcCQNgUgRg4iVvij-JXFxsYT8hof78ibBFbVNRrB4hqf0kdynBMzJEia9Qbca2CYosA7_MS-4L-_WnTt35EoTHRWC-CBkfFfKRdK2MX3RaEddJn8kGfGo8jIWocBzDgcAXUX5GNNMiS520cLSUWw", // use your token here
    },
  };

  try {
    const response = await fetch(URL, requestOptions);

    if (response.status === 429) {
      const responseBody = await response.json();
      const retryAfter = responseBody.error.data.retryAfter * 1000; // Convert to milliseconds

      console.warn(
        `Rate limited on request #${requestId}. Pausing for ${retryAfter}ms`
      );
      isPaused = true;

      setTimeout(() => {
        isPaused = false;
        makeRequest(requestId); // Retry the failed request
      }, retryAfter);
    } else {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const averageRequestsPerSecond = count / elapsedSeconds;

      console.log(
        `Request #${requestId}: ${
          response.status
        } | Avg: ${averageRequestsPerSecond.toFixed(2)} req/s`
      );
    }
  } catch (error) {
    console.error(`Request #${requestId}`, error);
  }
}

function startFetching() {
  startTime = Date.now();

  intervalId = setInterval(() => {
    if (isPaused) {
      return;
    }

    const requestId = ++count;
    makeRequest(requestId);
  }, INTERVAL_TIME);
}

// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiU01FR19NQSIsInZlcnNpb24iOiJ2MiIsInJlc2V0X2RhdGUiOiIyMDIzLTA4LTE5IiwiaWF0IjoxNjkyNDY0NTY0LCJzdWIiOiJhZ2VudC10b2tlbiJ9.epYBGxU9I9IZRmHBXD88lFPKMX-wfWiWpHgwEi-NzVmJnha_dxoCCoHoJE1Nw2m4bPlkCFswrhkQ8LQ6eGcHhrHnzkSHgmgqi7n34UuuiZ6U3n0dZMt2R5hui3M3dQjwkBusDfoWohKnBaPRU3UN45VnUkXvICml9iBQ0R5boo-EVBOsuAmxmnpr_tm8xnZTgXPcCQNgUgRg4iVvij-JXFxsYT8hof78ibBFbVNRrB4hqf0kdynBMzJEia9Qbca2CYosA7_MS-4L-_WnTt35EoTHRWC-CBkfFfKRdK2MX3RaEddJn8kGfGo8jIWocBzDgcAXUX5GNNMiS520cLSUWw

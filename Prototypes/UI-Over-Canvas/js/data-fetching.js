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
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiQkFXSVRBQkEiLCJ2ZXJzaW9uIjoidjIiLCJyZXNldF9kYXRlIjoiMjAyMy0wOC0yNiIsImlhdCI6MTY5MzE4MTY3Nywic3ViIjoiYWdlbnQtdG9rZW4ifQ.cp5ZmE3EQCQsi-sJ7e-MMzpWxOAWItGixG8ZumjgdmS-ihhPyTzc8fG4mFaTXmRA93jp4nI-XYcFBjuT4Q4A3FIXPzVyPbSoxUUvCCOeVjdT_e2bIGOPKsqnMbpl5vWQmGRkZAyxyDiHCX7IXamhBgBqXy-vIUb6tRjX8V5Rbbc-FQGBcCAip9XuSSCSG3vUgdHHrRzWcukTAaT-1oXKEu4pGWxNO-U_HG8rHD4cJGC62R_Q738tj2CqRpQHUB12I-NatdlAluQnxjIPnJ6zvntg0oQbUhgWSnBCqMXuAhXs5fNoAI5l38vBZUhbvMsSgOcFKS-SMSUt7A2WwoCw2w", // use your token here
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

import { httpClient } from "./space-traders-http-client.js";

export async function* fetchAllSystems() {
  const url = "systems";
  yield* fetchAllItems(url);
}

export async function* fetchAllMyShips() {
  const url = "my/ships";
  yield* fetchAllItems(url);
}

export async function* fetchAllWaypointsInSystem(systemSymbol) {
  const url = `systems/${systemSymbol}/waypoints`;
  yield* fetchAllItems(url);
}

export async function* fetchAllItems(url) {
  const pageLimit = 20;

  // Fetch the first page to get the total count
  const firstPageResponse = await httpClient.get(`${url}?page=1&limit=${pageLimit}`);
  const firstPageBody = await firstPageResponse.json();
  yield firstPageBody.data;

  const totalShips = firstPageBody.meta.total;
  const totalPages = Math.ceil(totalShips / pageLimit);

  // Start from the second page since we've already fetched the first page
  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    const pageResponse = await httpClient.get(`${url}?page=${currentPage}&limit=${pageLimit}`);
    const pageBody = await pageResponse.json();
    yield pageBody.data;
  }
}

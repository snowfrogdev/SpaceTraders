import "./data-fetching.js";
import { fetchAllSystems } from "./db.js";

const systems = await fetchAllSystems();

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

document.body.appendChild(app.view);

window.addEventListener("resize", resize);

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  // Adjust the stage's position
  app.stage.x = app.renderer.screen.width / 2;
  app.stage.y = app.renderer.screen.height / 2;
}

// Set pivot and position
app.stage.pivot.set(0, 0);
app.stage.position.set(
  app.renderer.screen.width / 2,
  app.renderer.screen.height / 2
);

const systemDots = [];

// Defined zoom levels
const zoomLevels = [
  0.005, 0.01, 0.02, 0.04, 0.08, 0.16, 0.32, 0.64, 1.28, 2.56, 5.12, 10.24,
];
let currentZoomIndex = 0;

// Star sizes for each zoom level
const starSizes = [
  1.5, 0.8, 0.4, 0.4, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05, 0.025, 0.025,
];

app.stage.scale.x = zoomLevels[currentZoomIndex];
app.stage.scale.y = zoomLevels[currentZoomIndex];

app.view.addEventListener("wheel", (event) => {
  const previousZoom = zoomLevels[currentZoomIndex];

  if (event.deltaY < 0 && currentZoomIndex < zoomLevels.length - 1) {
    currentZoomIndex++;
  } else if (event.deltaY > 0 && currentZoomIndex > 0) {
    currentZoomIndex--;
  }

  const newZoom = zoomLevels[currentZoomIndex];
  const scaleFactor = newZoom / previousZoom;

  // Find mouse position relative to the stage
  const mouseX = (event.clientX - app.stage.x) / previousZoom;
  const mouseY = (event.clientY - app.stage.y) / previousZoom;

  // Compute the new stage position so that the mouse remains at the same stage position after zooming
  app.stage.x -= mouseX * (scaleFactor - 1) * previousZoom;
  app.stage.y -= mouseY * (scaleFactor - 1) * previousZoom;

  // Adjust the scale of the app.stage based on zoom level
  app.stage.scale.x = newZoom;
  app.stage.scale.y = newZoom;

  // Adjust the scale of each dot based on star size
  systemDots.forEach((dot) => {
    dot.scale.set(starSizes[currentZoomIndex]);
  });

  event.preventDefault();

  updatePopupPosition();
});

let dragging = false;
let prevX, prevY;

// On mousedown, we'll start dragging
app.view.addEventListener("mousedown", (event) => {
  dragging = true;
  prevX = event.clientX;
  prevY = event.clientY;
});

// On mousemove, if dragging, we'll adjust the stage's position
app.view.addEventListener("mousemove", (event) => {
  if (dragging) {
    let dx = event.clientX - prevX;
    let dy = event.clientY - prevY;

    app.stage.x += dx;
    app.stage.y += dy;

    prevX = event.clientX;
    prevY = event.clientY;

    updatePopupPosition();
  }
});

// On mouseup, we'll stop dragging
app.view.addEventListener("mouseup", () => {
  dragging = false;
});

// Touch events for mobile
app.view.addEventListener(
  "touchstart",
  (event) => {
    dragging = true;
    prevX = event.touches[0].clientX;
    prevY = event.touches[0].clientY;
  },
  { passive: true }
);

app.view.addEventListener(
  "touchmove",
  (event) => {
    if (dragging) {
      let dx = event.touches[0].clientX - prevX;
      let dy = event.touches[0].clientY - prevY;

      app.stage.x += dx;
      app.stage.y += dy;

      prevX = event.touches[0].clientX;
      prevY = event.touches[0].clientY;
    }
    updatePopupPosition();
  },
  { passive: true }
);

app.view.addEventListener("touchend", () => {
  dragging = false;
});

const STAR_TYPES = {
  NEUTRON_STAR: { color: 0xaaaaaa, size: 60 },
  RED_STAR: { color: 0xff4500, size: 80 },
  ORANGE_STAR: { color: 0xffa500, size: 85 },
  BLUE_STAR: { color: 0x1e90ff, size: 90 },
  YOUNG_STAR: { color: 0xffff00, size: 95 },
  WHITE_DWARF: { color: 0xffffff, size: 70 },
  BLACK_HOLE: { color: 0x000000, size: 50 },
  HYPERGIANT: { color: 0xffd700, size: 100 },
  NEBULA: { color: 0x9400d3, size: 110 },
  UNSTABLE: { color: 0x8b0000, size: 75 },
};

function createStarTexture(starType) {
  const config = STAR_TYPES[starType];
  if (!config) throw new Error(`Unknown star type: ${starType}`);

  const starGraphic = new PIXI.Graphics();
  starGraphic.beginFill(config.color);
  starGraphic.drawCircle(0, 0, config.size);
  starGraphic.endFill();

  // Generate a texture from the graphics object
  return app.renderer.generateTexture(starGraphic);
}

// Store the textures so we don't generate them repeatedly
const starTextures = {};

function getStarTexture(starType) {
  if (!starTextures[starType]) {
    starTextures[starType] = createStarTexture(starType);
  }
  return starTextures[starType];
}

let selectedSystem = null;
let selectedSystemSprite = null;

function drawSystem(system) {
  const systemTexture = getStarTexture(system.type); // Assuming each system has a 'type' field
  const systemSprite = new PIXI.Sprite(systemTexture);

  // Set the position
  systemSprite.x = system.x;
  systemSprite.y = system.y;

  // Set initial scale based on the current zoom level
  systemSprite.scale.set(starSizes[currentZoomIndex]);

  // Add to the app.stage
  app.stage.addChild(systemSprite);

  // Store in the systemDots array for potential future reference
  systemDots.push(systemSprite);

  systemSprite.interactive = true;
  systemSprite.buttonMode = true;

  systemSprite.on("click", (event) => {
    event.stopPropagation();

    // Calculate the world position of the systemSprite
    const globalPosition = systemSprite.getGlobalPosition();
    // Convert canvas coordinates to DOM coordinates
    const rect = app.view.getBoundingClientRect();
    const domX = rect.left + globalPosition.x;
    const domY = rect.top + globalPosition.y;

    showSystemInfoPopup(system, domX, domY);

    selectedSystem = system;
    selectedSystemSprite = systemSprite;
  });
}

// Iterate through the systems to draw them
systems.forEach(drawSystem);

/*************** SYSTEM INFO POPUP ******************/

const popup = document.getElementById("systemInfoPopup");
const content = document.getElementById("systemInfoContent");
const closeBtn = document.getElementById("closePopupBtn");

function showSystemInfoPopup(system, x, y) {
  const formattedContent =
    `${system.symbol}<br>Type: ${system.type}<br>Location: X(${system.x}) Y (${system.y})`.replace(
      /\n/g,
      "<br>"
    );
  content.innerHTML = formattedContent; // Use innerHTML instead of textContent
  popup.style.left = x + "px";
  popup.style.top = y + "px";
  popup.style.display = "block";
}

function hideSystemInfoPopup() {
  popup.style.display = "none";
}

closeBtn.addEventListener("click", hideSystemInfoPopup);

function updatePopupPosition() {
  if (selectedSystemSprite) {
    const globalPosition = selectedSystemSprite.getGlobalPosition();
    const rect = app.view.getBoundingClientRect();
    const domX = rect.left + globalPosition.x;
    const domY = rect.top + globalPosition.y;

    popup.style.left = domX + "px";
    popup.style.top = domY + "px";
  }
}

/*************** SYSTEM SEARCH ******************/
const searchInput = document.getElementById("search-input");
const resultsBox = document.getElementById("results");

searchInput.addEventListener("input", async function () {
  const query = searchInput.value;
  if (!query) {
    resultsBox.innerHTML = "";
    return;
  }

  // This assumes you have a 'fetchSystemsBySymbol' function in your db.js file
  const matchingSystems = await fuzzySearchSystemsBySymbol(query);

  let resultsHtml = "";
  matchingSystems.forEach((system) => {
    resultsHtml += `<div class="result" data-id="${system.symbol}">${system.symbol}</div>`;
  });

  resultsBox.innerHTML = resultsHtml;
});

// Handle click on a search result
resultsBox.addEventListener("click", function (event) {
  if (event.target.classList.contains("result")) {
    const systemId = event.target.dataset.id;
    // Find the system in the 'systems' array
    const system = systems.find((s) => s.symbol == systemId);

    if (system) {
      // Pan and zoom to the system
      const targetZoomIndex = 4; // Change this based on how close you want to zoom
      const targetZoom = zoomLevels[targetZoomIndex];
      app.stage.x = -system.x * targetZoom + app.renderer.screen.width / 2;
      app.stage.y = -system.y * targetZoom + app.renderer.screen.height / 2;
      app.stage.scale.x = targetZoom;
      app.stage.scale.y = targetZoom;
    }
  }
});

function fuzzySearchSystemsBySymbol(query) {
  const lowerCaseQuery = query.toLowerCase();

  const matches = [];

  for (let system of systems) {
    if (system.symbol.toLowerCase().includes(lowerCaseQuery)) {
      matches.push(system);

      if (matches.length === 10) {
        break;
      }
    }
  }

  return matches;
}

export function addFPSCounter(pixiApp) {
  // Create the FPS counter element
  const fpsCounterElement = document.createElement("div");

  // Apply styles
  fpsCounterElement.style.position = "fixed";
  fpsCounterElement.style.top = "10px";
  fpsCounterElement.style.right = "10px";
  fpsCounterElement.style.fontFamily = "Arial";
  fpsCounterElement.style.fontSize = "20px";
  fpsCounterElement.style.color = "#ffffff";
  fpsCounterElement.style.zIndex = "10000"; // Ensures it's on top of other elements
  fpsCounterElement.style.padding = "5px 10px";
  fpsCounterElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Optional: semi-transparent background for better visibility
  fpsCounterElement.style.borderRadius = "5px"; // Optional: rounded corners for aesthetics
  fpsCounterElement.style.webkitUserSelect = "none";
  fpsCounterElement.style.mozUserSelect = "none";
  fpsCounterElement.style.msUserSelect = "none";
  fpsCounterElement.style.userSelect = "none";

  // Add to the DOM
  document.body.appendChild(fpsCounterElement);

  // Update the FPS counter
  pixiApp.ticker.add(() => {
    fpsCounterElement.textContent = `FPS: ${Math.round(pixiApp.ticker.FPS)}`;
  });
}

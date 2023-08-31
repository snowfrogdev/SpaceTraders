import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { Repository } from "./repository.js";
import { SystemInfoManager } from "./system-info-manager.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);

const stats = new Stats();
stats.showPanel(0);
stats.domElement.style.position = "fixed";
stats.domElement.style.zIndex = "10000";
document.body.appendChild(stats.domElement);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new MapControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 8;
controls.panSpeed = 1.5;
controls.enableDamping = true;
controls.minPolarAngle = THREE.MathUtils.degToRad(0);
controls.maxPolarAngle = THREE.MathUtils.degToRad(60);
controls.listenToKeyEvents(window);

controls.keys = {
  LEFT: "KeyA", //left arrow
  UP: "KeyW", // up arrow
  RIGHT: "KeyD", // right arrow
  BOTTOM: "KeyS", // down arrow
};

camera.lookAt(0, 0, 0);
camera.position.y = 95000;
controls.update();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const systemsRepo = new Repository("systems");

const systemConfig = {
  NEUTRON_STAR: { color: 0x00ffff, size: 1500 },
  RED_STAR: { color: 0xff0000, size: 2000 },
  ORANGE_STAR: { color: 0xffa500, size: 2500 },
  BLUE_STAR: { color: 0x0000ff, size: 3000 },
  YOUNG_STAR: { color: 0xffff00, size: 3500 },
  WHITE_DWARF: { color: 0xffffff, size: 1000 },
  BLACK_HOLE: { color: 0x000000, size: 500 },
  HYPERGIANT: { color: 0xff4500, size: 4000 },
  NEBULA: { color: 0x9400d3, size: 5000 },
  UNSTABLE: { color: 0xffd700, size: 4500 },
};

const objectConfig = {
  PLANET: { color: 0x1a75ff, size: 120 }, // A typical planet size relative to stars
  GAS_GIANT: { color: 0x3366ff, size: 300 }, // Gas giants are larger than regular planets
  MOON: { color: 0xb0b0b0, size: 40 }, // Moons are smaller than planets
  ORBITAL_STATION: { color: 0xc2c2c2, size: 80 }, // A space station, bigger than a moon but smaller than a planet
  JUMP_GATE: { color: 0x00e64d, size: 200 }, // Jump gates might be large structures but smaller than planets
  ASTEROID_FIELD: { color: 0x666666, size: 10 }, // Representing individual asteroids, quite small
  NEBULA: { color: 0xba55d3, size: 4000 }, // Nebulae are massive, but their appearance could vary a lot based on context
  DEBRIS_FIELD: { color: 0x505050, size: 5 }, // Smaller than asteroids, representing tiny debris
  GRAVITY_WELL: { color: 0x00008b, size: 2500 }, // Might be visually represented as a distortion or aura, so size could vary based on representation
};

const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying float vDistance;
    varying vec3 vColor;
    
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(cameraPosition - position);
        
        gl_PointSize = size / vDistance + 3.00;
        gl_Position = projectionMatrix * mvPosition;
        vColor = color;
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vDistance;

    void main() {
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(vColor, 1);
    }
`;

const pointShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: false,
});

async function renderSystems() {
  const starPositions = [];
  const starColors = [];
  const starSizes = [];

  for await (const system of systemsRepo.list()) {
    const randomY = THREE.MathUtils.randFloat(-50, 50);
    starPositions.push(system.x, randomY, system.y);
    const config = systemConfig[system.type];
    const starColor = new THREE.Color(config.color);
    starColors.push(starColor.r, starColor.g, starColor.b);
    starSizes.push(config.size);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(starSizes, 1));

  const points = new THREE.Points(geometry, pointShaderMaterial);
  scene.add(points);
}

const systemInfoManager = new SystemInfoManager(renderer.domElement, camera, scene, systemsRepo);



/** Distance widget **/
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // x,z plane

const distanceDisplay = document.createElement("div");
distanceDisplay.style.position = "absolute";
distanceDisplay.style.top = "00px";
distanceDisplay.style.right = "0px";
distanceDisplay.style.color = "white";
distanceDisplay.style.fontFamily = "Arial";
distanceDisplay.style.fontSize = "20px";
document.body.appendChild(distanceDisplay);

function animate() {
  stats.begin();
  controls.update();

  const ray = new THREE.Ray(camera.position, camera.getWorldDirection(new THREE.Vector3()));
  const intersectionPoint = new THREE.Vector3();

  if (ray.intersectPlane(plane, intersectionPoint)) {
    const distance = camera.position.distanceTo(intersectionPoint);
    distanceDisplay.innerHTML = `Distance: ${distance.toFixed(2)} units`;
  }

  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
}

await renderSystems();
animate();

/* for await (const systems of fetchAllSystems()) {
  systems.forEach((system) => systemsRepo.save(system));
}
 */

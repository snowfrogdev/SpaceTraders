import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { Repository } from "./repository.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150000);

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.domElement.style.position = "fixed";
stats.domElement.style.zIndex = "10000";
document.body.appendChild(stats.domElement);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new MapControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.rotateSpeed = 0.5;
controls.enableDamping = true;
controls.minPolarAngle = THREE.MathUtils.degToRad(0);
controls.maxPolarAngle = THREE.MathUtils.degToRad(60);

camera.lookAt(0, 0, 0);
camera.position.y = 2000;
controls.update();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const systemsRepo = new Repository("systems");

const vertexShader = `
    uniform float pointSize;
    varying float vDistance;
    
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(cameraPosition - position);
        
        gl_PointSize = pointSize / vDistance + 3.00;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    uniform vec3 color;
    varying float vDistance;

    void main() {
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(color, 1); // 1.0 - vDistance / 150000.0
    }
`;

const pointShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    color: { value: new THREE.Color(0xffffff) },
    pointSize: { value: 2000 },
  },
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
});

async function renderSystems() {
  const starPositions = [];

  for await (const system of systemsRepo.list()) {
    starPositions.push(system.x, 0, system.y);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));

  const points = new THREE.Points(geometry, pointShaderMaterial);
  scene.add(points);
}

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

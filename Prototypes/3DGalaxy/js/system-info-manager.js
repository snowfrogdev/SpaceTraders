import * as THREE from "three";

export class SystemInfoManager {
  #systemInfoOpen = false;
  #raycaster = new THREE.Raycaster();
  #mouse = new THREE.Vector2();
  #intersected;
  #systemInfo;

  constructor(canvas, camera, scene, systemsRepo) {
    this.#systemInfo = document.createElement("div");
    this.#systemInfo.style.position = "absolute";
    this.#systemInfo.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    this.#systemInfo.style.color = "white";
    this.#systemInfo.style.padding = "10px";
    this.#systemInfo.style.borderRadius = "5px";
    this.#systemInfo.style.display = "none"; // Hidden by default
    document.body.appendChild(this.#systemInfo);

    canvas.addEventListener("click", async (event) => {
      event.preventDefault();
      this.#mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.#mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.#raycaster.setFromCamera(this.#mouse, camera);
      const intersects = this.#raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (this.#systemInfoOpen && this.#intersected === intersect.object) {
          this.#systemInfoOpen = false;
          this.#systemInfo.style.display = "none";
          this.#intersected = null;
        } else {
          this.#intersected = intersect.object;

          const roundedX = Math.round(intersect.point.x);
          const roundedZ = Math.round(intersect.point.z);

          console.log(`Clicked on ${roundedX}, ${roundedZ}`);
          const systems = [];
          for await (const system of systemsRepo.list((system) => system.x === roundedX && system.y === roundedZ)) {
            systems.push(system);
          }

          const system = systems[0];

          this.#systemInfo.innerHTML = `
                <strong>${system.symbol}</strong><br>
                Type: ${system.type}<br>
                X: ${system.x}, Y:${system.y}<br>
          `;

          const vector = new THREE.Vector3();
          vector.copy(intersect.point);
          vector.project(camera);

          this.#systemInfo.style.left = `${((vector.x + 1) * window.innerWidth) / 2}px`;
          this.#systemInfo.style.top = `${(-(vector.y - 1) * window.innerHeight) / 2}px`;
          this.#systemInfo.style.display = "block";
          this.#systemInfoOpen = true;
        }
      } else if (this.#systemInfoOpen) {
        this.#systemInfoOpen = false;
        this.#systemInfo.style.display = "none";
        this.#intersected = null;
      }
    });
  }
}

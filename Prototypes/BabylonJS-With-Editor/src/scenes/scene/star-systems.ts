import { Mesh, MeshBuilder } from "@babylonjs/core/Meshes";
import { Node } from "@babylonjs/core/node";
import { Repository } from "../../services/repository";
import { SystemDto } from "../../dtos/system.dto";
import { visibleInInspector } from "../decorators";
import { Nullable } from "@babylonjs/core";

/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameras
 *      - Transform nodes
 *
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class MyScript extends Node {
  @visibleInInspector("Node", "Star Mesh", "Star Mesh", { allowedNodeType: "Mesh" })
  public starMesh: Mesh | string = "";
  /**
   * Override constructor.
   * @warn do not fill.
   */
  // @ts-ignore ignoring the super call as we don't want to re-init
  protected constructor() {}

  /**
   * Called on the node is being initialized.
   * This function is called immediatly after the constructor has been called.
   */
  public async onInitialize(): Promise<void> {}

  /**
   * Called on the node has been fully initialized and is ready.
   */
  public onInitialized(): void {
    // ...
  }

  /**
   * Called on the scene starts.
   */
  public async onStart(): Promise<void> {
    // ...
    const systemRepo = new Repository<SystemDto>("systems");
    const systems: SystemDto[] = [];
    for await (const system of systemRepo.list()) {
      systems.push(system);
    }

    //const starMesh = MeshBuilder.CreateSphere("star", { diameter: 0.5 }, this.getScene());
    console.log({ starMesh: this.starMesh });
    if (typeof this.starMesh === "string") {
      this.starMesh = this.getScene().getMeshById(this.starMesh) as Mesh;
    }
    this.starMesh.isVisible = false;
    systems.forEach((system, index) => {
      const instance = (<Mesh>this.starMesh).createInstance(`star-${index}`);
      instance.alwaysSelectAsActiveMesh = true;
      instance.position.x = system.x;
      instance.position.y = 0;
      instance.position.z = system.y;
    });

    console.log("Done creating stars");
  }

  /**
   * Called each frame.
   */
  public onUpdate(): void {
    // ...
  }

  /**
   * Called on the object has been disposed.
   * Object can be disposed manually or when the editor stops running the scene.
   */
  public onStop(): void {
    // ...
  }

  /**
   * Called on a message has been received and sent from a graph.
   * @param name defines the name of the message sent from the graph.
   * @param data defines the data sent in the message.
   * @param sender defines the reference to the graph class that sent the message.
   */
  public onMessage(name: string, data: any, sender: any): void {
    switch (name) {
      case "myMessage":
        // Do something...
        break;
    }
  }
}

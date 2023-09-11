import { TransformComponent } from "../components/transform.component";
import { Component, UpdatePhase } from "./component";
import { v4 as uuid } from "uuid";

export class GameObject {
  readonly id = uuid();

  private _components = new Map<Function, Component<UpdatePhase>>();
  private _logicComponents = new Map<Function, Component<"logic">>();
  get logicComponents(): IterableIterator<Component<"logic">> {
    return this._logicComponents.values();
  }
  private _renderComponents = new Map<Function, Component<"render">>();
  get renderComponents(): IterableIterator<Component<"render">> {
    return this._renderComponents.values();
  }

  get transform(): TransformComponent {
    const transform = this.getComponent(TransformComponent);
    if (!transform) {
      throw new Error(`GameObject "${this.name}" has no TransformComponent`);
    }
    return transform;
  }

  constructor(readonly name: string) {
    this.addComponent(new TransformComponent(this));
  }

  addComponent(component: Component<UpdatePhase>): void {
    const componentType = component.constructor;
    this._components.set(componentType, component);
    if (component.updatePhase === "logic") {
      this._logicComponents.set(componentType, component as Component<"logic">);
    } else if (component.updatePhase === "render") {
      this._renderComponents.set(componentType, component as Component<"render">);
    }
  }

  getComponent<T extends Component<UpdatePhase>>(type: new (...args: any[]) => T): T | undefined {
    return this._components.get(type) as T | undefined;
  }
}

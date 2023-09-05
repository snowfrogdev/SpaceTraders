export class Entity {
  components = new Map();

  constructor(symbol) {
    this.symbol = symbol;
  }

  addComponent(component) {
    this.components.set(component.constructor.name, component);
  }

  getComponent(componentClass) {
    return this.components.get(componentClass.name);
  }

  init(scene) {
    console.warn(`Default init called for entity ${this.constructor.name}`);
  }

  update(deltaTime) {
    for (const component of this.components.values()) {
      component.update(deltaTime);
    }
  }
}

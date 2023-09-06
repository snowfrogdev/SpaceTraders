export class Entity {
  constructor(symbol) {
    this.symbol = symbol;
  }

  init(scene) {
    console.warn(`Default init called for entity ${this.constructor.name}`);
  }

  update(deltaTime) {
    console.warn(`Default update called for entity ${this.constructor.name}`);
  }
}

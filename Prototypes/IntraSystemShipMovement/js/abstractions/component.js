export class Component {
  constructor(entity) {
    this.entity = entity;
  }

  update(deltaTime) {
    console.warn(`Default update called for component ${this.constructor.name} on entity ${this.entity.id}`);
  }
}

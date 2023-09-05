import { Component } from "../abstractions/component.js";

export class ScaleComponent extends Component {
  constructor(entity, x = 1, y = 1, z = 1) {
    super(entity);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  update(deltaTime) {
    // Intentionaly left blank
  }
}

import { Component } from '../abstractions/component.js';

export class RotationComponent extends Component {
  constructor(entity, x = 0, y = 0, z = 0) {
    super(entity);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  update(deltaTime) {
    // Intentionaly left blank
  }
}

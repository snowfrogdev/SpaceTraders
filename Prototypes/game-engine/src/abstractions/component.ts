import { GameObject } from "./game-object";

export type UpdatePhase = "logic" | "render" | "none";

export type DeltaTime = number & { __brand: "DeltaTime" };
export type Alpha = number & { __brand: "Alpha" };

type UpdatePhaseTypeMap = {
  none: void;
  logic: DeltaTime;
  render: Alpha;
};

export abstract class Component<T extends UpdatePhase> {
  constructor(readonly updatePhase: T, protected _gameObject: GameObject) {}
  abstract update(arg: UpdatePhaseTypeMap[T]): void;
}

export abstract class LogicComponent extends Component<"logic"> {
  constructor(gameObject: GameObject) {
    super("logic", gameObject);
  }

  abstract update(deltaTime: DeltaTime): void;
}

export abstract class RenderComponent extends Component<"render"> {
  constructor(gameObject: GameObject) {
    super("render", gameObject);
  }

  abstract update(alpha: Alpha): void;
}

export class DataComponent extends Component<"none"> {
  constructor(gameObject: GameObject) {
    super("none", gameObject);
  }

  update(): void {}
}

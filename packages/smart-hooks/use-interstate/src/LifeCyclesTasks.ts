export interface LifeCyclesTaskBase {
  done: boolean;
  readonly run: (...args: never[]) => void;
  readonly reset: (...args: never[]) => void;
}

export interface StoreRenderTask extends LifeCyclesTaskBase {
  readonly run: () => void;
  readonly reset: () => void;
}

export interface StoreMapEffectTask extends LifeCyclesTaskBase {
  readonly run: () => void;
  readonly reset: () => void;
}

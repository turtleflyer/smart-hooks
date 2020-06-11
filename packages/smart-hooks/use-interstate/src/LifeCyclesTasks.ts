export interface LifeCyclesTaskBase {
  done: boolean;
  readonly run: (...args: any[]) => void;
  readonly reset: (...args: any[]) => void;
}

export interface StoreRenderTask extends LifeCyclesTaskBase {
  readonly run: () => void;
  readonly reset: () => void;
}

export interface StoreMapEffectTask extends LifeCyclesTaskBase {
  readonly run: () => void;
  readonly reset: () => void;
}

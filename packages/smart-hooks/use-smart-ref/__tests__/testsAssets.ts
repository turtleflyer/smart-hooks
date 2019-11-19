import { useSmartRef as useSmartRefD } from '../useSmartRef';

class Counter {
  toHaveBeenCalledTimes: number = 0;

  count() {
    this.toHaveBeenCalledTimes++;
  }

  reset() {
    this.toHaveBeenCalledTimes = 0;
  }
}

type CounterT = typeof Counter;
interface TestParameter {
  assets: {
    Counter: CounterT;
    useSmartRef: typeof useSmartRefD;
  };
}

type TestDescription = (p: TestParameter) => [string, () => void];

export { Counter, CounterT, TestParameter, TestDescription };

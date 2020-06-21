import type { LifeCyclesTaskBase } from './LifeCyclesTasks';

function isLifeCyclesTaskDone<T extends LifeCyclesTaskBase>(task: T): task is T & { done: true } {
  return task.done;
}

export function createCyclesTask<T extends LifeCyclesTaskBase>(
  initTask: () => Omit<T, 'run' | 'reset' | 'done'>,
  runProto: (...args: Parameters<T['run']>) => void = () => ({}),
  resetProto: (...args: Parameters<T['reset']>) => void = () => ({})
): T & { done: false } {
  function runOrReset<P extends 'run' | 'reset'>(keyName: P, proto: (...args: any[]) => void) {
    return (...args: any[]) => {
      if (isLifeCyclesTaskDone(memTask)) {
        if (keyName === 'run') {
          return;
        }
      } else if (keyName === 'reset') {
        return;
      }

      proto(...(<Parameters<T[P]>>args));
      memTask.done = keyName === 'run' ? true : false;
    };
  }

  const memTask = {
    ...initTask(),
    ...(<['run' | 'reset', (...args: any[]) => void][]>[
      ['run', runProto],
      ['reset', resetProto],
    ]).reduce(
      (ev, [key, proto]) =>
        ({
          ...ev,
          [key]: runOrReset(key, proto),
        } as Pick<T, 'run' | 'reset'>),
      {} as Pick<T, 'run' | 'reset'>
    ),
    done: false,
  } as T;

  return memTask as T & { done: false };
}

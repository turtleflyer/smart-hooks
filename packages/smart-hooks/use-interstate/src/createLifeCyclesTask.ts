import type { LifeCyclesTaskBase } from './LifeCyclesTasks';

function isLifeCyclesTaskDone<T extends LifeCyclesTaskBase>(task: T): task is T & { done: true } {
  return task.done;
}

type RunOrResetProp = 'run' | 'reset';

export function createCyclesTask<T extends LifeCyclesTaskBase>(
  initTask: () => Omit<T, 'run' | 'reset' | 'done'>,
  runProto: (...arg: Parameters<T['run']>) => void = () => ({}),
  resetProto: (...arg: Parameters<T['reset']>) => void = () => ({})
): T & { done: false } {
  function runOrReset<P extends RunOrResetProp>(
    propName: P,
    proto: (...arg: Parameters<T[RunOrResetProp]>[]) => void
  ) {
    return (...arg: Parameters<T[P]>[]) => {
      // eslint-disable-next-line no-use-before-define
      if (isLifeCyclesTaskDone(memTask)) {
        if (propName === 'run') {
          return;
        }
      } else if (propName === 'reset') {
        return;
      }

      proto(...arg);
      // eslint-disable-next-line no-use-before-define
      memTask.done = propName === 'run';
    };
  }

  const memTask = {
    ...initTask(),
    ...([
      ['run', runProto],
      ['reset', resetProto],
    ] as [RunOrResetProp, (...arg: Parameters<T[RunOrResetProp]>[]) => void][]).reduce(
      (ev, [key, proto]) =>
        ({
          ...ev,
          [key]: runOrReset(key, proto),
        } as Pick<T, RunOrResetProp>),
      {} as Pick<T, RunOrResetProp>
    ),
    done: false,
  } as T;

  return memTask as T & { done: false };
}

import type { StateKey } from './InterstateParam';
import type { MemValueMap, StoreState } from './StoreState';

export enum UseInterstateErrorCodes {
  CONCURRENTLY_PROVIDED_INIT_VALUE,

  ACCESS_VALUE_NOT_BEEN_SET,

  MULTIPLE_ATTEMPT_SET_STATE,

  INVALID_INTERFACE_CHANGE,

  UNEXPECTED_ERROR,
}

const UseInterstateErrorOptions: { [P in UseInterstateErrorCodes]: { message: string } } = {
  [UseInterstateErrorCodes.CONCURRENTLY_PROVIDED_INIT_VALUE]: {
    message:
      'More than one useInterstate hook provided initial value for the key %%key%% concurrently during the same rendering cycle',
  },

  [UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET]: {
    message:
      'The record for the key %%key%% requested while reading or writing but the value never been set',
  },

  [UseInterstateErrorCodes.MULTIPLE_ATTEMPT_SET_STATE]: {
    message:
      'Multiple attempt of setting value for the key %%key%% is registered during the same cycle',
  },

  [UseInterstateErrorCodes.INVALID_INTERFACE_CHANGE]: {
    message:
      'Invalid attempt to change of using interface during a life of a component is registered',
  },

  [UseInterstateErrorCodes.UNEXPECTED_ERROR]: {
    message: 'Unexpected error occurs',
  },
};

const MAINTENANCE_TIMEOUT = 10000;
const MAX_ERRORS_TO_STORE = 100;

export interface UseInterstateErrorMethods {
  readonly flushValueOfKey?: (isToRevertData?: boolean) => boolean;
}

let errorsPool: {
  readonly error: Error;
  readonly methods: UseInterstateErrorMethods;
  readonly lifeSignature: symbol;
}[] = [];

let currentLifeSignature: symbol | undefined;
let futureLifeSignature = Symbol();

function setNextInterval() {
  setTimeout(() => {
    if (currentLifeSignature) {
      errorsPool = errorsPool.filter((e) => e.lifeSignature !== currentLifeSignature);
    }

    if (errorsPool.length > 0) {
      currentLifeSignature = futureLifeSignature;
      futureLifeSignature = Symbol();
      setNextInterval();
    } else {
      currentLifeSignature = undefined;
    }
  }, MAINTENANCE_TIMEOUT);
}

type Impossible<T> = T & { [P: string]: never };

export type UseInterstateError = Impossible<Error>;

let extractedMethods: UseInterstateErrorMethods;

export function isUseInterstateError(e: Error): e is UseInterstateError {
  return errorsPool.some((errorFromPool) => {
    extractedMethods = errorFromPool.methods;
    return e === errorFromPool.error;
  });
}

export function getUseInterstateErrorsHandleMethods<E extends Error>(
  e: E
): E extends UseInterstateError ? UseInterstateErrorMethods : undefined;

export function getUseInterstateErrorsHandleMethods(
  e: Error
): UseInterstateErrorMethods | undefined {
  if (isUseInterstateError(e)) {
    return extractedMethods;
  }
}

interface ErrorOptions {
  readonly key?: StateKey;
}

interface ComposeMethodParam {
  memValuesMap: MemValueMap;
}

interface ErrorMethodTemplate {
  readonly nameOfMethod: keyof UseInterstateErrorMethods;
  readonly composeMethod: (
    prop: ComposeMethodParam,
    key?: StateKey
  ) => ((isToRevertData: boolean) => void) | undefined;
  readonly getCountSignature: (key?: StateKey) => number | undefined;
  readonly incrementCountSignature: (key?: StateKey) => void;
}

export type UseInterstateThrowError = (
  errorCode: UseInterstateErrorCodes,
  { key }: ErrorOptions
) => never;

export function createThrowError(storeState: StoreState): UseInterstateThrowError {
  const { storeMap } = storeState;

  function flushMapValue(key: StateKey, memValuesMap: MemValueMap, isToRevertData: boolean) {
    const mapValue = storeMap.get(key)!;
    for (const s of mapValue) {
      s.removeFromWatchList();
      s.errorChunk = true;
    }

    mapValue.start = undefined;
    mapValue.end = undefined;
    mapValue.initStatus = undefined;
    mapValue.caughtError = undefined;
    mapValue.triggerRegistered = false;

    if (isToRevertData) {
      if (memValuesMap.has(key)) {
        const prevData = memValuesMap.get(key);
        if (prevData) {
          mapValue.value = prevData.value;
        } else {
          mapValue.isValueSetUp = false;
        }
      }
    }
  }

  const flushValueOfKeyCountSignMap = new Map<StateKey, number>();

  const errorMethodsTemplates: ErrorMethodTemplate[] = [
    {
      nameOfMethod: 'flushValueOfKey',
      composeMethod: ({ memValuesMap }: ComposeMethodParam, key) =>
        key === undefined || !storeMap.has(key)
          ? undefined
          : (isToRevertData) => {
              flushMapValue(key, memValuesMap, isToRevertData);
            },
      getCountSignature: (key) => flushValueOfKeyCountSignMap.get(key!) ?? 0,
      incrementCountSignature: (key) => {
        const countSignature = flushValueOfKeyCountSignMap.get(key!);
        flushValueOfKeyCountSignMap.set(key!, countSignature ?? 0 + 1);
      },
    },
  ];

  function createMethodRegardingCountSignature(
    param: ComposeMethodParam,
    template: ErrorMethodTemplate,
    key?: StateKey
  ): ((isToRevertData?: boolean) => boolean) | undefined {
    const { composeMethod, getCountSignature, incrementCountSignature } = template;
    const method = composeMethod(param, key);
    const memCountSignature = getCountSignature(key);

    return method
      ? (isToRevertData = false) => {
          if (memCountSignature === getCountSignature(key)) {
            method(isToRevertData);
            incrementCountSignature(key);
            return true;
          }
          return false;
        }
      : undefined;
  }

  function throwError(errorCode: UseInterstateErrorCodes, { key }: ErrorOptions): never {
    const keyString = `"${key?.toString() ?? '<key index is not provided>'}"`;
    const message = `(useInterstate Error) ${UseInterstateErrorOptions[errorCode].message.replace(
      /%%key%%/i,
      keyString
    )}`;

    if (key !== undefined) {
      const mapValue = storeMap.get(key)!;
      mapValue.caughtError = errorCode;
    }

    const param: ComposeMethodParam = { memValuesMap: storeState.memValuesMap };

    const error = Error(message) as UseInterstateError;

    if (errorsPool.length === MAX_ERRORS_TO_STORE) {
      throw Error(
        '(useInterstate Error) Too many errors have been occurring for a short period of time'
      );
    } else {
      if (errorsPool.length === 0) {
        setNextInterval();
      }

      errorsPool.push({
        error,

        methods: errorMethodsTemplates.reduce((ev, t) => {
          return { ...ev, [t.nameOfMethod]: createMethodRegardingCountSignature(param, t, key) };
        }, {} as UseInterstateErrorMethods),

        lifeSignature: futureLifeSignature,
      });
    }

    throw error;
  }

  return throwError;
}

export interface ErrorHandleOptions {
  throwError: UseInterstateThrowError;
  key?: StateKey;
}

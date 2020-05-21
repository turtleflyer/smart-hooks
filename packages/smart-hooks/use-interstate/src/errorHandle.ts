import { MapKey, StoreMap, MapValue } from './StoreMap';

export enum UseInterstateErrorCodes {
  CONCURRENTLY_PROVIDED_INIT_VALUE,

  ACCESS_VALUE_NOT_BEEN_SET,

  NOT_BEEN_RECOVERED_AFTER_ERROR,

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

  [UseInterstateErrorCodes.NOT_BEEN_RECOVERED_AFTER_ERROR]: {
    message:
      'It appeared that the useInterstate inner state for the key %%key%% has not been recovered after the recent error has occurred',
  },

  [UseInterstateErrorCodes.UNEXPECTED_ERROR]: {
    message: 'Unexpected error occurs',
  },
};

const MAINTENANCE_TIMEOUT = 10000;
const MAX_ERRORS_TO_STORE = 100;

export interface UseInterstateErrorMethods {
  readonly flushValueOfKey?: () => void;
  readonly flushEntireMap: () => void;
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

export function getUseInterstateErrorMethods<E extends Error>(
  e: E
): E extends UseInterstateError ? UseInterstateErrorMethods : undefined;

export function getUseInterstateErrorMethods(e: Error): UseInterstateErrorMethods | undefined {
  if (isUseInterstateError(e)) {
    return extractedMethods;
  }
}

interface ErrorOptions {
  readonly key?: MapKey;
}

export type UseInterstateThrowError = (
  errorCode: UseInterstateErrorCodes,
  { key }: ErrorOptions
) => never;

export function composeThrowError(storeMap: StoreMap): UseInterstateThrowError {
  function flushMapValue(key: MapKey) {
    const mapValue = storeMap.get(key)!;
    for (const s of mapValue) {
      s.errorChunk = true;
    }

    storeMap.set(key, {
      ...mapValue,
      startOfSettersList: undefined,
      endOfSettersList: undefined,
      initStatus: false,
    });
  }

  interface ErrorMethodTemplate {
    readonly nameOfMethod: keyof UseInterstateErrorMethods;
    readonly composeMethod: (key?: MapKey) => (() => void) | undefined;
    readonly getCountSignature: (key?: MapKey) => number | undefined;
    readonly incrementCountSignature: (key?: MapKey) => void;
  }

  let flushEntireMapCountSign = 0;
  const flushValueOfKeyCountSignMap = new Map<MapKey, number>();

  const errorMethodsTemplates: ErrorMethodTemplate[] = [
    {
      nameOfMethod: 'flushEntireMap',
      composeMethod: () => () => {
        for (const k of storeMap.keys()) {
          flushMapValue(k);
        }
      },
      getCountSignature: () => flushEntireMapCountSign,
      incrementCountSignature: () => {
        flushEntireMapCountSign++;
      },
    },
    {
      nameOfMethod: 'flushValueOfKey',
      composeMethod: (key) => (key === undefined ? undefined : () => flushMapValue(key)),
      getCountSignature: (key) => (key ? flushValueOfKeyCountSignMap.get(key) ?? 0 : undefined),
      incrementCountSignature: (key) => {
        if (key) {
          const countSignature = flushValueOfKeyCountSignMap.get(key);
          flushValueOfKeyCountSignMap.set(key, countSignature ?? 0 + 1);
        }
      },
    },
  ];

  function composeMethodRegardingCountSignature<T extends ErrorMethodTemplate>(
    t: T,
    key?: MapKey
  ): (() => boolean) | ReturnType<T['composeMethod']> extends undefined ? undefined : never;

  function composeMethodRegardingCountSignature(t: ErrorMethodTemplate, key?: MapKey) {
    const { composeMethod, getCountSignature, incrementCountSignature } = t;
    const method = composeMethod(key);
    const memCountSignature = getCountSignature(key);

    return method
      ? () => {
          if (memCountSignature === getCountSignature(key)) {
            method();
            incrementCountSignature(key);
            return true;
          }
          return false;
        }
      : undefined;
  }

  return function throwError(errorCode, { key }) {
    const keyString = `"${key?.toString() ?? '<key index is not provided>'}"`;
    const message = `(useInterstate Error) ${UseInterstateErrorOptions[errorCode].message.replace(
      /%%key%%/i,
      keyString
    )}`;

    const error = <UseInterstateError>Error(message);

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
          return { ...ev, [t.nameOfMethod]: composeMethodRegardingCountSignature(t, key) };
        }, <UseInterstateErrorMethods>{}),

        lifeSignature: futureLifeSignature,
      });
    }

    throw error;
  };
}

import type { StateKey } from './InterstateParam';
import type { MemValueMap, StoreState } from './StoreState';

export enum UseInterstateErrorCodes {
  CONCURRENTLY_PROVIDED_INIT_VALUE,

  ACCESS_VALUE_NOT_BEEN_SET,

  MULTIPLE_ATTEMPT_SET_STATE,

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

  [UseInterstateErrorCodes.UNEXPECTED_ERROR]: {
    message: 'Unexpected error occurs',
  },
};

const MAINTENANCE_TIMEOUT = 10000;
const MAX_ERRORS_TO_STORE = 100;

export interface UseInterstateErrorServices {
  readonly flushValueOfKey?: (isToRevertData?: boolean) => boolean;
}

let errorsPool: {
  readonly error: Error;
  readonly services: UseInterstateErrorServices;
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

let extractedServices: UseInterstateErrorServices;

export function isUseInterstateError(e: Error): e is UseInterstateError {
  return errorsPool.some((errorFromPool) => {
    extractedServices = errorFromPool.services;
    return e === errorFromPool.error;
  });
}

export function getUseInterstateErrorServices<E extends Error>(
  e: E
): E extends UseInterstateError ? UseInterstateErrorServices : undefined;

export function getUseInterstateErrorServices(e: Error): UseInterstateErrorServices | undefined {
  if (isUseInterstateError(e)) {
    return extractedServices;
  }
}

interface ErrorOptions {
  readonly key?: StateKey;
}

interface ComposeServiceParam {
  memValuesMap: MemValueMap;
}

interface ErrorServiceTemplate {
  readonly nameOfService: keyof UseInterstateErrorServices;
  readonly composeService: (
    prop: ComposeServiceParam,
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

  const errorServicesTemplates: ErrorServiceTemplate[] = [
    {
      nameOfService: 'flushValueOfKey',
      composeService: ({ memValuesMap }: ComposeServiceParam, key) =>
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

  function createServiceRegardingCountSignature(
    param: ComposeServiceParam,
    template: ErrorServiceTemplate,
    key?: StateKey
  ): ((isToRevertData?: boolean) => boolean) | undefined {
    const { composeService, getCountSignature, incrementCountSignature } = template;
    const service = composeService(param, key);
    const memCountSignature = getCountSignature(key);

    return service
      ? (isToRevertData = false) => {
          if (memCountSignature === getCountSignature(key)) {
            service(isToRevertData);
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

    const param: ComposeServiceParam = { memValuesMap: storeState.memValuesMap };

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

        services: errorServicesTemplates.reduce((ev, t) => {
          return { ...ev, [t.nameOfService]: createServiceRegardingCountSignature(param, t, key) };
        }, <UseInterstateErrorServices>{}),

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

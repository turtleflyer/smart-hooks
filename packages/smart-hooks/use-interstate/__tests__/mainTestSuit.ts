// tslint:disable: react-hooks-nesting
import {
  TestParameter,
  AssetsImport,
  UseInterstateImport,
  CreateTestComponents,
} from './testsAssets';
import siblingsCanCommunicate from './tests/siblingsCanCommunicate';
import sophisticatedStructure from './tests/sophisticatedStructure';
import checkInitializationConcurrency from './tests/checkInitializationConcurrency';
import valuesRemainAfterTreeUnmount from './tests/valuesRemainAfterTreeUnmount';
import rerenderWithInitValueResetState from './tests/rerenderWithInitValueResetState';
import dynamicSubscriptionWorks from './tests/dynamicSubscriptionWorks';
import testContext from './tests/testContext';
import checkTypes from './tests/checkTypes';

const testCases: Array<[string, CreateTestComponents]> = [
  [
    '(using primary API)',
    p => {
      const {
        assets: {
          CanListenDependsOnAPI,
          CanUpdateDependsOnAPI,
          CanListenAndUpdateDependsOnAPI,
          useInterstate,
        },
      } = p;

      return {
        CanListen: CanListenDependsOnAPI((subscribeId, initialValue) => {
          const [useSubscribe] = useInterstate(subscribeId, initialValue);
          return useSubscribe();
        }),
        CanUpdate: CanUpdateDependsOnAPI((subscribeId, initialValue) => {
          const [, setState] = useInterstate(subscribeId, initialValue);
          return setState;
        }),
        CanListenAndUpdate: CanListenAndUpdateDependsOnAPI(
          (subscribeId, initialValue) => {
            const [useSubscribe, setState] = useInterstate(
              subscribeId,
              initialValue,
            );
            return [useSubscribe(), setState];
          },
        ),
      };
    },
  ],
  [
    '(using secondary API)',
    p => {
      const {
        assets: {
          CanListenDependsOnAPI,
          CanUpdateDependsOnAPI,
          CanListenAndUpdateDependsOnAPI,
          useSetInterstate,
          useSubscribeInterstate,
        },
      } = p;

      return {
        CanListen: CanListenDependsOnAPI((subscribeId, initialValue) => {
          return useSubscribeInterstate(subscribeId, initialValue);
        }),
        CanUpdate: CanUpdateDependsOnAPI((subscribeId, initialValue) => {
          return useSetInterstate(subscribeId, initialValue);
        }),
        CanListenAndUpdate: CanListenAndUpdateDependsOnAPI(
          (subscribeId, initialValue) => {
            return [
              useSubscribeInterstate(subscribeId, initialValue),
              useSetInterstate(subscribeId),
            ];
          },
        ),
      };
    },
  ],
];

const mainTestSuit = (packagePath: string) =>
  describe.each(testCases)(
    'Test useInterstate correctness %s',
    (name, createTestComponents) => {
      const testParameter: TestParameter = {} as TestParameter;

      beforeEach(() => {
        jest.isolateModules(() => {
          const {
            render,
            getLastMap,
            fireEvent,
            executionCountersFactory,
            CanListenDependsOnAPI,
            CanUpdateDependsOnAPI,
            CanListenAndUpdateDependsOnAPI,
          } = require('./testsAssets') as AssetsImport;
          const {
            useInterstate,
            useSubscribeInterstate,
            useSetInterstate,
            Scope,
          } = require(packagePath) as UseInterstateImport;

          testParameter.assets = {
            render,
            getLastMap,
            fireEvent,
            executionCountersFactory,
            CanListenDependsOnAPI,
            CanUpdateDependsOnAPI,
            CanListenAndUpdateDependsOnAPI,
            useInterstate,
            useSubscribeInterstate,
            useSetInterstate,
            Scope,
          };
        });
      });

      test(...siblingsCanCommunicate(testParameter, createTestComponents));
      test(...sophisticatedStructure(testParameter, createTestComponents));
      test(
        ...checkInitializationConcurrency(testParameter, createTestComponents),
      );
      test(
        ...valuesRemainAfterTreeUnmount(testParameter, createTestComponents),
      );
      test(
        ...rerenderWithInitValueResetState(testParameter, createTestComponents),
      );
      test(...dynamicSubscriptionWorks(testParameter, createTestComponents));
      test(...testContext(testParameter, createTestComponents));

      if (name === '(using primary API)') {
        test(...checkTypes(testParameter, createTestComponents));
      }
    },
  );

export default mainTestSuit;

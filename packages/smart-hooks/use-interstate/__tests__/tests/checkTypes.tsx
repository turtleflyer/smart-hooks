import React, { useEffect } from 'react';
import { TestDescription } from '../testsAssets';
import {
  StateKey,
  InterstateInitializeParam,
  InterstateParam,
} from '../../useInterstate';

const checkTypes: TestDescription = p => [
  'types are consistent',
  () => {
    const {
      assets: { render, useInterstate },
    } = p;

    const id0 = 0;
    const initValue0 = 'right';
    let testType0: string;
    const bindValue0_0 = 'left';
    const bindValue0_1 = (s: number | string) => s + '-up';
    const CheckTypesImplicitly0 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id0, initValue0);
      testType0 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue0_0);
        setInterstate(bindValue0_1);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly0 />);

    const id1 = 1;
    const initValue1 = () => (sn: string | number) =>
      sn === '' ? false : 'go';
    let testType1: (n: number, k: { a: boolean }) => boolean | string | number;
    const bindValue1 = () => (snb: string | number | boolean) =>
      snb === 0 ? false : 'go';
    const CheckTypesImplicitly1 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id1, initValue1);
      testType1 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue1);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly1 />);

    const id2: StateKey = Symbol();
    const initValue2: InterstateInitializeParam<string> = 'right';
    let testType2: string | boolean | number;
    const bindValue2_0: InterstateParam<string | boolean> = false;
    const bindValue2_1: InterstateParam<string | boolean> = (
      s: number | string | boolean
    ) => 'left';
    const CheckTypesExplicitly2 = () => {
      const [useSubscribe, setInterstate] = useInterstate<string | boolean>(
        id2,
        initValue2
      );
      testType2 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue2_0);
        setInterstate(bindValue2_1);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly2 />);

    const id3: StateKey = '3';
    const initValue3: InterstateInitializeParam<(
      p: string
    ) => boolean | string> = () => (sn: string | number) => sn === '';
    let testType3: (
      n: string,
      k: { a: boolean }
    ) => boolean | string | number | { b: symbol };
    const bindValue3: InterstateParam<(p: string) => boolean | string> = () => (
      snb: string
    ) => snb === '';
    const CheckTypesExplicitly3 = () => {
      const [useSubscribe, setInterstate] = useInterstate<
        (p: string) => boolean | string
      >(id3, initValue3);
      testType3 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue3);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly3 />);
  },
];

export default checkTypes;

import React, { useEffect } from 'react';
import type { InterstateInitializeParam, InterstateParam, StateKey } from '../../src/useInterstate';
import type { TestDescription } from '../testsAssets';

const checkTypes: TestDescription = (p) => [
  'types are consistent',
  () => {
    const {
      assets: { render, useInterstate },
    } = p;

    const id0 = 0;
    const initValue0 = 'right';
    let testType0: string;
    const bindValue0 = 'left';
    const CheckTypesImplicitly0 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id0, initValue0);
      testType0 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue0);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly0 />);

    const id1 = 1;
    const initValue1 = 'come';
    let testType1: string;
    const bindValue1 = (s: number | string) => s + 'on';
    const CheckTypesImplicitly1 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id1, initValue1);
      testType1 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue1);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly1 />);

    const id2 = 2;
    const initValue2 = () => (sn: string | number) => (sn === '' ? false : 'go');
    let testType2: (n: number, k: { a: boolean }) => boolean | string | number;
    const bindValue2 = () => (snb: string | number | boolean) => (snb === 0 ? false : 'go');
    const CheckTypesImplicitly2 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id2, initValue2);
      testType2 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue2);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly2 />);

    const id3: StateKey = Symbol();
    const initValue3: InterstateInitializeParam<string> = 'right';
    let testType3: string | boolean | number;
    const bindValue3: InterstateParam<string | boolean> = false;
    'left';
    const CheckTypesExplicitly3: React.FunctionComponent = () => {
      const [useSubscribe, setInterstate] = useInterstate<string | boolean>(id3, initValue3);
      testType3 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue3);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly3 />);

    const id4: StateKey = Symbol();
    const initValue4: InterstateInitializeParam<string> = 'right';
    let testType4: string | boolean | number;
    const bindValue4: InterstateParam<string | boolean> = (s: number | string | boolean) => 'left';
    const CheckTypesExplicitly4: React.FunctionComponent = () => {
      const [useSubscribe, setInterstate] = useInterstate<string | boolean>(id4, initValue4);
      testType4 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue4);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly4 />);

    const id5: StateKey = '5';
    const initValue5: InterstateInitializeParam<(p: string) => boolean | string> = () => (
      sn: string | number
    ) => sn === '';
    let testType5: (n: string, k: { a: boolean }) => boolean | string | number | { b: symbol };
    const bindValue5: InterstateParam<(p: string) => boolean | string> = () => (snb: string) =>
      snb === '';
    const CheckTypesExplicitly5: React.FunctionComponent = () => {
      const [useSubscribe, setInterstate] = useInterstate<(p: string) => boolean | string>(
        id5,
        initValue5
      );
      testType5 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue5);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly5 />);
  },
];

export default checkTypes;

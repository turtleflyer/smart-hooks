import React, { useEffect } from 'react';
import { TestDescription } from '../testsAssets';
import { StateKey, InitializeParam, InterstateParam } from '../../useInterstate';

const checkTypes: TestDescription = p => [
  'types are consistent',
  () => {
    const {
      assets: { render, useInterstate, useSetInterstate, useSubscribeInterstate },
    } = p;

    const id1 = 1;
    const initValue1 = 'right';
    let testType1: string;
    const bindValue11 = 'left';
    const bindValue12 = (s: number | string) => s + '-up';
    const CheckTypesImplicitly1 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id1, initValue1);
      testType1 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue11);
        setInterstate(bindValue12);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly1 />);

    const id2 = 2;
    const initValue2 = 'right';
    let testType2: string;
    const bindValue21 = 'left';
    const bindValue22 = (s: number | string) => s + '-up';
    const CheckTypesImplicitly2 = () => {
      const setInterstate = useSetInterstate(id2, initValue2);
      testType2 = useSubscribeInterstate(id2);
      useEffect(() => {
        setInterstate(bindValue21);
        setInterstate(bindValue22);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly2 />);

    const id3 = 3;
    const initValue3 = () => (sn: string | number) => (sn === '' ? false : 'go');
    let testType3: (n: number, k: { a: boolean }) => boolean | string | number;
    const bindValue3 = () => (snb: string | number | boolean) => snb === 0 && 'go';
    const CheckTypesImplicitly3 = () => {
      const [useSubscribe, setInterstate] = useInterstate(id3, initValue3);
      testType3 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue3);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly3 />);

    const id4 = 4;
    const initValue4 = () => (sn: string | number) => (sn === '' ? false : 'go');
    let testType4: (n: number, k: { a: boolean }) => boolean | string | number;
    const bindValue4 = () => (snb: string | number | boolean) => snb === 0 && 'go';
    const CheckTypesImplicitly4 = () => {
      const setInterstate = useSetInterstate(id4, initValue4);
      testType4 = useSubscribeInterstate(id4);
      useEffect(() => {
        setInterstate(bindValue4);
      }, []);

      return <> </>;
    };

    render(<CheckTypesImplicitly4 />);

    const id5: StateKey = Symbol();
    const initValue5: InitializeParam<string> = 'right';
    let testType5: string | boolean | number;
    const bindValue51: InterstateParam<string | boolean> = false;
    const bindValue52: InterstateParam<string | boolean> = (s: number | string | boolean) => 'left';
    const CheckTypesExplicitly5 = () => {
      const [useSubscribe, setInterstate] = useInterstate<string | boolean, number | symbol>(
        id5,
        initValue5,
      );
      testType5 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue51);
        setInterstate(bindValue52);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly5 />);

    const id6: StateKey = Symbol();
    const initValue6: InitializeParam<string> = 'right';
    let testType6: string | boolean | number;
    const bindValue61: InterstateParam<string | boolean> = false;
    const bindValue62: InterstateParam<string | boolean> = (s: number | string | boolean) => 'left';
    const CheckTypesExplicitly6 = () => {
      const setInterstate = useSetInterstate<string | boolean, number | symbol>(id6, initValue6);
      testType6 = useSubscribeInterstate<string | boolean, number | symbol>(id6);
      useEffect(() => {
        setInterstate(bindValue61);
        setInterstate(bindValue62);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly6 />);

    const id7: StateKey = '7';
    const initValue7: InitializeParam<(p: string) => boolean> = () => (sn: string | number) =>
      sn === '';
    let testType7: (n: string, k: { a: boolean }) => boolean | string | number | { b: symbol };
    const bindValue7: InterstateParam<(p: string) => boolean | string> = () => (snb: string) =>
      snb === '';
    const CheckTypesExplicitly7 = () => {
      const [useSubscribe, setInterstate] = useInterstate<(p: string) => boolean | string, string>(
        id7,
        initValue7,
      );
      testType7 = useSubscribe();
      useEffect(() => {
        setInterstate(bindValue7);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly7 />);

    const id8: StateKey = '8';
    const initValue8: InitializeParam<(p: string) => boolean> = () => (sn: string | number) =>
      sn === '';
    let testType8: (n: string, k: { a: boolean }) => boolean | string | number | { b: symbol };
    const bindValue8: InterstateParam<(p: string) => boolean | string> = () => (snb: string) =>
      snb === '';
    const CheckTypesExplicitly8 = () => {
      const setInterstate = useSetInterstate<(p: string) => boolean | string, string>(
        id8,
        initValue8,
      );
      testType8 = useSubscribeInterstate<(p: string) => boolean | string, string>(id8);
      useEffect(() => {
        setInterstate(bindValue8);
      }, []);

      return <> </>;
    };

    render(<CheckTypesExplicitly8 />);
  },
];

export default checkTypes;

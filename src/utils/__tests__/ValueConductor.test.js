/* eslint-env jest */

import { ValueConductor } from '../reactTestTools';

describe('Test ValueConductor', () => {
  let inst;

  beforeEach(() => {
    inst = new ValueConductor();
  });

  afterEach(() => {
    inst = null;
  });

  test('is instance of ValueConductor', () => {
    expect(inst).toBeInstanceOf(ValueConductor);
  });

  test('has Function.prototype methods', () => {
    expect(typeof inst).toBe('function');
    expect(typeof inst.apply).toBe('function');
  });

  test('can conduct value', () => {
    let receive = false;
    inst.attach((v) => {
      receive = v;
    });
    inst(true);
    expect(receive).toBeTruthy();

    inst(false);
    expect(receive).toBeFalsy();
  });

  test('can conduct ref', () => {
    const receive = { current: true };
    inst.attach(receive);
    expect(inst()).toBeTruthy();

    receive.current = false;
    expect(inst()).toBeFalsy();
  });

  test('invalid receiptor attached', () => {
    inst.attach({});
    expect(inst).toThrow('Unknown receiptor attached');
    expect(() => {
      inst(null);
    }).toThrow('Unknown receiptor attached');
  });
});

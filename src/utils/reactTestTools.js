/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */

import { useState, useRef } from 'react';

function ValueConductor() {
  this.resetCounter();

  const conductor = new Proxy(() => null, {
    apply: (...args) => {
      const [, , [arg]] = args;
      if (typeof this._receiptor === 'function') {
        this._receiptor(arg);
        return undefined;
      }

      // eslint-disable-next-line no-prototype-builtins
      if (typeof this._receiptor !== 'undefined' && this._receiptor.hasOwnProperty('current')) {
        return this._receiptor.current;
      }

      if (typeof this._counter === 'number' && this._counter >= 0) {
        return this._counter;
      }

      throw new Error('Invalid type of counter');
    },

    set: (_, prop, value) => {
      this[prop] = value;
      return true;
    },

    get: (_, prop) => this[prop],
  });

  Object.setPrototypeOf(conductor, Object.getPrototypeOf(this));

  return conductor;
}

Object.setPrototypeOf(ValueConductor.prototype, Function.prototype);

Object.assign(ValueConductor.prototype, {
  attach(setState) {
    this._receiptor = setState;
    return this;
  },

  resetCounter() {
    this._counter = 0;
    return this;
  },

  addCount() {
    if (typeof this._counter === 'number' && this._counter >= 0) {
      this._counter++;
      return this;
    }

    throw new Error('Invalid type of counter');
  },
});

/**
 * Hook providing direct mutation of the state inside React
 * component.
 *
 * @param  {ValueConductor} conductor
 * @param  {*} initialValue
 * @return {*}
 */
const useStateReceiptor = (conductor, initialValue) => {
  const [state, setState] = useState(initialValue);
  if (conductor instanceof ValueConductor) {
    conductor.attach(setState);
    return state;
  }

  throw new TypeError('Invalid type of argument passed to useReceiptor');
};

const useConductRef = (conductor) => {
  const ref = useRef();
  if (conductor instanceof ValueConductor) {
    conductor.attach(ref);
    return ref;
  }

  throw new TypeError('Invalid type of argument passed to useReceiptor');
};

export { ValueConductor, useStateReceiptor, useConductRef };

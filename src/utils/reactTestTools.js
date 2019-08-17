/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */

import { useState, useRef } from 'react';

function ValueConductor() {
  this._receiptor = function defHandler() {
    throw new Error('No receiptor attached');
  };

  const conductor = new Proxy(() => null, {
    // eslint-disable-next-line consistent-return
    apply: (_, __, [arg]) => {
      if (typeof this._receiptor === 'function') {
        this._receiptor(arg);
        return undefined;
      }

      // eslint-disable-next-line no-prototype-builtins
      if (this._receiptor.hasOwnProperty('current')) {
        return this._receiptor.current;
      }

      throw new Error('Unknown receiptor attached');
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

ValueConductor.prototype.attach = function attach(setState) {
  this._receiptor = setState;
};

/**
 * Hook providing direct mutation of the state inside React
 * component.
 *
 * @param  {ValueConductor} conductor
 * @param  {*} initialValue
 * @return {*}
 */
const useReceiptor = (conductor, initialValue) => {
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

export { ValueConductor, useReceiptor, useConductRef };

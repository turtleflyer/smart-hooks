/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import React, { useRef } from 'react';
import { PropTypes } from 'prop-types';
import { render } from '@testing-library/react';

const TestRef = ({ scenario, reference, str }) => (scenario === 1 ? (
  <div key="1" data-key="1" ref={reference}>{`${str}-first`}</div>
) : (
  <div key="2" data-key="2" ref={reference}>{`${str}-second`}</div>
));

TestRef.propTypes = {
  scenario: PropTypes.oneOf([1, 2]).isRequired,
  reference: PropTypes.func.isRequired,
  str: PropTypes.string.isRequired,
};

describe('Test useSmartRef functionality', () => {
  let useSmartRef;
  let Counter;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ useSmartRef } = require('../useSmartRef'));
      ({ Counter } = require('./prerequisite'));
    });
  });

  test('ref binding and update work', () => {
    const mainCounter = new Counter();
    const actionsStoreFakes = [...Array(5)].map(() => ({}));
    const actionsCounters = [...Array(5)].map(() => new Counter());
    const getActionsHandler = i => (fake1, fake2) => {
      actionsCounters[i].count();
      Object.assign(actionsStoreFakes[i], { fake1, fake2 });
    };
    const cleanersStoreFakes = [...Array(5)].map(() => ({}));
    const cleanersCounters = [...Array(5)].map(() => new Counter());
    const getCleanersHandler = i => (fake1, fake2) => {
      cleanersCounters[i].count();
      Object.assign(cleanersStoreFakes[i], { fake1, fake2 });
    };
    const elements = [];

    const TestComponent = ({ scenario, fake1, fake2 }) => {
      mainCounter.count();

      const ref0 = useSmartRef((e) => {
        getActionsHandler(0)(fake1, fake2);
        elements[0] = e.getAttribute('data-key');
        return () => {
          getCleanersHandler(0)(fake1, fake2);
        };
      });

      const ref1 = useSmartRef((e) => {
        getActionsHandler(1)(fake1, fake2);
        elements[1] = e.getAttribute('data-key');
        return () => {
          getCleanersHandler(1)(fake1, fake2);
        };
      }, []);

      const ref2 = useSmartRef(
        (e) => {
          getActionsHandler(2)(fake1, fake2);
          elements[2] = e.getAttribute('data-key');
          return () => {
            getCleanersHandler(2)(fake1, fake2);
          };
        },
        [fake1],
      );

      const ref3 = useSmartRef(
        (e) => {
          getActionsHandler(3)(fake1, fake2);
          elements[3] = e.getAttribute('data-key');
          return () => {
            getCleanersHandler(3)(fake1, fake2);
          };
        },
        [fake2],
      );

      const ref4 = useSmartRef(
        (e) => {
          getActionsHandler(4)(fake1, fake2);
          elements[4] = e.getAttribute('data-key');
          return () => {
            getCleanersHandler(4)(fake1, fake2);
          };
        },
        [fake1, fake2],
      );

      return (
        <>
          <TestRef {...{ scenario: scenario[0], reference: ref0, str: 'Ref0' }} />
          <TestRef {...{ scenario: scenario[1], reference: ref1, str: 'Ref1' }} />
          <TestRef {...{ scenario: scenario[2], reference: ref2, str: 'Ref2' }} />
          <TestRef {...{ scenario: scenario[3], reference: ref3, str: 'Ref3' }} />
          <TestRef {...{ scenario: scenario[4], reference: ref4, str: 'Ref4' }} />
        </>
      );
    };

    TestComponent.propTypes = {
      scenario: PropTypes.arrayOf(PropTypes.oneOf([1, 2])).isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      fake1: PropTypes.any,
      // eslint-disable-next-line react/forbid-prop-types
      fake2: PropTypes.any,
    };

    TestComponent.defaultProps = {
      fake1: undefined,
      fake2: undefined,
    };

    const { rerender, unmount } = render(
      <TestComponent scenario={[1, 1, 1, 1, 1]} fake1="red" fake2="green" />,
    );
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionsCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([1, 1, 1, 1, 1]);
    actionsStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'red', fake2: 'green' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'red', fake2: 'green' },
        { i: 3, fake1: 'red', fake2: 'green' },
        { i: 4, fake1: 'red', fake2: 'green' },
      ],
    );
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([0, 0, 0, 0, 0]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }],
    );
    expect(elements).toEqual(['1', '1', '1', '1', '1']);

    rerender(<TestComponent scenario={[1, 1, 1, 1, 1]} fake1="yellow" fake2="brown" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(actionsCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([1, 1, 1, 1, 1]);
    actionsStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'red', fake2: 'green' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'red', fake2: 'green' },
        { i: 3, fake1: 'red', fake2: 'green' },
        { i: 4, fake1: 'red', fake2: 'green' },
      ],
    );
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([0, 0, 0, 0, 0]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }],
    );
    expect(elements).toEqual(['1', '1', '1', '1', '1']);

    rerender(<TestComponent scenario={[2, 2, 2, 2, 2]} fake1="magenta" fake2="cyan" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(actionsCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([2, 2, 2, 2, 2]);
    actionsStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'magenta', fake2: 'cyan' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'magenta', fake2: 'cyan' },
        { i: 3, fake1: 'magenta', fake2: 'cyan' },
        { i: 4, fake1: 'magenta', fake2: 'cyan' },
      ],
    );
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([1, 1, 1, 1, 1]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'red', fake2: 'green' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'red', fake2: 'green' },
        { i: 3, fake1: 'red', fake2: 'green' },
        { i: 4, fake1: 'red', fake2: 'green' },
      ],
    );
    expect(elements).toEqual(['2', '2', '2', '2', '2']);

    rerender(<TestComponent scenario={[1, 1, 1, 1, 1]} fake1="pink" fake2="cyan" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(4);
    expect(actionsCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([3, 3, 3, 3, 3]);
    actionsStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'pink', fake2: 'cyan' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'pink', fake2: 'cyan' },
        { i: 3, fake1: 'magenta', fake2: 'cyan' },
        { i: 4, fake1: 'pink', fake2: 'cyan' },
      ],
    );
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([2, 2, 2, 2, 2]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'magenta', fake2: 'cyan' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'magenta', fake2: 'cyan' },
        { i: 3, fake1: 'magenta', fake2: 'cyan' },
        { i: 4, fake1: 'magenta', fake2: 'cyan' },
      ],
    );
    expect(elements).toEqual(['1', '1', '1', '1', '1']);

    rerender(<TestComponent scenario={[2, 2, 2, 2, 2]} fake1="pink" fake2="blue" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(5);
    expect(actionsCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([4, 4, 4, 4, 4]);
    actionsStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'pink', fake2: 'blue' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'pink', fake2: 'cyan' },
        { i: 3, fake1: 'pink', fake2: 'blue' },
        { i: 4, fake1: 'pink', fake2: 'blue' },
      ],
    );
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([3, 3, 3, 3, 3]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'pink', fake2: 'cyan' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'pink', fake2: 'cyan' },
        { i: 3, fake1: 'magenta', fake2: 'cyan' },
        { i: 4, fake1: 'pink', fake2: 'cyan' },
      ],
    );
    expect(elements).toEqual(['2', '2', '2', '2', '2']);

    rerender(<TestComponent scenario={[1, 1, 1, 2, 2]} fake1="pink" fake2="grey" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(6);
    expect(actionsCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([5, 5, 5, 4, 4]);
    actionsStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'pink', fake2: 'grey' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'pink', fake2: 'cyan' },
        { i: 3, fake1: 'pink', fake2: 'blue' },
        { i: 4, fake1: 'pink', fake2: 'blue' },
      ],
    );
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([4, 4, 4, 3, 3]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'pink', fake2: 'blue' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'pink', fake2: 'cyan' },
        { i: 3, fake1: 'magenta', fake2: 'cyan' },
        { i: 4, fake1: 'pink', fake2: 'cyan' },
      ],
    );
    expect(elements).toEqual(['1', '1', '1', '2', '2']);

    unmount();
    expect(cleanersCounters.map(c => c.toHaveBeenCalledTimes)).toEqual([5, 5, 5, 4, 4]);
    cleanersStoreFakes.reduce(
      (model, fake, i) => {
        expect({ i, ...fake }).toEqual(model[i]);
        return model;
      },
      [
        { i: 0, fake1: 'pink', fake2: 'grey' },
        { i: 1, fake1: 'red', fake2: 'green' },
        { i: 2, fake1: 'pink', fake2: 'cyan' },
        { i: 3, fake1: 'pink', fake2: 'blue' },
        { i: 4, fake1: 'pink', fake2: 'blue' },
      ],
    );
  });

  test('different schemes of passed arguments work', () => {
    const mainCounter = new Counter();
    const counters = [...Array(6)].map(() => new Counter());
    const storeFakes = [];
    const getHandler = i => (fake) => {
      counters[i].count();
      storeFakes[i] = fake;
    };
    const elements = [];
    const elementsRefs = {};

    const TestComponent = ({ scenario, fake, writeRefs }) => {
      mainCounter.count();

      const elementRef1 = useRef();
      const elementRef3 = useRef();
      const elementRef5 = useRef();

      const ref0 = useSmartRef((e) => {
        getHandler(0)(fake);
        elements[0] = e.getAttribute('data-key');
      });

      const ref1 = useSmartRef((e) => {
        getHandler(1)(fake);
        elements[1] = e.getAttribute('data-key');
      }, elementRef1);

      const ref2 = useSmartRef((e) => {
        getHandler(2)(fake);
        elements[2] = e.getAttribute('data-key');
      }, []);

      const ref3 = useSmartRef(
        (e) => {
          getHandler(3)(fake);
          elements[3] = e.getAttribute('data-key');
        },
        elementRef3,
        [],
      );

      const ref4 = useSmartRef(
        (e) => {
          getHandler(4)(fake);
          elements[4] = e.getAttribute('data-key');
        },
        [fake],
      );

      const ref5 = useSmartRef(
        (e) => {
          getHandler(5)(fake);
          elements[5] = e.getAttribute('data-key');
        },
        elementRef5,
        [fake],
      );

      if (writeRefs) {
        Object.assign(elementsRefs, {
          elementRef1: elementRef1.current.getAttribute('data-key'),
          elementRef3: elementRef3.current.getAttribute('data-key'),
          elementRef5: elementRef5.current.getAttribute('data-key'),
        });
      }

      return (
        <>
          <TestRef {...{ scenario, reference: ref0, str: 'Ref0' }} />
          <TestRef {...{ scenario, reference: ref1, str: 'Ref0' }} />
          <TestRef {...{ scenario, reference: ref2, str: 'Ref0' }} />
          <TestRef {...{ scenario, reference: ref3, str: 'Ref0' }} />
          <TestRef {...{ scenario, reference: ref4, str: 'Ref0' }} />
          <TestRef {...{ scenario, reference: ref5, str: 'Ref0' }} />
        </>
      );
    };

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      fake: PropTypes.any,
      writeRefs: PropTypes.bool,
    };

    TestComponent.defaultProps = {
      fake: undefined,
      writeRefs: false,
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="Texas" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(counters.map(c => c.toHaveBeenCalledTimes)).toEqual([1, 1, 1, 1, 1, 1]);
    expect(storeFakes).toEqual(['Texas', 'Texas', 'Texas', 'Texas', 'Texas', 'Texas']);
    expect(elements).toEqual(['1', '1', '1', '1', '1', '1']);

    rerender(<TestComponent scenario={1} fake="Texas" writeRefs />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(counters.map(c => c.toHaveBeenCalledTimes)).toEqual([1, 1, 1, 1, 1, 1]);
    expect(storeFakes).toEqual(['Texas', 'Texas', 'Texas', 'Texas', 'Texas', 'Texas']);
    expect(elements).toEqual(['1', '1', '1', '1', '1', '1']);
    expect(elementsRefs).toEqual({ elementRef1: '1', elementRef3: '1', elementRef5: '1' });

    rerender(<TestComponent scenario={2} fake="Montana" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(counters.map(c => c.toHaveBeenCalledTimes)).toEqual([2, 2, 2, 2, 2, 2]);
    expect(storeFakes).toEqual(['Montana', 'Montana', 'Texas', 'Texas', 'Montana', 'Montana']);
    expect(elements).toEqual(['2', '2', '2', '2', '2', '2']);

    rerender(<TestComponent scenario={2} fake="Montana" writeRefs />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(4);
    expect(counters.map(c => c.toHaveBeenCalledTimes)).toEqual([2, 2, 2, 2, 2, 2]);
    expect(storeFakes).toEqual(['Montana', 'Montana', 'Texas', 'Texas', 'Montana', 'Montana']);
    expect(elements).toEqual(['2', '2', '2', '2', '2', '2']);
    expect(elementsRefs).toEqual({ elementRef1: '2', elementRef3: '2', elementRef5: '2' });

    unmount();
  });
});

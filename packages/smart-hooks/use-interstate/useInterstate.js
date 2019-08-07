/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useEffect, useState } from 'react';

const getFromStore = (() => {
  const map = new Map();

  return id => {
    let getTry = map.get(id);
    if (getTry === undefined) {
      getTry = { setters: [] };
      map.set(id, getTry);
    }

    return getTry;
  };
})();

const useSubscribe = entry => {
  const set = useState(true)[1];

  useMemo(() => {
    entry.setters.push(set);
  }, [entry]);

  useEffect(
    () => () => {
      entry.setters.splice(entry.setters.indexOf(set), 1);
    },
    [entry],
  );

  return entry.value;
};

const useInterstate = (id, initialValue, alternative) => {
  const entry = useMemo(() => getFromStore(id), [id]);

  const setInterstate = useCallback(
    newValue => {
      const actualValue = typeof newValue === 'function' ? newValue(entry.value) : newValue;

      if (entry.value !== actualValue) {
        entry.value = actualValue;
        entry.setters.forEach(callback => {
          callback(v => !v);
        });
      }
    },
    [entry],
  );

  useMemo(() => {
    if (initialValue !== undefined) {
      setInterstate(initialValue);
    }
  }, [id]);

  const determineAlternative = useMemo(() => alternative, []);

  switch (determineAlternative) {
    case undefined:
      const useSubscribeInterstate = useCallback(() => useSubscribe(entry), [entry]);
      return useMemo(() => ({ useSubscribeInterstate, setInterstate }), [entry]);

    case true:
      return [useSubscribe(entry), setInterstate];

    case false:
      return setInterstate;

    default:
      throw new TypeError('The third argument of useInterstate should be "true" or "false"');
  }
};

export default useInterstate;

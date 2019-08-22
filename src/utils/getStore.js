const getStore = () => {
  const storeStructure = { map: new Map() };

  // prettier-ignore
  const get = id => (
    storeStructure.map.get(id) !== undefined || storeStructure.map.set(id, { setters: [] })
  )
    && storeStructure.map.get(id);

  const set = (id, v) => storeStructure.map.set(id, v);

  const incCounter = (id) => {
    const entry = get(id);
    set(id, { ...entry, counter: (entry.counter || 0) + 1 });
  };

  const decCounter = (id) => {
    const entry = get(id);
    const nextCounter = entry.counter - 1;
    if (nextCounter > 0) {
      set(id, { ...entry, counter: nextCounter });
    } else {
      storeStructure.map.clear(id);
    }
  };

  // eslint-disable-next-line no-underscore-dangle
  const _getMapsForTesting = () => storeStructure;

  return {
    get,
    set,
    incCounter,
    decCounter,
    _getMapsForTesting,
  };
};

export default getStore;

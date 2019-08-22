const getStore = () => {
  const storeStructure = { map: new Map() };

  // prettier-ignore
  const get = id => (
    storeStructure.map.get(id) !== undefined || storeStructure.map.set(id, { setters: [] })
  )
    && storeStructure.map.get(id);
  const set = (id, value) => storeStructure.map.set(id, value);

  // eslint-disable-next-line no-underscore-dangle
  const _getMapsForTesting = () => storeStructure;

  return {
    get,
    set,
    _getMapsForTesting,
  };
};

export default getStore;

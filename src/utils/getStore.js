const getStore = (() => {
  const defaultMap = new Map();
  return (getNew) => {
    const map = getNew ? new Map() : defaultMap;

    const get = id => (map.get(id) !== undefined || map.set(id, { setters: [] })) && map.get(id);
    const set = (id, value) => map.set(id, value);

    // eslint-disable-next-line no-underscore-dangle
    const _getMapForTesting = () => ({ map });

    return {
      get,
      set,
      _getMapForTesting,
    };
  };
})();

export default getStore;

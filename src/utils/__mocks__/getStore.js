/* eslint-env jest */

const getStore = jest.requireActual('../getStore.js').default;

const { bypassGetStore, getLastMaps } = (() => {
  let lastStore;
  return {
    bypassGetStore(...arg) {
      const store = getStore(...arg);
      // eslint-disable-next-line no-underscore-dangle
      lastStore = store._getMapsForTesting();
      return store;
    },

    getLastMaps() {
      return lastStore;
    },
  };
})();

export default bypassGetStore;

export { getLastMaps };

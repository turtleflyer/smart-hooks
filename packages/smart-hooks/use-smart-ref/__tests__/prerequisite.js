/* eslint-disable import/prefer-default-export */
function Counter() {
  this.reset();
}

Object.assign(Counter.prototype, {
  count() {
    this.toHaveBeenCalledTimes++;
  },

  reset() {
    this.toHaveBeenCalledTimes = 0;
  },
});

export { Counter };

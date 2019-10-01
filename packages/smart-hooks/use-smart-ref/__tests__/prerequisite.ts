class Counter {

  toHaveBeenCalledTimes: number = 0;

  count() {
    this.toHaveBeenCalledTimes++;
  }

  reset() {
    this.toHaveBeenCalledTimes = 0;
  }
}

export { Counter };

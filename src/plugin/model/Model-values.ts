class ModelValues {
  constructor(private value: number = 0) {}

  public getValue(): number {
    return this.value;
  }

  public setValue({value = 1, min = 0, max = 1} = {}): void {
    if (value > max) {
      this.value = max;
    } else if (value < min) {
      this.value = min;
    } else {
      this.value = value;
    }
  }

  public increaseValue({max = 1, step = 1, counter = 1} = {}): void {
    const count: number = this.value  + step * counter;

    if (count > max) {
      this.value = max;
    } else {
      this.value = count;
    }
  }

  public reduceValue({min = 0, step = 1, counter = 1} = {}): void {
    const count = this.value - step * counter;

    if (count < min) {
      this.value = min;
    } else {
      this.value = count;
    }
  }
}

export { ModelValues };

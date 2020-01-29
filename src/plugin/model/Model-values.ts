class ModelValues {
  constructor(private value: number = 0) {}

  public getValue(): number {
    return this.value;
  }

  public setValue(obj: {value: number, min: number, max: number}): void {
    if (obj.value > obj.max) {
      this.value = obj.max;
    } else if (obj.value < obj.min) {
      this.value = obj.min;
    } else {
      this.value = obj.value;
    }
  }

  public increaseValue(obj: {max: number, step: number, counter: number}): void {
    const count: number = this.value  + obj.step * obj.counter;

    if (count > obj.max) {
      this.value = obj.max;
    } else {
      this.value = count;
    }
  }

  public reduceValue(obj: {min: number, step: number, counter: number}): void {
    const count = this.value - obj.step * obj.counter;

    if (count < obj.min) {
      this.value = obj.min;
    } else {
      this.value = count;
    }
  }
}

export { ModelValues };

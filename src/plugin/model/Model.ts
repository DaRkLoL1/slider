import { Observer } from '../observer/Observer';
import { ModelHandle } from './ModelHandle';

class Model extends Observer {
  private min: number;
  private max: number;
  private possibleValues: number[] = [];
  private step: number;
  private handle: ModelHandle[] = [];

  constructor(options: {min: number, max: number, range: boolean, step: number, value: number[]}) {
    super();
    if (Number.isNaN(options.min)) {
      options.min = 0;
    }
    if (Number.isNaN(options.max)) {
      options.max = 0;
    }
    if (Number.isNaN(options.step) || options.step <= 0) {
      options.step = 1;
    }
    if (options.max <= options.min + options.step) {
      options.max = options.min + options.step;
    }

    this.min = options.min;
    this.max = options.max;
    this.step = options.step;

    for (let index: number = this.min; index <= this.max; index += this.step) {
      this.possibleValues.push(index);
    }

    if (options.range) {
      for (let i = 0; i < 2; i += 1) {
        this.handle.push(new ModelHandle());
      }
    } else {
      this.handle.push(new ModelHandle());
    }
    this.checkValue(options.value);
  }

  public getMin(): number {
    return this.min;
  }

  public getMax(): number {
    return this.max;
  }

  public getStep(): number {
    return this.step;
  }

  public getValue(): number[] {
    const values: number[] = [];
    this.handle.forEach((val) => {
      values.push(val.getValue());
    });

    return values;
  }

  public checkValue(value: number[]): void {
    value.forEach((val, i) => {
      if (Number.isNaN(val)) {
        value[i] = this.min;
      }
    });

    value.forEach((val: number, index: number) => {
      for (let i: number = val; i >= this.min; i -= 1) {
          if (this.possibleValues.some((val) => {
            return val === i;
          })) {
          value[index] = i;
          break;
        }
      }
    });

    if (this.handle.length > 1) {
      if (value[0] <= this.min) {
        value[0] = this.min;
      } else if (value[0] >= this.possibleValues[this.possibleValues.length - 1]) {
        value[0] = this.possibleValues[this.possibleValues.length - 1] - this.step;
      }
      if (value[1] <= value[0] + this.step) {
        value[1] = value[0] + this.step;
      } else if (value[1] >= this.possibleValues[this.possibleValues.length - 1]) {
        value[1] = this.possibleValues[this.possibleValues.length - 1];
      }
      this.handle[0].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: value[0],
      });
      this.handle[1].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: value[1],
      });
    } else {
      this.handle[0].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: value[0],
      });
    }
  }

  public setValue(value: number[]): void {
    value.forEach((val, i) => {
      if (Number.isNaN(val)) {
        value[i] = this.min;
      }
    });

    value.forEach((val: number, index: number) => {
      for (let i: number = val; i >= this.min; i -= 1) {
          if (this.possibleValues.some((val) => {
            return val === i;
          })) {
          value[index] = i;
          break;
        }
      }
    });

    if (this.handle.length > 1) {
      if (value[0] <= this.min) {
        value[0] = this.min;
      } else if (value[0] >= this.possibleValues[this.possibleValues.length - 1]) {
        value[0] = this.possibleValues[this.possibleValues.length - 1] - this.step;
      }
      if (value[1] <= value[0] + this.step) {
        value[1] = value[0] + this.step;
      } else if (value[1] >= this.possibleValues[this.possibleValues.length - 1]) {
        value[1] = this.possibleValues[this.possibleValues.length - 1];
      }
      this.handle[0].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: value[0],
      });
      this.handle[1].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: value[1],
      });
    } else {
      this.handle[0].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: value[0],
      });
    }

    this.notifySubscribers('changeModel', {
      max: this.getMax(),
      min : this.getMin(),
      step: this.getStep(),
      value: this.getValue(),
    });
  }

  public increaseValue(i: number, counter: number): void {

    if (this.handle.length > 1) {
      const rightHandle: ModelHandle | undefined = this.handle[i + 1];

      if (!rightHandle) {
        this.handle[i].increaseValue({
          counter,
          max: this.possibleValues[this.possibleValues.length - 1],
          step: this.step,
        });
      } else {
        this.handle[i].increaseValue({
          counter,
          max: rightHandle.getValue() - this.step,
          step: this.step,
        });
      }
    } else {
      this.handle[i].increaseValue({
        counter,
        max: this.possibleValues[this.possibleValues.length - 1],
        step: this.step,
      });
    }

    this.notifySubscribers('changeModel', {
      max: this.getMax(),
      min : this.getMin(),
      step: this.getStep(),
      value: this.getValue(),
    });
  }

  public reduceValue(i: number, counter: number): void {
    if (i === 0) {
      this.handle[i].reduceValue({min: this.min, step: this.step, counter});
    } else {
      const leftHandle: ModelHandle = this.handle[i - 1];
      this.handle[i].reduceValue({min: leftHandle.getValue() + this.step, step: this.step, counter});
    }

    this.notifySubscribers('changeModel', {
      max: this.getMax(),
      min : this.getMin(),
      step: this.getStep(),
      value: this.getValue(),
    });
  }

  public updateValue(options: {symbol: string, counter: number, index: number}): void {
      if (options.symbol === '+') {
        this.increaseValue(options.index, options.counter);
      } else if (options.symbol === '-') {
        this.reduceValue(options.index, options.counter);
      }
  }
}

export { Model };

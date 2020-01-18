import { Observer } from '../observer/Observer';
import { ModelValues } from './ModelValues';

class Model extends Observer {
  private min: number;
  private max: number;
  private possibleValues: number[] = [];
  private step: number;
  private handle: ModelValues[] = [];

  constructor(options: {min: number, max: number, range: boolean, step: number, values: number[]}) {
    super();
    this.checkMinMaxStep(options);
    this.min = options.min;
    this.max = options.max;
    this.step = options.step;

    for (let index: number = this.min; index <= this.max; index += this.step) {
      this.possibleValues.push(index);
    }

    this.createModelValues(options.range);
    this.checkValue(options.values);
  }

  public checkMinMaxStep(options: {min: number, max: number, step: number}): void {
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
  }

  public createModelValues(range: boolean): void {
    if (range) {
      for (let i = 0; i < 2; i += 1) {
        this.handle.push(new ModelValues());
      }
    } else {
      this.handle.push(new ModelValues());
    }
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
    this.handle.forEach((item) => {
      values.push(item.getValue());
    });

    return values;
  }

  public checkValue(values: number[]): void {
    this.checkValueOnNaN(values);
    this.checkValueOnPossibleValues(values);
    this.checkValueOnBoundaryValues(values);
  }

  public checkValueOnBoundaryValues(values: number[]): void {
    if (this.handle.length > 1) {
      if (values[0] <= this.min) {
        values[0] = this.min;
      } else if (values[0] >= this.possibleValues[this.possibleValues.length - 1]) {
        values[0] = this.possibleValues[this.possibleValues.length - 1] - this.step;
      }
      if (values[1] <= values[0] + this.step) {
        values[1] = values[0] + this.step;
      } else if (values[1] >= this.possibleValues[this.possibleValues.length - 1]) {
        values[1] = this.possibleValues[this.possibleValues.length - 1];
      }
      this.handle[0].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: values[0],
      });
      this.handle[1].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: values[1],
      });
    } else {
      this.handle[0].setValue({
        max : this.possibleValues[this.possibleValues.length - 1],
        min: this.min,
        value: values[0],
      });
    }
  }

  public checkValueOnPossibleValues(values: number[]): void {
    values.forEach((value: number, index: number) => {
      for (let count: number = value; count >= this.min; count -= 1) {
          if (this.possibleValues.some((item) => {
            return item === count;
          })) {
          values[index] = count;
          break;
        }
      }
    });
  }

  public checkValueOnNaN(values: number[]): void {
    values.forEach((value, index) => {
      if (Number.isNaN(value)) {
        values[index] = this.min;
      }
    });
  }

  public setValue(values: number[]): void {
    this.checkValue(values);
    this.handleModelChangeModel();
  }

  public increaseValue(index: number, counter: number): void {
    if (this.handle.length > 1) {
      const rightHandle: ModelValues | undefined = this.handle[index + 1];

      if (!rightHandle) {
        this.handle[index].increaseValue({
          counter,
          max: this.possibleValues[this.possibleValues.length - 1],
          step: this.step,
        });
      } else {
        this.handle[index].increaseValue({
          counter,
          max: rightHandle.getValue() - this.step,
          step: this.step,
        });
      }
    } else {
      this.handle[index].increaseValue({
        counter,
        max: this.possibleValues[this.possibleValues.length - 1],
        step: this.step,
      });
    }

    this.handleModelChangeModel();
  }

  public reduceValue(index: number, counter: number): void {
    if (index === 0) {
      this.handle[index].reduceValue({min: this.min, step: this.step, counter});
    } else {
      const leftHandle: ModelValues = this.handle[index - 1];
      this.handle[index].reduceValue({min: leftHandle.getValue() + this.step, step: this.step, counter});
    }

    this.handleModelChangeModel();
  }

  public updateValue(options: {symbolMinusOrPlus: string, counter: number, index: number}): void {
      if (options.symbolMinusOrPlus === '+') {
        this.increaseValue(options.index, options.counter);
      } else if (options.symbolMinusOrPlus === '-') {
        this.reduceValue(options.index, options.counter);
      }
  }

  public handleModelChangeModel(): void {
    this.notifySubscribers('changeModel', {
      max: this.getMax(),
      min : this.getMin(),
      step: this.getStep(),
      values: this.getValue(),
    });
  }
}

export { Model };

import autobind from 'autobind-decorator';
import { Observer } from '../observer/Observer';

@autobind
class Model extends Observer {
  private min: number;
  private max: number;
  private maxValue: number;
  private step: number;
  private values: number[] = [];

  constructor(options: {min: number, max: number, range: boolean, step: number, values: number[]}) {
    super();
    this.checkMinMaxStep(options);
    this.min = options.min;
    this.max = options.max;
    this.step = options.step;
    this.maxValue = this.addMaxValue();
    this.createModelValues(options.range, options.values);
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

  public addMaxValue() {
    let count = this.max;
    if ((count - this.min) % this.step !== 0) {
      count -= (count - this.min) % this.step;
    }
    return count;
  }

  public createModelValues(range: boolean, values: number[]): void {
    if (range) {
      for (let i = 0; i < 2; i += 1) {
        this.values.push(0);
      }
    } else {
      this.values.push(0);
    }

    this.checkValue(values);
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
    return this.values;
  }

  public checkValue(values: number[]): void {
    this.checkValueOnNaN(values);
    this.checkValueOnPossibleValues(values);
    this.checkValueOnBoundaryValues(values);
  }

  public checkValueOnBoundaryValues(values: number[]): void {
    if (this.values.length > 1) {
      if (values[0] <= this.min) {
        values[0] = this.min;
      } else if (values[0] >= this.maxValue) {
        values[0] = this.maxValue - this.step;
      }

      if (values[1] <= values[0] + this.step) {
        values[1] = values[0] + this.step;
      } else if (values[1] >= this.maxValue) {
        values[1] = this.maxValue;
      }

      this.values[0] = values[0];
      this.values[1] = values[1];
    } else {
      if (values[0] <= this.min) {
        values[0] = this.min;
      } else if (values[0] >= this.maxValue) {
        values[0] = this.maxValue;
      }

      this.values[0] = values[0];
    }
  }

  public checkValueOnPossibleValues(values: number[]): void {
    values.forEach((value: number, index: number) => {
      if ((value - this.min) % this.step !== 0) {
        value -= (value - this.min) % this.step;
        values[index] = value;
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
    const count: number = this.values[index]  + this.step * counter;

    if (this.values.length > 1) {
      const rightValue: number | undefined = this.values[index + 1];
      if (!rightValue) {
        if (count > this.maxValue) {
          this.values[index] = this.maxValue;
        } else {
          this.values[index] = count;
        }
      } else {
        if (count > (rightValue - this.step)) {
        this.values[index] = rightValue - this.step;
        } else {
        this.values[index] = count;
        }
      }
    } else {
      if (count > this.maxValue) {
        this.values[index] = this.maxValue;
      } else {
        this.values[index] = count;
      }
    }

    this.handleModelChangeModel();
  }

  public reduceValue(index: number, counter: number): void {
    const count = this.values[index] - this.step * counter;

    if (index === 0) {
      if (count < this.min) {
        this.values[index] = this.min;
      } else {
        this.values[index] = count;
      }
    } else {
      const leftValue: number = this.values[index - 1];
      if (count < (leftValue + this.step)) {
        this.values[index] = leftValue + this.step;
      } else {
        this.values[index] = count;
      }
    }

    this.handleModelChangeModel();
  }

  public updateValue({symbolMinusOrPlus =  '+', counter = 1, index = 0} = {}): void {
      if (symbolMinusOrPlus === '+') {
        this.increaseValue(index, counter);
      } else if (symbolMinusOrPlus === '-') {
        this.reduceValue(index, counter);
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

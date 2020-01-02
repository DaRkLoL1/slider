import {ModelHandle} from './ModelHandle';

interface ISubjectModelControler {
  addObserverModelControler(o: IObserverModelControler): void;
  notifyObserverModelControler(): void;
}

interface IObserverModelControler {
  updateModelControler(obj: {min: number, max: number, value: number[], step: number}): void;
}

export class Model implements ISubjectModelControler {
  private min: number;
  private max: number;
  private step: number;
  private handle: ModelHandle[];
  private observer: IObserverModelControler | undefined;

  constructor(obj: {min: number, max: number, step: number, handle: ModelHandle[]}) {
    this.min = obj.min;
    this.max = obj.max;
    this.step = obj.step;
    this.handle = obj.handle;
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

  public setValue(value: number[]): void {
    value.forEach((val, i) => {
      if (Number.isNaN(val)) {
        value[i] = 0;
      }
    });

    if (this.handle.length > 1) {
      if (value[0] <= this.min) {
        value[0] = this.min;
      } else if (value[0] >= this.max) {
        value[0] = this.max - this.step;
      }
      if (value[1] <= value[0] + this.step) {
        value[1] = value[0] + this.step;
      } else if (value[1] >= this.max) {
        value[1] = this.max;
      }
      this.handle[0].setValue({value: value[0], min: this.min, max : this.max});
      this.handle[1].setValue({value: value[1], min: this.min, max : this.max});
    } else {
      this.handle[0].setValue({value: value[0], min: this.min, max : this.max});
    }

    this.notifyObserverModelControler();
  }

  public increaseValue(i: number): void {
    if (this.handle.length > 1) {
      const rightHandle: ModelHandle | undefined = this.handle[i + 1];

      if (!rightHandle) {
        this.handle[i].increaseValue({max: this.max, step: this.step});
      } else {
        this.handle[i].increaseValue({max: rightHandle.getValue() - this.step, step: this.step});
      }
    } else {
      this.handle[i].increaseValue({max: this.max, step: this.step});
    }

    this.notifyObserverModelControler();
  }

  public reduceValue(i: number): void {
    if (this.handle.length > 1) {
      if (i === 0) {
        this.handle[i].reduceValue({min: this.min, step: this.step});
      } else {
       const leftHandle: ModelHandle = this.handle[i - 1];
       this.handle[i].reduceValue({min: leftHandle.getValue() + this.step, step: this.step});
      }
    } else {
    this.handle[i].reduceValue({min: this.min, step: this.step});
    }

    this.notifyObserverModelControler();
  }

  public addObserverModelControler(o: IObserverModelControler): void {
    this.observer = o;
  }

  public notifyObserverModelControler(): void {
    if (typeof this.observer !== 'undefined') {
      this.observer.updateModelControler({
        max: this.getMax(),
        min : this.getMin(),
        step: this.getStep(),
        value: this.getValue(),
      });
    }
  }
}

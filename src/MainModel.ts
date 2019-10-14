import {ModelHandle} from './ModelHandle';

interface ISubjectModel {
  addObserverModel(o: IObserverModel): void;
  notifyObserverModel(): void;
}

interface IObserverModel {
  updateModel(obj: {min: number, max: number, value: number, step: number}): void;
}

export class MainModel implements ISubjectModel {
  private min: number;
  private max: number;
  private step: number;
  private handle: ModelHandle;
  private observer: IObserverModel | undefined;

  constructor(obj: {min: number, max: number, step: number, handle: ModelHandle}) {
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

  public getValue(): number {
     return this.handle.getValue();
  }

  public setValue(value: number): void {
    this.handle.setValue({value, min: this.min, max : this.max});
    this.notifyObserverModel();
  }

  public increaseValue(): void {
    this.handle.increaseValue({max: this.max, step: this.step});
    this.notifyObserverModel();
  }

  public reduceValue(): void {
    this.handle.reduceValue({min: this.min, step: this.step});
    this.notifyObserverModel();
  }

  public addObserverModel(o: IObserverModel): void {
    this.observer = o;
  }

  public notifyObserverModel(): void {
    if (typeof this.observer !== 'undefined') {
      this.observer.updateModel({
        max: this.getMax(),
        min : this.getMin(),
        step: this.getStep(),
        value: this.getValue(),
      });
    }
  }
}

import {ModelHandle} from './ModelHandle';

interface SubjectModel {
  addObserverModel(o : ObserverModel) : void;
  notifyObserverModel() : void;
}

interface ObserverModel {
  updateModel(obj : {min : number, max: number, value: number, step: number}) : void
}


export class MainModel implements SubjectModel {
  private min : number;
  private max : number;
  private step : number;
  private handle : ModelHandle;
  private observer : ObserverModel | undefined;

  constructor(obj : {min: number, max : number, step : number, handle : ModelHandle}) {
    this.min = obj.min;
    this.max = obj.max;
    this.step = obj.step;
    this.handle = obj.handle;
  };

  getMin() : number {
    return this.min;
  }
  
  getMax() : number {
    return this.max;
  }

  getStep() : number {
    return this.step;
  }

  getValue() : number {
     return this.handle.getValue();
  }

  setValue(value : number) : void {
    this.handle.setValue({value: value, min: this.min, max : this.max});
    this.notifyObserverModel();
  }

  increaseValue() : void {
    this.handle.increaseValue({max: this.max, step: this.step});
    this.notifyObserverModel();
  }

  reduceValue() : void {
    this.handle.reduceValue({min: this.min, step: this.step});
    this.notifyObserverModel();
  }

  addObserverModel(o : ObserverModel) {
    this.observer = o;
  }

  notifyObserverModel() {
    if(typeof this.observer !== 'undefined')
    this.observer.updateModel({min : this.getMin(), max: this.getMax(), value: this.getValue(), step: this.getStep()});
  }
}
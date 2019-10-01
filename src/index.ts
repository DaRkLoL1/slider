import { type } from "os";



export class ModelFacade {
  private interval : MainModel;
  private handle : ModelHandle | undefined;

  constructor(obj ? : {min ? : number, max ? : number, step ? : number}) {
    this.interval = new MainModel(obj)
  }

  createHandler(num : number) {
    this.handle = new ModelHandle(num);
  }

  increaseAndGetValue() : number | undefined {
    let max = this.interval.getMax();
    let step = this.interval.getStep();
    let value: number;

    if(typeof this.handle !== 'undefined') {
      this.handle.increaseValue({max, step})
      return this.handle.getValue();
    }

  }
}

export class MainModel  {
  private min : number;
  private max : number;
  private step : number;

  constructor({min = 0, max = 100, step = 1} = {}) {
    this.min = min;
    this.max = max;
    this.step = step;
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
}


export class ModelHandle {
  constructor(private value : number = 0) {}

  getValue() : number {
    return this.value;
  }

  setValue(obj : {value : number, min: number, max: number}) : void {
    if(obj.value > obj.max) {
      this.value = obj.max;
    }
    else if(obj.value < obj.min) {
      this.value = obj.min;
    } else {
      this.value = obj.value;
    }
  }

  increaseValue(obj : {max: number, step: number}) : void {
    let count : number = this.value  + obj.step;

    if(count > obj.max) {
      this.value = obj.max;
    }
    else {
      this.value = count;
    } 
  }

  reduceValue(obj : {min: number, step: number}) : void {
    let count = this.value - obj.step;

    if(count < obj.min) {
      this.value = obj.min;
    } else {
      this.value = count;
    }
  }

}
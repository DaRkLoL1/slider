import { type } from "os";



export class ModelFacade {
  private interval : MainModel;
  private handle : ModelHandle | undefined;
  private leftHandle : ModelHandle | undefined;
  private rightHandle : ModelHandle | undefined;

  constructor(obj ? : {min ? : number, max ? : number, step ? : number}) {
    this.interval = new MainModel(obj)
  }

  createHandler(num : number | number[]) {

    if(typeof num === 'object') {
      this.leftHandle = new ModelHandle(num[0]);
      this.rightHandle = new ModelHandle(num[1]);
    }
    else if(typeof num === 'number') {
      this.handle = new ModelHandle(num);
    }
   
  }

  increaseAndGetValue(hand ? : string) : number | {hand : string, value: number } | undefined {
    
    let step = this.interval.getStep();
    let value: number;

    if(typeof this.handle === 'object') {
      let max = this.interval.getMax();
      this.handle.increaseValue({max, step})
      return this.handle.getValue();
    }
    if(typeof this.leftHandle === 'object') {
      return {hand:  "left", value: 9}
    }
  }

  reduceAndGetValue() : number | undefined {
    let min = this.interval.getMin();
    let step = this.interval.getStep();
    let value: number;

    if(typeof this.handle !== 'undefined') {
      this.handle.reduceValue({min, step})
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
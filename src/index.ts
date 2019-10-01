


export class MainModel  {
  private min : number;
  private max : number;
  private step : number;

  constructor({min = 0, max = 100, step = 1} = {}) {
    this.min = min;
    this.max = max;
    this.step = step;
  };

  getMinMax(): number[] {
    return [this.min, this.max];
  };
  
  getStep() : number {
    return this.step;
  }
  }


export class ModelHandle {
  constructor(private value : number = 0) {}

  getValue() : number {
    return this.value;
  }

  setValue(value : number) : void {
    this.value = value;
  }

  increaseValue(obj : {max: number, step: number}) : void {
    let count : number = this.value  + obj.step;

    if(count > obj.max) {
      this.value = obj.max;
    }

    this.value = count;
  }
}
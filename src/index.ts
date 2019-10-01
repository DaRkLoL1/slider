


export class MainModel  {
  

  constructor(private min : number = 0, private max: number = 100) {

  };

  getMinMax(): number[] {
    return [this.min, this.max];
  };
  
  getStep() : number {
    return 1;
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
}
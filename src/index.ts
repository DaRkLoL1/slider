export class MainModel { 

  constructor(private min : number = 0, private max: number = 100) {};

  getMinMax(): number[] {
    return [this.min, this.max];
  };
  
}

export class ModelHandle {
  constructor(private value : number = 1) {}

  getValue() : number {
    return this.value;
  }
}
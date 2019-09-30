
class MainModel { 

  constructor(private min : number, private max: number) {

  }
  getMinMax(): number[] {
    return [this.min, this.max];
  }
}


describe('Model', function () {

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel(0, 100);
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  })
});


class MainModel { 
  min : number = 0;
  max : number = 100;
  getMinMax(): number[] {
    return [this.min, this.max];
  }
}

describe('Model', function () {

  it('должен возвращать минимальное и максимальео значение поля', function () {
    let model : MainModel = new MainModel();
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  })

});
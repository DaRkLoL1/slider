
class MainModel { 
  getMinMax(): number[] {
    return [0,100];
  }
}

describe('Model', function () {

  it('должен возвращать минимальное и максимальео значение поля', function () {
    let model : MainModel = new MainModel();
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  })

});
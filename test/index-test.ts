import {MainModel} from '../src/index';
import {ModelHandle} from '../src/index';



describe('Model', function () {

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel();
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel(0, 100);
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  });

});

describe('model handle', function () {

  it('создать ручку и получить значение', function (){
    let handle = new ModelHandle();
    let value = handle.getValue()
    expect(value).toEqual(50);
  })
});
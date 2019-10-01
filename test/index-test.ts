import {MainModel} from '../src/index';
import {ModelHandle} from '../src/index';



describe('Model', function () {
  
  let model : MainModel;

  beforeEach(function () {
    model = new MainModel()
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel();
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel({min: 0, max: 100});
    let minMax : number[] = model.getMinMax()
    expect(minMax).toEqual([0, 100]);
  });

  it('получить значение шага', function (){
    let step : number = model.getStep();

    expect(step).toEqual(1);
  });

});

describe('model handle', function () {

  let handle : ModelHandle; 

  beforeEach(function () {
     handle = new ModelHandle();
  }) 

  it('изменить значение ручки', function () {
    handle.setValue(5)
    expect(handle.getValue()).toEqual(5)
  })
  
  it('создать ручку и получить значение', function (){
    let handle : ModelHandle = new ModelHandle(50);
    let value : number = handle.getValue();
    expect(value).toEqual(50);
  });

  it('увеличить значение на step', function () {
    handle.increaseValue({max: 100, step: 1});
    expect(handle.getValue()).toEqual(1);
  });

});


import {MainModel} from '../src/index';
import {ModelHandle} from '../src/index';



describe('Model', function () {
  
  let model : MainModel;

  beforeEach(function () {
    model = new MainModel();
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    
    let min = model.getMin();
    let max = model.getMax();
    expect(min).toEqual(0);
    expect(max).toEqual(100);
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel({min: 20, max: 50});
    let min = model.getMin();
    let max = model.getMax();
    expect(min).toEqual(20);
    expect(max).toEqual(50);
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
  });
  
  it('создать ручку и получить значение', function (){
    let handle : ModelHandle = new ModelHandle(50);
    let value : number = handle.getValue();
    expect(value).toEqual(50);
  });

  it('увеличить значение на step', function () {
    handle.increaseValue({max: 100, step: 1});
    expect(handle.getValue()).toEqual(1);
  });

  it('увеличить значение на 110', function () {
    handle.increaseValue({max: 100, step: 110});
    expect(handle.getValue()).toEqual(100);
  });

  it('уменьшить значение на 10', function () {
    handle.setValue({value: 40, min: 0, max: 100});
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(30);
  });

  it('уменьшить значение на 10', function () {
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(0);
  });

  it('изменить значение ручки больше мах значения', function () {
    handle.setValue({value: 200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(100)
  });

  it('изменить значение ручки меньше мin значения', function () {
    handle.setValue({value: -200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(0)
  });

  it('изменить значение ручки', function () {
    handle.setValue({value: 50, min: 0, max: 100})
    expect(handle.getValue()).toEqual(50)
  });

});

describe('изменить, увеличивать и уменьшать значения из MainModel', function () {

  
  it('изменить значение из MainModel', function () {
    let handle = new ModelHandle();
    let model = new MainModel({handle: handle});

    model.setValue(30);
    expect(model.getValue()).toEqual(30);
  });

  it('увеличить значение из MainModel', function () {
    let handle = new ModelHandle(50);
    let model = new MainModel({step: 10, handle: handle});

    model.increaseValue();
    expect(model.getValue()).toEqual(60);
  });

  it('уменьшить значение из MainModel', function () {
    let handle = new ModelHandle(50);
    let model = new MainModel({step: 10, handle: handle});

    model.reduceValue();
    expect(model.getValue()).toEqual(40);
  });
});
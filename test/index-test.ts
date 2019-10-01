import {MainModel} from '../src/index';
import {ModelHandle} from '../src/index';
import {ModelFacade} from '../src/index';


describe('Model', function () {
  
  let model : MainModel;

  beforeEach(function () {
    model = new MainModel()
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

describe('model facade', function () {

  it('увеличить значение', function () {
    let model : ModelFacade = new ModelFacade({min: 10, max: 50, step : 5});
    model.createHandler(40);
    expect(model.increaseAndGetValue()).toEqual(45);
  });

  it('увеличить значение', function () {
    let model : ModelFacade = new ModelFacade();
    model.createHandler(100);
    expect(model.increaseAndGetValue()).toEqual(100);
  });

  it('увеличить значение', function () {
    let model : ModelFacade = new ModelFacade({step: 10});
    model.createHandler(95);
    expect(model.increaseAndGetValue()).toEqual(100);
  });

  it('увеличить значение', function () {
    let model : ModelFacade = new ModelFacade({step: 10});
    model.createHandler(90);
    expect(model.increaseAndGetValue()).toEqual(100);
  });

  it('уменьшить значение', function () {
    let model : ModelFacade = new ModelFacade({min: 10, max: 50, step : 5});
    model.createHandler(10);
    expect(model.reduceAndGetValue()).toEqual(10);
  });

  it('уменьшить значение', function () {
    let model : ModelFacade = new ModelFacade();
    model.createHandler(0);
    expect(model.reduceAndGetValue()).toEqual(0);
  });

  it('уменьшить значение', function () {
    let model : ModelFacade = new ModelFacade({step: 10});
    model.createHandler(95);
    expect(model.reduceAndGetValue()).toEqual(85);
  });

  it('уменьшить значение', function () {
    let model : ModelFacade = new ModelFacade({step: 10});
    model.createHandler(5);
    expect(model.reduceAndGetValue()).toEqual(0);
  });

});
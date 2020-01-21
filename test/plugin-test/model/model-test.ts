import { Model } from '../../../src/plugin/model/Model';
import { ModelValues } from '../../../src/plugin/model/ModelValues';

describe('Model', () => {
  let model: Model;

  beforeEach(() => {
    model = new Model({min: 0, max: 100, step: 1, range: false, values: [0]});
  });

  it('создать конструктор для присвоения min max и вернуть их', () => {
    const min = model.getMin();
    const max = model.getMax();
    expect(min).toEqual(0);
    expect(max).toEqual(100);
  });

  it('создать конструктор для присвоения min max и вернуть их', () => {
    const model: Model = new Model({min: 20, max: 50, step: 1, range: false, values: [0]});
    const min = model.getMin();
    const max = model.getMax();
    expect(min).toEqual(20);
    expect(max).toEqual(50);
  });

  it('получить значение шага', () => {
    const step: number = model.getStep();

    expect(step).toEqual(1);
  });

});

describe('model handle', () => {

  let handle: ModelValues;

  beforeEach(() => {
     handle = new ModelValues(0);
  });

  it('создать ручку и получить значение', () => {
    const handle: ModelValues = new ModelValues(50);
    const value: number = handle.getValue();
    expect(value).toEqual(50);
  });

  it('увеличить значение на step', () => {
    handle.increaseValue({max: 100, step: 1, counter: 1});
    expect(handle.getValue()).toEqual(1);
  });

  it('увеличить значение на 110', () => {
    handle.increaseValue({max: 100, step: 110, counter: 1});
    expect(handle.getValue()).toEqual(100);
  });

  it('уменьшить значение на 10', () => {
    handle.setValue({value: 40, min: 0, max: 100});
    handle.reduceValue({min: 0, step: 10, counter: 1});
    expect(handle.getValue()).toEqual(30);
  });

  it('уменьшить значение на 10', () => {
    handle.reduceValue({min: 0, step: 10, counter: 1});
    expect(handle.getValue()).toEqual(0);
  });

  it('изменить значение ручки больше мах значения', () => {
    handle.setValue({value: 200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(100);
  });

  it('изменить значение ручки меньше мin значения', () => {
    handle.setValue({value: -200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(0);
  });

  it('изменить значение ручки', () => {
    handle.setValue({value: 50, min: 0, max: 100});
    expect(handle.getValue()).toEqual(50);
  });

});

describe('изменить значение из Model',  () => {

  it('изменить значение из Model',  () => {
    const model = new Model({min: 0, max: 100, step: 1, range: false, values: [0]});
    model.checkValue([30]);
    expect(model.getValue()).toEqual([30]);
  });
});

import {Model} from '../../../src/plugin/model/Model';
import {ModelHandle} from '../../../src/plugin/model/ModelHandle';

describe('Model', () => {
  let model: Model;

  beforeEach(() => {
    model = new Model({min: 0, max: 100, step: 1, handle: [new ModelHandle(0)]});
  });

  it('создать конструктор для присвоения min max и вернуть их', () => {
    const min = model.getMin();
    const max = model.getMax();
    expect(min).toEqual(0);
    expect(max).toEqual(100);
  });

  it('создать конструктор для присвоения min max и вернуть их', () => {
    const model: Model = new Model({min: 20, max: 50, step: 1, handle: [new ModelHandle(0)]});
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

  let handle: ModelHandle;

  beforeEach(() => {
     handle = new ModelHandle(0);
  });

  it('создать ручку и получить значение', () => {
    const handle: ModelHandle = new ModelHandle(50);
    const value: number = handle.getValue();
    expect(value).toEqual(50);
  });

  it('увеличить значение на step', () => {
    handle.increaseValue({max: 100, step: 1});
    expect(handle.getValue()).toEqual(1);
  });

  it('увеличить значение на 110', () => {
    handle.increaseValue({max: 100, step: 110});
    expect(handle.getValue()).toEqual(100);
  });

  it('уменьшить значение на 10', () => {
    handle.setValue({value: 40, min: 0, max: 100});
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(30);
  });

  it('уменьшить значение на 10', () => {
    handle.reduceValue({min: 0, step: 10});
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

describe('изменить, увеличивать и уменьшать значения из Model',  () => {

  it('изменить значение из Model',  () => {
    const handle = new ModelHandle(0);
    const model = new Model({min: 0, max: 100, step: 1, handle: [handle]});

    model.setValue([30]);
    expect(model.getValue()).toEqual([30]);
  });

  it('увеличить значение из Model',  () => {
    const handle = new ModelHandle(50);
    const model = new Model({min: 0, max: 100, step: 10, handle: [handle]});

    model.increaseValue(0);
    expect(model.getValue()).toEqual([60]);
  });

  it('уменьшить значение из Model',  () => {
    const handle = new ModelHandle(50);
    const model = new Model({min: 0, max: 100, step: 10, handle: [handle]});

    model.reduceValue(0);
    expect(model.getValue()).toEqual([40]);
  });
});

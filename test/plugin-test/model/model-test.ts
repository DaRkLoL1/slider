import { Model } from '../../../src/plugin/model/Model';

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
    model = new Model({min: 20, max: 50, step: 1, range: false, values: [0]});
    const min = model.getMin();
    const max = model.getMax();
    expect(min).toEqual(20);
    expect(max).toEqual(50);
  });

  it('получить значение шага', () => {
    const step: number = model.getStep();
    expect(step).toEqual(1);
  });

  it('добавить 2 значение', () => {
    model = new Model({min: 20, max: 50, step: 1, range: true, values: [1, 2]});
    expect(model.getValue()).toEqual([20, 21]);
  });

  it('проверить на граничность', () => {
    model = new Model({min: 20, max: 50, step: 1, range: true, values: [50, 51]});
    expect(model.getValue()).toEqual([49, 50]);
  });

  it('создать maxValue', () => {
    model = new Model({min: 20, max: 59, step: 10, range: false, values: [0]});
    expect(model.addMaxValue()).toEqual(50);
  });

  it('проверить на NaN', () => {
    model = new Model({min: NaN, max: NaN, step: NaN, range: false, values: [NaN]});
    expect(model.getMax()).toEqual(1);
    expect(model.getMin()).toEqual(0);
    expect(model.getStep()).toEqual(1);
  });

  it('проверить на допустимость значения', () => {
    model = new Model({min: 0, max: 50, step: 15, range: false, values: [20]});
    expect(model.getValue()).toEqual([15]);
  });
});

describe('изменить значение из Model',  () => {
  let model: Model;
  beforeEach(() => {
    model = new Model({min: 0, max: 100, step: 1, range: false, values: [0]});
    model.addSubscribers('changeModel', () => true);
  });

  it('изменить значение из Model',  () => {
    model.setValue([40]);
    expect(model.getValue()).toEqual([40]);
  });

  it('увеличить значение', () => {
    model.updateValue({symbolMinusOrPlus: '+', index: 0, counter: 1});
    expect(model.getValue()).toEqual([1]);
  });

  it('уменьшить значение', () => {
    model.updateValue({symbolMinusOrPlus: '-', index: 0, counter: 1});
    expect(model.getValue()).toEqual([0]);
  });
});

describe('изменить значение из Model для 2 ModelValues', () => {
  let model: Model;
  beforeEach(() => {
    model = new Model({min: 0, max: 100, step: 1, range: true, values: [0, 1]});
    model.addSubscribers('changeModel', () => true);
  });

  it('увеличить значение для 1 ModelValues', () => {
    model.updateValue({symbolMinusOrPlus: '+', index: 0, counter: 1});
    expect(model.getValue()).toEqual([0, 1]);
  });

  it('увеличить значение для 2 ModelValues', () => {
    model.updateValue({symbolMinusOrPlus: '+', index: 1, counter: 1});
    expect(model.getValue()).toEqual([0, 2]);
  });

  it('уменьшить значение для 1 ModelValues', () => {
    model.updateValue({symbolMinusOrPlus: '-', index: 0, counter: 1});
    expect(model.getValue()).toEqual([0, 1]);
  });

  it('уменьшить значение для 2 ModelValues', () => {
    model.updateValue({symbolMinusOrPlus: '-', index: 1, counter: 1});
    expect(model.getValue()).toEqual([0, 1]);
  });
});

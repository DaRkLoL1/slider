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

describe('изменить значение из Model',  () => {

  it('изменить значение из Model',  () => {
    const model = new Model({min: 0, max: 100, step: 1, range: false, values: [0]});
    model.checkValue([30]);
    expect(model.getValue()).toEqual([30]);
  });
});

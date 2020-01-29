import { ModelValues } from '../../../src/plugin/model/Model-values';

describe('model handle', () => {

  let handle: ModelValues;

  beforeEach(() => {
     handle = new ModelValues();
  });

  it('создать ручку и получить значение', () => {
    handle = new ModelValues(50);
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

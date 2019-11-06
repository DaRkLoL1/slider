import {Model} from './Model';
import {View} from './View';

interface IObserverModelControler {
  updateModelControler(obj: {min: number, max: number, value: number[], step: number}): void;
}

interface IObserverViewControler {
  updateViewControler(symbol: string[]): void;
}

export class Prezenter implements IObserverViewControler, IObserverModelControler {
  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
    this.view.addObserverViewControler(this);
    this.model.addObserverModelControler(this);
  }

  public init(obj: {
    min: number,
    max: number,
    step: number,
    value: number[],
    range: number;
    tooltip: boolean,
    position: string}): void {
    this.view.createSlider(obj);
  }

  public updateViewControler(symbol: string[]): void {
    symbol.forEach((val, i) => {
      if (val === '+') {
        this.increase(i);
      } else if (val === '-') {
        this.reduce(i);
      }
    });
  }

  public updateModelControler(obj: {min: number, max: number, value: number[], step: number}): void {
    this.slide(obj.value);
    this.view.update(obj);
  }

  public increase(i: number): void {
    this.model.increaseValue(i);
  }

  public reduce(i: number): void {
    this.model.reduceValue(i);
  }

  public set(num: number[]): void {
    this.model.setValue(num);
  }

  public slide(num: number[]): void {}
}

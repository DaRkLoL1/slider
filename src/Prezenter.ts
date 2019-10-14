import {MainModel} from './MainModel';
import {View} from './View';

interface IObserverModel {
  updateModel(obj: {min: number, max: number, value: number, step: number}): void;
}

interface IObserverView {
  updateView(symbol: string): void;
}

export class Prezenter implements IObserverView, IObserverModel {
  private view: View;
  private model: MainModel;

  constructor(view: View, model: MainModel) {
    this.view = view;
    this.model = model;
    this.view.addObserverView(this);
    this.model.addObserverModel(this);
  }

  public init(obj: {
    min: number,
    max: number,
    step: number,
    value: number,
    tooltip: boolean,
    interval: boolean,
    position: string}): void {
    this.view.createSlider(obj);
  }

  public updateView(symbol: string): void {

    if (symbol === '+') {
      this.increase();
      return;
    }
    if (symbol === '-') {
      this.reduce();
      return;
    } else {
      this.set(Number.parseInt(symbol, 10));
    }
  }

  public updateModel(obj: {min: number, max: number, value: number, step: number}): void {
    this.slide(obj.value);
    this.view.update(obj);
  }

  public increase(): void {
    this.model.increaseValue();
  }

  public reduce(): void {
    this.model.reduceValue();
  }

  public set(num: number): void {
    this.model.setValue(num);
  }

  public slide(num: number): void {}
}

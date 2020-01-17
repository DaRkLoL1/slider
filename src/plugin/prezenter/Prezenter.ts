import {Model} from '../model/Model';
import {View} from '../view/View';

interface IObserverModelControler {
  updateModelControler(obj: {min: number, max: number, value: number[], step: number}): void;
}

interface IObserverViewControler {
  updateViewControler(symbol: string[]): void;
}

export class Prezenter implements IObserverViewControler, IObserverModelControler {
  private view: View;
  private model: Model;
  private slide?: (num: number[]) => void;
  constructor(slider: JQuery<HTMLElement>, options: {
    min: number,
    max: number,
    step: number,
    value: number[],
    range: boolean;
    tooltip: boolean,
    position: string,
    slide?(num: number[]): void,
    }) {
    this.model = new Model(options);
    this.view = new View(slider);
    options.min = this.model.getMin();
    options.max = this.model.getMax();
    options.step = this.model.getStep();
    options.value = this.model.getValue();
    this.view.createSlider(options);
    if (options.slide) {
      this.slide = options.slide;
    }
    this.view.addObserverViewControler(this);
    this.model.addObserverModelControler(this);
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
    if (this.slide) {
      this.slide(obj.value);
    }
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
}

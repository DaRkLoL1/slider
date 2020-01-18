import { Model } from '../model/Model';
import { View } from '../view/View';

class Prezenter {
  private view: View;
  private model: Model;
  private slide?: (num: number[]) => void;

  constructor(slider: JQuery<HTMLElement>, options: {
    min: number,
    max: number,
    step: number,
    values: number[],
    range: boolean;
    tooltip: boolean,
    position: string,
    slide?(values: number[]): void,
    }) {
    this.model = new Model(options);
    this.view = new View(slider);
    options.min = this.model.getMin();
    options.max = this.model.getMax();
    options.step = this.model.getStep();
    options.values = this.model.getValue();
    this.view.createSlider(options);
    if (options.slide) {
      this.slide = options.slide;
    }
    this.view.addSubscribers('changeView', this.model.updateValue.bind(this.model));
    this.model.addSubscribers('changeModel', this.view.update.bind(this.view));
    this.model.addSubscribers('changeModel', this.updateSlider.bind(this));
  }

  public updateSlider(obj: {values: number[]}): void {
    if (this.slide) {
      this.slide(obj.values);
    }
  }

  public set(num: number[]) {
    this.model.setValue(num);
  }
}

export { Prezenter };

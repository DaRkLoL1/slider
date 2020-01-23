import { Model } from '../model/Model';
import { View } from '../view/View';

class Prezenter {
  private view: View;
  private model: Model;
  private slide?: (num: number[]) => void;

  constructor(model: Model, view: View, slide?: (values: number[]) => void) {
    this.model = model;
    this.view = view;
    if (slide) {
      this.slide = slide;
    }

    this.addForModelAndViewSubscribers();
  }

  public addForModelAndViewSubscribers() {
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

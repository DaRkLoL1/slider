import autobind from 'autobind-decorator';
import { Model } from '../model/Model';
import { View } from '../view/View';

class Prezenter {
  private view: View;
  private model: Model;
  private slideThumb?: (num: number[]) => void;

  constructor(model: Model, view: View, slideThumb?: (values: number[]) => void) {
    this.model = model;
    this.view = view;
    if (slideThumb) {
      this.slideThumb = slideThumb;
    }

    this.addForModelAndViewSubscribers();
  }

  public addForModelAndViewSubscribers() {
    this.view.addSubscribers('changeView', this.model.updateValue);
    this.model.addSubscribers('changeModel', this.view.updateView);
    this.model.addSubscribers('changeModel', this.updateSlider);
  }

  @autobind
  public updateSlider(obj: {values: number[]}): void {
    if (this.slideThumb) {
      this.slideThumb(obj.values);
    }
  }

  public setValues(num: number[]) {
    this.model.setValue(num);
  }
}

export { Prezenter };

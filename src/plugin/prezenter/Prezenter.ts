import autobind from 'autobind-decorator';
import { Model } from '../model/Model';
import { Observer } from '../observer/Observer';
import { View } from '../view/View';

@autobind
class Prezenter extends Observer {
  private view: View;
  private model: Model;

  constructor(model: Model, view: View) {
    super();
    this.model = model;
    this.view = view;
    this.addForModelAndViewSubscribers();
  }

  public addForModelAndViewSubscribers() {
    this.view.addSubscribers('changeView', this.model.updateValue);
    this.model.addSubscribers('changeModel', this.view.updateView);
    this.model.addSubscribers('changeModel', this.updateSlider);
  }

  public updateSlider({values = [50]} = {}): void {
    this.notifySubscribers('changeModel', values);
  }

  public setValues(num: number[]) {
    this.model.setValue(num);
  }
}

export { Prezenter };

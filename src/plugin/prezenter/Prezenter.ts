import autobind from 'autobind-decorator';
import { Model } from '../model/Model';
import { Observer } from '../observer/Observer';
import { View } from '../view/View';

@autobind
class Prezenter extends Observer {
  private view: View;
  private model: Model;

  constructor($slider: JQuery<HTMLElement>, options: {
    max: number;
    min: number;
    position: string;
    range: boolean;
    step: number;
    tooltip: boolean;
    values: number[];
  }) {
    super();
    this.model = new Model(options);
    this.view = new View($slider);
    this.view.createSlider({...options, ...this.model.getOptions()});
    this.addForModelAndViewSubscribers();
  }

  private addForModelAndViewSubscribers() {
    this.view.addSubscribers('changeView', this.model.updateValue);
    this.model.addSubscribers('changeModel', this.view.updateView);
    this.model.addSubscribers('changeModel', this.updateSlider);
  }

  private updateSlider({values = [50]} = {}): void {
    this.notifySubscribers('changeModel', values);
  }

  public getModelOptions() : {
    min: number;
    max: number;
    step: number;
    values: number[];
  } {
    return this.model.getOptions();
  }

  public getValues(): number[] {
    const options = this.model.getOptions();
    return options.values;
  }

  public setValues(num: number[]) {
    this.model.setValue(num);
  }
}

export { Prezenter };

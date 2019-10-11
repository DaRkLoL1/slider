import {MainModel} from './MainModel';
import {View} from './View';

interface ObserverModel {
  updateModel(obj : {min : number, max: number, value: number, step: number}) : void
}

interface ObserverView {
  updateView(symbol : string) : void
}

export class Prezenter implements ObserverView, ObserverModel {
  private view : View;
  private model : MainModel;
 

  constructor(view : View, model : MainModel) {
    this.view = view;
    this.model = model;
    this.view.addObserverView(this);
    this.model.addObserverModel(this);
  }

  init(obj :{min : number, max: number, step : number, value : number, tooltip: boolean, interval : boolean, position: string}) : void {
    this.view.createSlider(obj)
  }

  updateView(symbol : string) : void {

    if(symbol === '+') {
      this.increase();
    } 
    else if(symbol === '-') {
      this.reduce();
    } else {
      this.set( Number.parseInt(symbol) );
    }
  }

  updateModel(obj : {min : number, max: number, value : number, step : number}) : void {
    this.slide(obj.value)
    this.view.update(obj);
  }

  increase() : void {
    this.model.increaseValue();
  }
  
  reduce() : void {
    this.model.reduceValue();
  }

  set(num : number) : void {
    this.model.setValue(num)
  }

  slide(num : number) : void {}
}

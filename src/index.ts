import './index.scss';

interface SubjectView {
  addObserverView(o : ObserverView) : void;
  notifyObserverView() : void;
}

interface ObserverView {
  updateView(symbol : string) : void
}

interface SubjectModel {
  addObserverModel(o : ObserverModel) : void;
  notifyObserverModel() : void;
}

interface ObserverModel {
  updateModel(obj : {min : number, max: number, value: number, step: number}) : void
}


export class MainModel implements SubjectModel {
  private min : number;
  private max : number;
  private step : number;
  private handle : ModelHandle;
  private observer : ObserverModel | undefined;

  constructor(obj : {min: number, max : number, step : number, handle : ModelHandle}) {
    this.min = obj.min;
    this.max = obj.max;
    this.step = obj.step;
    this.handle = obj.handle;
  };

  getMin() : number {
    return this.min;
  }
  
  getMax() : number {
    return this.max;
  }

  getStep() : number {
    return this.step;
  }

  getValue() : number {
     return this.handle.getValue();
  }

  setValue(value : number) : void {
    this.handle.setValue({value: value, min: this.min, max : this.max});
    this.notifyObserverModel();
  }

  increaseValue() : void {
    this.handle.increaseValue({max: this.max, step: this.step});
    this.notifyObserverModel();
  }

  reduceValue() : void {
    this.handle.reduceValue({min: this.min, step: this.step});
    this.notifyObserverModel();
  }

  addObserverModel(o : ObserverModel) {
    this.observer = o;
  }

  notifyObserverModel() {
    if(typeof this.observer !== 'undefined')
    this.observer.updateModel({min : this.getMin(), max: this.getMax(), value: this.getValue(), step: this.getStep()});
  }
}


export class ModelHandle {
  constructor(private value : number) {}

  getValue() : number {
    return this.value;
  }

  setValue(obj : {value : number, min: number, max: number}) : void {
    if(obj.value > obj.max) {
      this.value = obj.max;
    }
    else if(obj.value < obj.min) {
      this.value = obj.min;
    } else {
      this.value = obj.value;
    }
  }

  increaseValue(obj : {max: number, step: number}) : void {
    let count : number = this.value  + obj.step;

    if(count > obj.max) {
      this.value = obj.max;
    }
    else {
      this.value = count;
    } 
  }

  reduceValue(obj : {min: number, step: number}) : void {
    let count = this.value - obj.step;

    if(count < obj.min) {
      this.value = obj.min;
    } else {
      this.value = count;
    }
  }

}

export class View implements ObserverView, SubjectView {
  private item : JQuery<HTMLElement>;
  private interval : number | undefined;
  private thumb : ViewThumb | undefined;
  private observer : ObserverView | undefined;
  private symbol : string | undefined;
  private tooltip : ViewTooltip | undefined;
  private scale : ViewScale | undefined;

  constructor(item : JQuery<HTMLElement>) {
    this.item = item;
  }

  createSlider(obj : {min : number, max : number, step : number, value : number, tooltip: boolean, interval : boolean}) {
    

      $(this.item).html('<div class="slider"><div class="slider__field"></div></div>');
      let width : number | undefined = $(this.item).width();

      if(typeof width === 'number') {
        this.interval = width / (obj.max - obj.min) * obj.step;
        
        $(this.item).find('.slider__field').html('<div class="slider__line"></div><div class="slider__thumb"></div>');
        this.thumb = new ViewThumb(this.item.find('.slider__thumb'), this.item.find('.slider__line') )
        this.thumb.installValue( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );
        this.thumb.addObserverView(this);

        if(obj.tooltip) {
          $(this.item).find('.slider').prepend($('<div class="slider__tooltip"></div>'));
          this.tooltip = new ViewTooltip(this.item.find('.slider__tooltip'));
          this.tooltip.setTooltip( width / (obj.max - obj.min) * (obj.value - obj.min), obj.value )
        }

        if(obj.interval) {
          $(this.item).find('.slider').append($('<div class="slider__numbers"></div>'));
          this.scale = new ViewScale(this.item.find('.slider__numbers'));
          this.scale.setNumbers({min: obj.min, max: obj.max, step: obj.step});
          this.scale.addObserverView(this);
        }
      }
  }

  update(obj : {min : number, max: number, value: number, step : number}) {
    let width : number | undefined = $(this.item).width();

    if(typeof width === 'number' && typeof this.thumb === 'object' && typeof this.interval === 'number') {
      this.interval = width / (obj.max - obj.min) * obj.step;

      this.thumb.update( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );

      if(typeof this.tooltip === 'object') {
        this.tooltip.setTooltip(width / (obj.max - obj.min) * (obj.value - obj.min), obj.value)
      }
    }
  }

  updateView(symbol : string) {
    this.symbol = symbol;
    this.notifyObserverView();
  }

  addObserverView(o : ObserverView) {
    this.observer = o;
  }

  notifyObserverView() {
    if(typeof this.observer !== 'undefined' && typeof this.symbol === 'string') {
      this.observer.updateView(this.symbol)
    }
  }
}

export class ViewThumb implements SubjectView {
  private observer : ObserverView | undefined;
  private symbol : string | undefined;
  private interval : number | undefined;

  constructor(private thumb : JQuery<HTMLElement>, private line : JQuery<HTMLElement>) {}

  installValue(value: number, interval : number) {
      this.interval = interval;

      let width : number | undefined  = $(this.thumb).width();
      if(typeof width === 'number') {
        let left : string = value - width / 2 + 'px';
        this.thumb.css('left', left);
        this.line.css('width', left);
        let that : ViewThumb = this;

        $(this.thumb).on('dragstart', function () {
          return false;
        });

        $(this.thumb).on('mousedown', function (event) {
          let target : Element = event.currentTarget;

          let onMouseMove = function (event : MouseEvent) {
            
            let x : number =  event.clientX;
            
            let thumbLeft : number;
            if(typeof width === 'number' && typeof that.interval === 'number') {
              thumbLeft = target.getBoundingClientRect().left + width / 2
              if( x >= (thumbLeft + that.interval / 2 ) ) {
                that.symbol = '+';
                that.changed()
              } 
              if(x <= (thumbLeft - that.interval / 2 )) {
                that.symbol = '-';
                that.changed()
              }
            }
          }
          document.addEventListener('mousemove', onMouseMove);

          let onMouseUp = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          }
          document.addEventListener('mouseup', onMouseUp);
            
        });
      }
    
  }

  update(value : number, interval : number) {
    this.interval = interval;

    let width : number | undefined  = $(this.thumb).width();
      if(typeof width === 'number') {
        let left : string = value - width / 2 + 'px';
        this.thumb.css('left', left);
        this.line.css('width', left);
      }
  }

  changed() {
    this.notifyObserverView()
  }

  addObserverView(o : ObserverView) {
    this.observer = o;
  }

  notifyObserverView() {
    if(typeof this.observer !== 'undefined' && typeof this.symbol === 'string') {
      this.observer.updateView(this.symbol)
    }
  }
}

class ViewTooltip {
  constructor(private tooltip : JQuery<HTMLElement>) {};

  setTooltip(position : number, value : number) {
    let width : number | undefined = this.tooltip.width();

    if(typeof width === 'number') {
      let left = position - width / 2 + 'px';
      this.tooltip.css('margin-left', left);
    }
    
    this.tooltip.text(value);
  }
}

class ViewScale implements SubjectView {
  private observer : ObserverView | undefined;
  private num : string | undefined;

  constructor(private scale : JQuery<HTMLElement>) {};

  setNumbers(obj : {min : number, max : number, step : number}) {
    
    for(let i = obj.min; i <= obj.max; i += obj.step) {
      this.scale.append($('<span>' + i + '</span>'));
    }

    let that = this;
    this.scale.on('click', function (event) {
      let target = $(event.target);
      
      if(target.prop('tagName') !== 'SPAN') return;
      
      that.num = target.text();
      that.notifyObserverView();
    });
  }

  addObserverView (o : ObserverView) {
    this.observer = o;
  }

  notifyObserverView () {

    if(typeof this.observer === 'object' && typeof this.num === 'string') {
      this.observer.updateView(this.num);
    }

  }

}

class Prezenter implements ObserverView, ObserverModel {
  private view : View;
  private model : MainModel;
 

  constructor(view : View, model : MainModel) {
    this.view = view;
    this.model = model;
    this.view.addObserverView(this);
    this.model.addObserverModel(this);
  }

  init(obj :{min : number, max: number, step : number, value : number, tooltip: boolean, interval : boolean}) {
    this.view.createSlider(obj)
  }

  updateView(symbol : string) {

    if(symbol === '+') {
      this.increase();
    } 
    else if(symbol === '-') {
      this.reduce();
    } else {
      this.set( Number.parseInt(symbol) );
    }
  }

  updateModel(obj : {min : number, max: number, value : number, step : number}) {
    this.view.update(obj)
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
}

(function( $ ){
  
  (<any>$.fn).myPlugin = function() {
    
    let def = {
      min: 0,
      max: 100,
      step: 10,
      value: 50, 
      tooltip: false,
      interval: false,
    };

    def.tooltip = true;
    def.interval = true;

    let model = new MainModel({min: def.min, max: def.max, step: def.step, handle: new ModelHandle(def.value) });
    let view = new View(this);
    let prezenter = new Prezenter(view, model);
    prezenter.init(def);
    return this;
  };
})( jQuery );

(<any>$('.rooot')).myPlugin();
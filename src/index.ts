import './index.scss';


export class MainModel  {
  private min : number;
  private max : number;
  private step : number;
  private handle : ModelHandle;


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
  }

  increaseValue() : void {
    this.handle.increaseValue({max: this.max, step: this.step});
  }

  reduceValue() : void {
    this.handle.reduceValue({min: this.min, step: this.step});
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

export class View {
  private item : JQuery<HTMLElement>;
  private interval : number | undefined;
  private thumb : ViewThumb | undefined;


  constructor(item : JQuery<HTMLElement>) {
    this.item = item;
  }
  createSlider(obj : {min : number, max : number, step : number, value : number}) {
    

      $(this.item).html('<div class="slider"><div class="slider__field"></div></div>');
      let width : number | undefined = $(this.item).width();

      if(typeof width === 'number') {
        this.interval = width / (obj.max - obj.min) * obj.step;
        
        $(this.item).find('.slider__field').html('<div class="slider__line"></div><div class="slider__thumb"></div>');
        this.thumb = new ViewThumb(this.item.find('.slider__thumb'), this.item.find('.slider__line') )
        this.thumb.installValue( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );
      }

    

  }
}

export class ViewThumb {
  
constructor(private thumb : JQuery<HTMLElement>, private line : JQuery<HTMLElement>) {}

  installValue(value: number, interval : number) {
    
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
            if(typeof width === 'number') {
              thumbLeft = target.getBoundingClientRect().left + width / 2
              if( x >= (thumbLeft + interval / 2 ) ) {
                that.increase();
              } 
              if(x <= (thumbLeft - interval / 2 )) {
                that.reduce();
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

  increase() {

  }

  reduce() {

  }
}


class Prezenter {
  private view : View;
  private model : MainModel;
  constructor(view : View, model : MainModel) {
    this.view = view;
    this.model = model;
  }
  init(obj :{min : number, max: number, step : number, value : number}) {
    this.view.createSlider(obj)
  }
}

(function( $ ){
  
  (<any>$.fn).myPlugin = function() {
    
    let def = {
      min: 0,
      max: 100,
      step: 10,
      value: 50
    }
    let model = new MainModel({min: def.min, max: def.max, step: def.max, handle: new ModelHandle(def.value) });
    let view = new View(this);
    let prezenter = new Prezenter(view, model);
    prezenter.init(def);
    return this;
  };
})( jQuery );

(<any>$('.rooot')).myPlugin();
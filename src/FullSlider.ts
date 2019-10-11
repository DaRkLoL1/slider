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
  private position : string | undefined;

  constructor(item : JQuery<HTMLElement>) {
    this.item = item;
  }

  createSlider(obj : {min : number, max : number, step : number, value : number, tooltip: boolean, interval : boolean, position : string}) : void {
    
    this.position = obj.position;

    let width : number | undefined;
     
    if(this.position === 'vertical') {
      $(this.item).html('<div class="slider slider_vertical"><div class="slider__field slider__field_vertical"></div></div>');
      width  = $(this.item).height();
    } else {
      $(this.item).html('<div class="slider"><div class="slider__field"></div></div>');
      width  = $(this.item).width();
    }

    if(typeof width === 'number') {
      this.interval = width / (obj.max - obj.min) * obj.step;
      
      if(this.position === 'vertical') {
        $(this.item).find('.slider__field_vertical').html('<div class="slider__line slider__line_vertical"></div><div class="slider__thumb slider__thumb_vertical"></div>');
        this.thumb = new ViewThumb(this.item.find('.slider__thumb_vertical'), this.item.find('.slider__line_vertical') )
      } else {
        $(this.item).find('.slider__field').html('<div class="slider__line"></div><div class="slider__thumb"></div>');
        this.thumb = new ViewThumb(this.item.find('.slider__thumb'), this.item.find('.slider__line') )
      }
      
      this.thumb.installValue( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );
      this.thumb.addObserverView(this);

      if(obj.tooltip) {
        if(this.position === 'vertical') {
          $(this.item).find('.slider__field_vertical').prepend($('<div class="slider__tooltip slider__tooltip_vertical"></div>'));
          this.tooltip = new ViewTooltip(this.item.find('.slider__tooltip_vertical'));
        } else {
          $(this.item).find('.slider__field').prepend($('<div class="slider__tooltip"></div>'));
          this.tooltip = new ViewTooltip(this.item.find('.slider__tooltip'));
        }
        
        this.tooltip.setTooltip( width / (obj.max - obj.min) * (obj.value - obj.min), obj.value )
      }

      if(obj.interval) {
        if(this.position === 'vertical') {
          $(this.item).find('.slider_vertical').append($('<div class="slider__numbers slider__numbers_vertical"></div>'));
          this.scale = new ViewScale(this.item.find('.slider__numbers_vertical'));
        } else {
          $(this.item).find('.slider').append($('<div class="slider__numbers"></div>'));
          this.scale = new ViewScale(this.item.find('.slider__numbers'));
        }
        this.scale.setNumbers({min: obj.min, max: obj.max, step: obj.step});
        this.scale.addObserverView(this);

      }
    }  
  }

  update(obj : {min : number, max: number, value: number, step : number}) : void {
    let width : number | undefined;

    if(this.position === 'vertical') {
      width = $(this.item).height();
    } else {
      width = $(this.item).width();
    }

    

    if(typeof width === 'number' && typeof this.thumb === 'object' && typeof this.interval === 'number') {
      this.interval = width / (obj.max - obj.min) * obj.step;

      this.thumb.update( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );

      if(typeof this.tooltip === 'object') {
        this.tooltip.setTooltip(width / (obj.max - obj.min) * (obj.value - obj.min), obj.value)
      }
    }
  }

  updateView(symbol : string) : void {
    this.symbol = symbol;
    this.notifyObserverView();
  }

  addObserverView(o : ObserverView) : void {
    this.observer = o;
  }

  notifyObserverView() : void {
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

  installValue(value: number, interval : number) : void {
    this.interval = interval;

    let width : number | undefined;

    if(this.thumb.hasClass('slider__thumb_vertical')) {
      width  = $(this.thumb).height();
      
    } else {
      width  = $(this.thumb).width();
    }
    
    if(typeof width === 'number') {
      let left : string = value - width / 2 + 'px';
      
      if(this.thumb.hasClass('slider__thumb_vertical')) {
        this.thumb.css('bottom', left);
        this.line.css('height', left);
      } else {
        this.thumb.css('left', left);
        this.line.css('width', left);
      }
      
      let that : ViewThumb = this;

      $(this.thumb).on('dragstart', function () {
        return false;
      });

      $(this.thumb).on('mousedown', function (event) {
        let target : Element = event.currentTarget;

        let onMouseMove = function (event : MouseEvent) {
            
          let x : number;
          if(that.thumb.hasClass('slider__thumb_vertical')) {
            x =  event.clientY;
          } else {
            x =  event.clientX;
          }
          
            
          let thumbLeft : number;
          if(typeof width === 'number' && typeof that.interval === 'number') {
            if(that.thumb.hasClass('slider__thumb_vertical')) {
              thumbLeft = target.getBoundingClientRect().top + width / 2
            } else {
              thumbLeft = target.getBoundingClientRect().left + width / 2
            }
            
            if( x >= (thumbLeft + that.interval / 2 ) ) {

              if(that.thumb.hasClass('slider__thumb_vertical')) {
                that.symbol = '-';
              } else {
                that.symbol = '+';
              }
              
              that.changed()

            } 
            if(x <= (thumbLeft - that.interval / 2 )) {
              if(that.thumb.hasClass('slider__thumb_vertical')) {
                that.symbol = '+';
              } else {
                that.symbol = '-';
              }
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

  update(value : number, interval : number) : void {
    this.interval = interval;

    let width : number | undefined;

    if(this.thumb.hasClass('slider__thumb_vertical')) {
      width  = $(this.thumb).height();
    } else {
      width  = $(this.thumb).width();
    }

    if(typeof width === 'number') {
      let left : string = value - width / 2 + 'px';

      if(this.thumb.hasClass('slider__thumb_vertical')) {
         this.thumb.css('bottom', left);
        this.line.css('height', left);
      } else {
        this.thumb.css('left', left);
        this.line.css('width', left);
      }
    }
  }

  changed() : void {
    this.notifyObserverView()
  }

  addObserverView(o : ObserverView) : void {
    this.observer = o;
  }

  notifyObserverView() : void {
    if(typeof this.observer !== 'undefined' && typeof this.symbol === 'string') {
      this.observer.updateView(this.symbol)
    }
  }
}

class ViewTooltip {
  constructor(private tooltip : JQuery<HTMLElement>) {};

  setTooltip(position : number, value : number) : void {
    let width : number | undefined;

    if(this.tooltip.hasClass('slider__tooltip_vertical')) {
      width = this.tooltip.height();
    } else {
      width = this.tooltip.width();
    }
    
    if(typeof width === 'number') {
      let left : string = position  - width / 2 + 'px';

      if(this.tooltip.hasClass('slider__tooltip_vertical')) {
        this.tooltip.css('bottom', left);
      } else {
        
        this.tooltip.css('left', left);
      }
      
    }
    
    this.tooltip.text(value);
  }
}

class ViewScale implements SubjectView {
  private observer : ObserverView | undefined;
  private num : string | undefined;

  constructor(private scale : JQuery<HTMLElement>) {};

  setNumbers(obj : {min : number, max : number, step : number}) : void {
    
    for(let i = obj.min; i <= obj.max; i += obj.step) {
      this.scale.append($('<span>' + i + '</span>'));
    }

    let that = this;
    this.scale.on('click', function (event) {
      let target = $(event.target);
      
      if(target.prop('tagName') !== 'SPAN') return;
      
      that.num = target.text();
      that.notifyObserverView();
      return false;
    });
  }

  addObserverView(o : ObserverView) : void {
    this.observer = o;
  }

  notifyObserverView() : void {

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

(function( $ ) {
  
  let def = {
    min: 0,
    max: 100,
    step: 25,
    value: 0, 
    tooltip: false,
    interval: false,
    position: 'horisontal',
    slide : function(num : number) : void {
    }
  };

  (<any>$.fn).myPlugin = function(method : {} | string) {
     

  let methods = {
    init : function( that : JQuery<HTMLElement>,params : {} ) { 
      
      let options = $.extend({}, def, params);

      that.data('model', new MainModel({min: options.min, max: options.max, step: options.step, handle: new ModelHandle(options.value) }) );
      that.data('view', new View(that) );

      that.data('prazenter', new Prezenter(that.data('view'), that.data('model') ) );
      that.data('prazenter').init(options);
      that.data('prazenter').slide = options.slide;

      return this;
    },

    value (that : JQuery<HTMLElement>, num : string) {
      if(typeof num === 'undefined') {
        return that.data('model').getValue();
      } else {
        that.data('prazenter').updateView(num);
        return this;
      }
    }

  };

  if(typeof method === 'string' && (method === 'value') ) {
      
    return methods[method].call(this, this, arguments[1]);
     
   } else if ( typeof method === 'object' || !method ) {
     return methods.init(this, method);
   }
  
  }
})( jQuery );


$('.configure__button').on('click', function (event) {
  let parent = $(event.currentTarget).parent();

  interface Obj {
    min ? : number;
    max ? : number;
    step ? : number;
    interval ? : boolean;
    tooltip ? : boolean;
    position ? : string;
    value ? : number;
    slide : (num : number) => void;
  };
  

  let obj : Obj = {
    slide(num) {
      parent.find('.configure__input').val(num);
    }
  };

  let value = parent.find('.configure__input').val();

  if(value && typeof value === 'string') {
    obj.value = Number.parseInt(value);
  }

  let min = parent.find('.configure__min').val();

  if(min && typeof min === 'string') {
    obj.min = Number.parseInt(min);
  }

  let max = parent.find('.configure__max').val();

  if(max && typeof max === 'string') {
    obj.max = Number.parseInt(max);
  }

  let step = parent.find('.configure__step').val();

  if(step && typeof step === 'string') {
    obj.step = Number.parseInt(step);
  }

  if(parent.find('.configure__tooltip').prop('checked')) {
    obj.tooltip = true;
  }

  if(parent.find('.configure__interval').prop('checked')) {
    obj.interval = true;
  }

  if(parent.find('.configure__position').prop('checked')) {
    obj.position = 'vertical';
  }
  ( <any>$(parent.parent().children()[0]) ).myPlugin(obj);
});



(<any>$('.root-slider')).myPlugin({
  slide : function (num : number) {
    $('.root-input').val(num);
  }
});

$('.root-input').val((<any>$('.root-slider')).myPlugin('value'));

$('.root-input').on('change', function (event) {
  let target = $(event.currentTarget);
  (<any>$('.root-slider')).myPlugin('value', target.val());
});



(<any>$('.root-slider1')).myPlugin({
  slide : function (num : number) {
    $('.root-input1').val(num);
  }
});

$('.root-input1').val((<any>$('.root-slider1')).myPlugin('value'));

$('.root-input1').on('change', function (event) {
  let target = $(event.currentTarget);
  (<any>$('.root-slider1')).myPlugin('value', target.val());
});



(<any>$('.root-slider2')).myPlugin({
  slide : function (num : number) {
    $('.root-input2').val(num);
  }
});

$('.root-input2').val((<any>$('.root-slider2')).myPlugin('value'));

$('.root-input2').on('change', function (event) {
  let target = $(event.currentTarget);
  (<any>$('.root-slider2')).myPlugin('value', target.val());
});



(<any>$('.root-slider3')).myPlugin({
  slide : function (num : number) {
    $('.root-input3').val(num);
  }
});

$('.root-input3').val((<any>$('.root-slider3')).myPlugin('value'));

$('.root-input3').on('change', function (event) {
  let target = $(event.currentTarget);
  (<any>$('.root-slider3')).myPlugin('value', target.val());
});

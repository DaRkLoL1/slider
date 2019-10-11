import './index.scss';
import './Slider.ts';

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

import './index.scss';
import './Slider.ts';

$('.configure__button').on('click', (event) => {
  const $parent = $(event.currentTarget).parent();

  interface IObj {
    min ?: number;
    max ?: number;
    step ?: number;
    interval ?: boolean;
    tooltip ?: boolean;
    position ?: string;
    value ?: number;
    slide(num: number): void;
  }

  const obj: IObj = {
    slide(num) {
      $parent.find('.configure__input').val(num);
    },
  };

  const value = $parent.find('.configure__input').val();

  if (value && typeof value === 'string') {
    obj.value = Number.parseInt(value, 10);
  }

  const min = $parent.find('.configure__min').val();

  if (min && typeof min === 'string') {
    obj.min = Number.parseInt(min, 10);
  }

  const max = $parent.find('.configure__max').val();

  if (max && typeof max === 'string') {
    obj.max = Number.parseInt(max, 10);
  }

  const step = $parent.find('.configure__step').val();

  if (step && typeof step === 'string') {
    obj.step = Number.parseInt(step, 10);
  }

  if ($parent.find('.configure__tooltip').prop('checked')) {
    obj.tooltip = true;
  }

  if ($parent.find('.configure__interval').prop('checked')) {
    obj.interval = true;
  }

  if ($parent.find('.configure__position').prop('checked')) {
    obj.position = 'vertical';
  }
  ($($parent.parent().children()[0]) as any).myPlugin(obj);
});

($('.root-slider') as any).myPlugin({
  slide(num: number) {
    $('.root-input').val(num);
  },
});

$('.root-input').val(($('.root-slider') as any).myPlugin('value'));

$('.root-input').on('change', (event) => {
  const $target = $(event.currentTarget);
  ($('.root-slider') as any).myPlugin('value', $target.val());
});

($('.root-slider1') as any).myPlugin({
  slide(num: number) {
    $('.root-input1').val(num);
  },
});

$('.root-input1').val(($('.root-slider1') as any).myPlugin('value'));

$('.root-input1').on('change',  (event) => {
  const $target = $(event.currentTarget);
  ($('.root-slider1') as any).myPlugin('value', $target.val());
});

($('.root-slider2') as any).myPlugin({
  slide(num: number) {
    $('.root-input2').val(num);
  },
});

$('.root-input2').val(($('.root-slider2') as any).myPlugin('value'));

$('.root-input2').on('change', (event) => {
  const $target = $(event.currentTarget);
  ($('.root-slider2') as any).myPlugin('value', $target.val());
});

($('.root-slider3') as any).myPlugin({
  slide(num: number) {
    $('.root-input3').val(num);
  },
});

$('.root-input3').val(($('.root-slider3') as any).myPlugin('value'));

$('.root-input3').on('change', (event) => {
  const $target = $(event.currentTarget);
  ($('.root-slider3') as any).myPlugin('value', $target.val());
});

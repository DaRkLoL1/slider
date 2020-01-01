import './index.scss';
import './Slider.ts';

$('.configure__button').on('click', (event) => {
  const $parent = $(event.currentTarget).parent();

  interface IObj {
    min ?: number;
    max ?: number;
    step ?: number;
    range ?: number;
    tooltip ?: boolean;
    position ?: string;
    value ?: number[];
    slide(num: number[]): void;
  }

  const obj: IObj = {
    slide(num: number[]) {
      if (num.length > 1 ) {
        $parent.find('.root-input1').val(num[0]);
        $parent.find('.root-input2').val(num[1]);
      } else {
        $parent.find('.root-input1').val(num[0]);
      }
    },
  };

  const value = $parent.find('.configure__input').val();

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

  const range = $parent.find('.configure__range').val();

  if (range && typeof range === 'string') {
    obj.range = Number.parseInt(range, 10);
  }
  if (value) {
    if (obj.range === 2) {
      
        const value1 = $parent.find('.root-input1').val();
        const value2 = $parent.find('.root-input2').val();
        if (typeof value1 === 'string' && typeof value2 === 'string') {
          obj.value = [Number.parseInt(value1, 10), Number.parseInt(value2, 10)];
          console.log(obj.value)
        }
      } else  {
        const value1 = $parent.find('.root-input1').val();
        if (typeof value1 === 'string') {
          obj.value = [Number.parseInt(value1, 10)];
        }
      }
  }
  if ($parent.find('.configure__tooltip').prop('checked')) {
    obj.tooltip = true;
  }

  if ($parent.find('.configure__position').prop('checked')) {
    obj.position = 'vertical';
  }
  ($($parent.parent().children()[0]) as any).myPlugin(obj);
});

let options = ($('.root-slider') as any).myPlugin({
  slide(num: number[]) {
    $('.root-input1').val(num[0]);
    $('.root-input2').val(num[1]);
  },
  max: 200,
  min: 10,
  range: 2,
  step: 10,
  tooltip: true,
  value: [10, 50],
});

$('.root-input1').val(($('.root-slider') as any).myPlugin('value')[0]);
$('.root-input2').val(($('.root-slider') as any).myPlugin('value')[1]);

$('.root-input1').on('change', (event) => {
  const $target = $(event.currentTarget);
  let value1 = $target.val();
  if (typeof value1 === 'string') {
    value1 = Number.parseInt( value1, 10);
  }
  let value2 = $('.root-input2').val();
  if (typeof value2 === 'string') {
    value2 = Number.parseInt( value2, 10);
  }
  ($('.root-slider') as any).myPlugin('value', [value1, value2]);
});

$('.root-input2').on('change', (event) => {
  const $target = $(event.currentTarget);
  let value2 = $target.val();
  if (typeof value2 === 'string') {
    value2 = Number.parseInt( value2, 10);
  }
  let value1 = $('.root-input1').val();
  if (typeof value1 === 'string') {
    value1 = Number.parseInt( value1, 10);
  }
  ($('.root-slider') as any).myPlugin('value', [value1, value2]);
});

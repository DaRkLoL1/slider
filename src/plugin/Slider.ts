import { Model } from './model/Model';
import { Prezenter } from './prezenter/Prezenter';
import { View } from './view/View';

(function( $ ) {
  let sliderIndex = 0;

  const def = {
    max: 100,
    min: 0,
    position: 'horizontal',
    range: false,
    step: 25,
    tooltip: false,
    values: [0],
  };

  ($.fn as any).myPlugin = function(method: {} | string) {

    const methods = {
      init($slider: JQuery<HTMLElement>, params: {}) {
        interface IOptions {
          max: number;
          min: number;
          position: string;
          range: boolean;
          step: number;
          tooltip: boolean;
          values: number[];
        }

        const options: IOptions = $.extend({}, def, params);
        $slider.data('model', new Model(options));
        $slider.data('view', new View($slider, sliderIndex));

        options.min = $slider.data('model').getMin();
        options.max = $slider.data('model').getMax();
        options.step = $slider.data('model').getStep();
        options.values = $slider.data('model').getValue();

        $slider.data('view').createSlider(options);
        $slider.data('prezenter', new Prezenter($slider.data('model'), $slider.data('view')));
        $slider.data('options', options);

        sliderIndex += 1;

        return $slider;
      },

      value($slider: JQuery<HTMLElement>, values: number[]) {
        if (typeof values === 'undefined') {
          return $slider.data('model').getValue();
        } else {
          $slider.data('prezenter').setValues(values);
          return this;
        }
      },
    };

    if (typeof method === 'string' && (method === 'value') ) {
      return methods[method].call(this, this, arguments[1]);
    }
    if ( typeof method === 'object' || !method ) {
      return methods.init(this, method);
    }
  };
})(jQuery);

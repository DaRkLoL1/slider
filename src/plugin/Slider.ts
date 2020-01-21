import { Prezenter } from './prezenter/Prezenter';

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
      init(slider: JQuery<HTMLElement>, params: {}) {
        const options = $.extend({}, def, params);
        slider.data('prezenter', new Prezenter(sliderIndex, slider, options));
        options.min = slider.data('prezenter').model.getMin();
        options.max = slider.data('prezenter').model.getMax();
        options.step = slider.data('prezenter').model.getStep();
        slider.data('options', options);
        sliderIndex += 1;
        return slider;
      },

      value(slider: JQuery<HTMLElement>, values: number[]) {
        if (typeof values === 'undefined') {
          return slider.data('prezenter').model.getValue();
        } else {
          slider.data('prezenter').set(values);
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

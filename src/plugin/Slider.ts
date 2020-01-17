import {Model} from './model/Model';
import {ModelHandle} from './model/ModelHandle';
import {Prezenter} from './prezenter/Prezenter';
import {View} from './view/View';

(function( $ ) {
  const def = {
    max: 100,
    min: 0,
    position: 'horizontal',
    range: false,
    step: 25,
    tooltip: false,
    value: [0],
    slide(num: number): void {}
  };

  ($.fn as any).myPlugin = function(method: {} | string) {

    const methods = {
      init(slider: JQuery<HTMLElement>, params: {}) {
        const options = $.extend({}, def, params);

        if (Number.isNaN(options.min)) {
          options.min = 0;
        }

        if (Number.isNaN(options.max)) {
          options.max = 0;
        }

        if (Number.isNaN(options.step) || options.step <= 0) {
          options.step = 1;
        }

        if (options.max <= options.min + options.step) {
          options.max = options.min + options.step;
        }

        slider.data('model', new Model({
          max: options.max,
          min: options.min,
          range: options.range,
          step: options.step,
          value: options.value,
        }));
        slider.data('view', new View(slider));
        slider.data('prazenter', new Prezenter(slider.data('view'), slider.data('model')));
        slider.data('prazenter').init(options);
        slider.data('prazenter').slide = options.slide;

        slider.data('options', options);
        return slider;
      },

      value(slider: JQuery<HTMLElement>, num: number[]) {
        if (typeof num === 'undefined') {
          return slider.data('model').getValue();
        } else {
          slider.data('prazenter').set(num);
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

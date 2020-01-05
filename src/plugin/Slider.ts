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
      init(that: JQuery<HTMLElement>, params: {}) {
        const options = $.extend({}, def, params);

        const handle: ModelHandle[] = [];
        if (options.range) {
          for (let i = 0; i < 2; i += 1) {
            handle.push(new ModelHandle(options.value[i]));
          }
        } else {
          handle.push(new ModelHandle(options.value[0]));
        }

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

        that.data('model', new Model({
          handle,
          max: options.max,
          min: options.min,
          step: options.step,
        }));
        that.data('view', new View(that));
        that.data('prazenter', new Prezenter(that.data('view'), that.data('model')));
        that.data('prazenter').init(options);
        that.data('prazenter').slide = options.slide;

        if (options.range) {
          that.data('model').setValue([options.value[0], options.value[1]]);
        } else {
          that.data('model').setValue([options.value[0]]);
        }

        that.data('options', options);
        return that;
      },

      value(that: JQuery<HTMLElement>, num: number[]) {
        if (typeof num === 'undefined') {
          return that.data('model').getValue();
        } else {
          that.data('prazenter').set(num);
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

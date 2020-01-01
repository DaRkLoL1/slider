import {Model} from './Model';
import {ModelHandle} from './ModelHandle';
import {Prezenter} from './Prezenter';
import {View} from './View';

(function( $ ) {
  const def = {
    interval: false,
    max: 100,
    min: 0,
    position: 'horizontal',
    range: 1,
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
        if (options.range > 2) {
          options.range = 2;
        }
        for (let i = 0; i < options.range; i += 1) {
          handle.push(new ModelHandle(options.value[i]));
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

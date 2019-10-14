import {MainModel} from './MainModel';
import {ModelHandle} from './ModelHandle';
import {Prezenter} from './Prezenter';
import {View} from './View';

(function( $ ) {
  const def = {
    interval: false,
    max: 100,
    min: 0,
    position: 'horisontal',
    step: 25,
    tooltip: false,
    value: 0,
    slide(num: number): void {}
  };

  ($.fn as any).myPlugin = function(method: {} | string) {

    const methods = {
      init(that: JQuery<HTMLElement>, params: {}) {
        const options = $.extend({}, def, params);

        that.data('model', new MainModel({
          handle: new ModelHandle(options.value),
          max: options.max,
          min: options.min,
          step: options.step,
        }));
        that.data('view', new View(that));
        that.data('prazenter', new Prezenter(that.data('view'), that.data('model')));
        that.data('prazenter').init(options);
        that.data('prazenter').slide = options.slide;

        return this;
      },

      value(that: JQuery<HTMLElement>, num: string) {
        if (typeof num === 'undefined') {
          return that.data('model').getValue();
        } else {
          that.data('prazenter').updateView(num);
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

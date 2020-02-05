import { Prezenter } from './prezenter/Prezenter';

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
        $slider.data('prezenter', new Prezenter($slider, options));
        $slider.data('options', {...options, ...$slider.data('prezenter').getModelOptions()});

        return $slider;
      },

      value($slider: JQuery<HTMLElement>, values: number[]) {
        if (typeof values === 'undefined') {
          return $slider.data('prezenter').getValues();
        } else {
          $slider.data('prezenter').setValues(values);
          return this;
        }
      },

      slide($slider: JQuery<HTMLElement>, func: (values: number[]) => void) {
        $slider.data('prezenter').addSubscribers('changeModel', func);
        if (typeof func === 'undefined') {
          return this
        } else {
          $slider.data('prezenter').addSubscribers('changeModel', func);
          return this;
        }
      }
    };

    if (typeof method === 'string' && (method === 'value')) {
      return methods[method].call(this, this, arguments[1]);
    }

    if (typeof method === 'string' && (method === 'slide')) {
      methods[method].call(this, this, arguments[1]);
    }

    if ( typeof method === 'object' || !method ) {
      return methods.init(this, method);
    }
  };

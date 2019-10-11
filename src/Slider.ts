import {MainModel} from './MainModel';
import {View} from './View';
import {Prezenter} from './Prezenter';
import {ModelHandle} from './ModelHandle';

(function( $ ) {
  
  let def = {
    min: 0,
    max: 100,
    step: 25,
    value: 0, 
    tooltip: false,
    interval: false,
    position: 'horisontal',
    slide : function(num : number) {
    }
  };

  (<any>$.fn).myPlugin = function(method : {} | string) {
     

  let methods = {
    init : function( that : JQuery<HTMLElement>,params : {} ) { 
      
      let options = $.extend({}, def, params);

      that.data('model', new MainModel({min: options.min, max: options.max, step: options.step, handle: new ModelHandle(options.value) }) );
      that.data('view', new View(that) );

      that.data('prazenter', new Prezenter(that.data('view'), that.data('model') ) );
      that.data('prazenter').init(options);
      that.data('prazenter').slide = options.slide;

      return this;
    },

    value (that : JQuery<HTMLElement>, num : string) {
      if(typeof num === 'undefined') {
        return that.data('model').getValue();
      } else {
        that.data('prazenter').updateView(num);
        return this;
      }
    }

  };

  if(typeof method === 'string' && (method === 'value') ) {
      
    return methods[method].call(this, this, arguments[1]);
     
   } else if ( typeof method === 'object' || !method ) {
     return methods.init(this, method);
   }
  
  }
})( jQuery );
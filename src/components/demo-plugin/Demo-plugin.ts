import autobind from 'autobind-decorator';
import '../../plugin/Slider';
import { ToolbarOptions } from '../toolbar-options/Toolbar-options';

@autobind
class DemoPlugin {
  private $demoPlugin: JQuery<HTMLElement>;
  private toolbarOptions: ToolbarOptions;
  private $slider: JQuery<HTMLElement>;
  private options: {
    min?: number,
    max?: number,
    step?: number,
    position?: string,
    range?: boolean,
    tooltip?: boolean,
    values?: number[],
  };

  constructor($demoPlugin: JQuery<HTMLElement>, index: number) {
    this.$demoPlugin = $demoPlugin;
    this.toolbarOptions = new ToolbarOptions(this.$demoPlugin.find('.js-toolbar-options'), index);
    this.$slider = this.$demoPlugin.find('.js-demo-plugin__slider');
    this.options = $demoPlugin.data('options');
    this.init();
    this.subscribeOnEvent();
  }

  private init() {
    interface IOptions {
      min: number;
      max: number;
      step: number;
      position: string;
      range: boolean;
      tooltip: boolean;
      values: number[];
    }

    const options: IOptions = (this.$slider as any).myPlugin(this.options).data('options');
    this.toolbarOptions.subscribeOnEvent(this.$slider);
    this.toolbarOptions.setValuesInOptions(options);
  }

  private setValues(values: number[]): void {
    (this.$slider as any).myPlugin('value', values);
  }

  private setOptions(options: {
    min?: number,
    max?: number,
    step?: number,
    position?: string,
    range?: boolean,
    tooltip?: boolean,
    values?: number[],
  }) {
    this.options = options;
    this.init();
  }

  private subscribeOnEvent() {
    this.toolbarOptions.addSubscribers('updateStartAndEndValue', this.setValues);
    this.toolbarOptions.addSubscribers('updateOptions', this.setOptions);
  }
}

export { DemoPlugin };

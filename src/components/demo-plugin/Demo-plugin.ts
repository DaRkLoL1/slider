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
    slide?(values: number[]): void,
  };

  constructor($demoPlugin: JQuery<HTMLElement>, index: number) {
    this.$demoPlugin = $demoPlugin;
    this.toolbarOptions = new ToolbarOptions(this.$demoPlugin.find('.js-toolbar-options'), index);
    this.$slider = this.$demoPlugin.find('.js-demo-plugin__slider');
    this.options = $demoPlugin.data('options');
    this.init();
    this.subscribeOnEvent();
  }

  public init() {
    interface IOptions {
      min: number;
      max: number;
      step: number;
      position: string;
      range: boolean;
      tooltip: boolean;
      values: number[];
      slide?(values: number[]): void;
    }

    this.options.slide = this.toolbarOptions.getFunctionSlide;
    const options: IOptions = (this.$slider as any).myPlugin(this.options).data('options');
    this.toolbarOptions.setValuesInOptions(options);
  }

  public setValues(values: number[]): void {
    (this.$slider as any).myPlugin('value', values);
  }

  public setOptions(options: {
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

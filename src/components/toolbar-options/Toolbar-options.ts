import autobind from 'autobind-decorator';
import { Observer } from '../../plugin/observer/Observer';

@autobind
class ToolbarOptions extends Observer {
  private $toolbarOptions: JQuery<HTMLElement>;
  private $startValue: JQuery<HTMLElement> | undefined;
  private $endValue: JQuery<HTMLElement> | undefined;
  private $min: JQuery<HTMLElement> | undefined;
  private $max: JQuery<HTMLElement> | undefined;
  private $step: JQuery<HTMLElement> | undefined;
  private $range: JQuery<HTMLElement> | undefined;
  private $tooltip: JQuery<HTMLElement> | undefined;
  private $position: JQuery<HTMLElement> | undefined;
  private index: number;

  constructor(toolbarOptions: JQuery<HTMLElement>, index: number) {
    super();
    this.$toolbarOptions = toolbarOptions;
    this.index = index;
    this.initOptions();
    this.addHandlesForValues();
  }

  public initOptions(): void {
    this.$startValue = this.$toolbarOptions.find('.js-toolbar-options__start-value');
    this.$endValue = this.$toolbarOptions.find('.js-toolbar-options__end-value');
    this.$min = this.$toolbarOptions.find('.js-toolbar-options__min');
    this.$max = this.$toolbarOptions.find('.js-toolbar-options__max');
    this.$step = this.$toolbarOptions.find('.js-toolbar-options__step');
    this.$range = this.$toolbarOptions.find('.js-toolbar-options__range');
    this.$tooltip = this.$toolbarOptions.find('.js-toolbar-options__tooltip');
    this.$position = this.$toolbarOptions.find('.js-toolbar-options__position');
  }

  public subscribeOnEvent($slider: JQuery<HTMLElement>) {
    $slider.data('prezenter').addSubscribers('changeModel', this.setValuesWhenSlidingThumb);
  }

  public setValuesWhenSlidingThumb(values: number[]): void {
    if (values.length > 1) {
      if (this.$startValue && this.$endValue) {
        this.$startValue.val(values[0]);
        this.$endValue.val(values[1]);
      }
    } else {
      if (this.$startValue) {
      this.$startValue.val(values[0]);
      }
    }
  }

  public setValuesInOptions(options: {
    min: number,
    max: number,
    step: number,
    range: boolean,
    tooltip: boolean,
    position: string,
    values: number[],
  }) {
    if (this.$min) {
      this.$min.val(options.min);
    }

    if (this.$max) {
      this.$max.val(options.max);
    }

    if (this.$step) {
      this.$step.val(options.step);
    }

    if (this.$range) {
      if (options.range) {
        this.$range.prop('checked', true);
      }
    }

    if (this.$tooltip) {
      if (options.tooltip) {
        this.$tooltip.prop('checked', true);
      }
    }

    if (this.$position) {
      if (options.position === 'vertical') {
        this.$position.prop('checked', true);
      }
    }

    if (this.$startValue && this.$endValue) {
      if (options.values.length > 1) {
        this.$startValue.val(options.values[0]);
        this.$endValue.val(options.values[1]);
      } else {
        this.$startValue.val(options.values[0]);
      }
    }
  }

  private addHandlesForValues(): void {
    if (this.$startValue && this.$endValue) {
      this.$startValue.on(`change.startValue${this.index}`, this.handleValueChange);
      this.$endValue.on(`change.endValue${this.index}`, this.handleValueChange);
    }

    if (this.$min) {
      this.$min.on(`change.min${this.index}`, this.handleOptionsChange);
    }

    if (this.$max) {
      this.$max.on(`change.max${this.index}`, this.handleOptionsChange);
    }

    if (this.$step) {
      this.$step.on(`change.step${this.index}`, this.handleOptionsChange);
    }

    if (this.$range) {
      this.$range.on(`change.range${this.index}`, this.handleOptionsChange);
    }

    if (this.$tooltip) {
      this.$tooltip.on(`change.tooltip${this.index}`, this.handleOptionsChange);
    }

    if (this.$position) {
      this.$position.on(`change.position${this.index}`, this.handleOptionsChange);
    }
  }

  private handleValueChange(): void {
    if (this.$startValue && this.$endValue) {
      const startValue = this.$startValue.val();
      const endValue2 = this.$endValue.val();

      if (typeof startValue === 'string' && typeof endValue2 === 'string') {
        const values: number[] = [
          Math.floor(Number.parseFloat(startValue)),
          Math.floor(Number.parseFloat(endValue2)),
        ];

        this.notifySubscribers('updateStartAndEndValue', values);
      }
    }
  }

  private handleOptionsChange(): void {
    this.notifySubscribers('updateOptions', this.getValuesInOptions());
  }

  private getValuesInOptions() {
    interface IOptions {
      min?: number;
      max?: number;
      step?: number;
      range?: boolean;
      position?: string;
      tooltip?: boolean;
      values?: number[];
    }

    const options: IOptions = {};
    options.values = this.getStartAndEndValues();
    options.min = this.getMinValue();
    options.max = this.getMaxValue();
    options.step = this.getStepValue();
    options.range = this.getRangeValue();
    options.tooltip = this.getTooltipValue();
    options.position = this.getPositionValue();
    return options;
  }

  private getStartAndEndValues(): number[] | undefined {
    if (this.$startValue && this.$endValue) {
      const startValue = this.$startValue.val();
      const endValue2 = this.$endValue.val();

      if (typeof startValue === 'string' && typeof endValue2 === 'string') {
        return [
          Math.floor(Number.parseFloat(startValue)),
          Math.floor(Number.parseFloat(endValue2)),
        ];
      }
    }
  }

  private getMinValue(): number | undefined {
    if (this.$min) {
      const min = this.$min.val();

      if (typeof min === 'string') {
        return Math.floor(Number.parseFloat(min));
      }
    }
  }

  private getMaxValue(): number | undefined {
    if (this.$max) {
      const max = this.$max.val();

      if (typeof max === 'string') {
        return Math.floor(Number.parseFloat(max));
      }
    }
  }

  private getStepValue(): number | undefined {
    if (this.$step) {
      const step = this.$step.val();

      if (typeof step === 'string') {
        return Math.floor(Number.parseFloat(step));
      }
    }
  }

  private getRangeValue(): boolean | undefined {
    if (this.$range) {
      return this.$range.prop('checked');
    }
  }

  private getTooltipValue(): boolean | undefined {
    if (this.$tooltip) {
      return this.$tooltip.prop('checked');
    }
  }

  private getPositionValue(): string | undefined {
    if (this.$position) {
      const position = this.$position.prop('checked');

      if (position) {
        return 'vertical';
      } else {
        return 'horizontal';
      }
    }
  }
}

export { ToolbarOptions };

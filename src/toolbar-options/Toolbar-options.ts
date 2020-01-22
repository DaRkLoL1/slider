import '../plugin/Slider.ts';

class ToolbarOptions {
  private $toolbarOptions: JQuery<HTMLElement>;
  private $startValue: JQuery<HTMLElement> | undefined;
  private $endValue: JQuery<HTMLElement> | undefined;
  private $slider: JQuery<HTMLElement> | undefined;
  private $min: JQuery<HTMLElement> | undefined;
  private $max: JQuery<HTMLElement> | undefined;
  private $step: JQuery<HTMLElement> | undefined;
  private $range: JQuery<HTMLElement> | undefined;
  private $tooltip: JQuery<HTMLElement> | undefined;
  private $position: JQuery<HTMLElement> | undefined;
  private index: number;

  private options: {
    min: number,
    max: number,
    step: number,
    position: string,
    range: boolean,
    tooltip: boolean,
    values: number[],
    slide(values: number[]): void,
  };

  constructor(toolbarOptions: JQuery<HTMLElement>, index: number) {
    this.$toolbarOptions = toolbarOptions;
    this.index = index;
    this.options = toolbarOptions.data('options');
    this.initSlider();
  }

  private initSlider(): void {
    this.$startValue = this.$toolbarOptions.find('.js-toolbar-options__start-value');
    this.$endValue = this.$toolbarOptions.find('.js-toolbar-options__end-value');
    this.$slider = this.$toolbarOptions.find('.js-toolbar-options__slider');
    this.$min = this.$toolbarOptions.find('.js-toolbar-options__min');
    this.$max = this.$toolbarOptions.find('.js-toolbar-options__max');
    this.$step = this.$toolbarOptions.find('.js-toolbar-options__step');
    this.$range = this.$toolbarOptions.find('.js-toolbar-options__range');
    this.$tooltip = this.$toolbarOptions.find('.js-toolbar-options__tooltip');
    this.$position = this.$toolbarOptions.find('.js-toolbar-options__position');

    this.options.slide = (values: number[]): void => {
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
    };

    this.createSlider();
    this.addHandlesForValues();
  }

  private createSlider() {
    if (this.$slider) {
      this.options = (this.$slider as any).myPlugin(this.options).data('options');
    }

    this.initPanel();
  }

  private initPanel() {
    if (this.$min) {
      this.$min.val(this.options.min);
    }

    if (this.$max) {
      this.$max.val(this.options.max);
    }

    if (this.$step) {
      this.$step.val(this.options.step);
    }

    if (this.$range) {
      if (this.options.range) {
        this.$range.prop('checked', true);
      }
    }

    if (this.$tooltip) {
      if (this.options.tooltip) {
        this.$tooltip.prop('checked', true);
      }
    }

    if (this.$position) {
      if (this.options.position === 'vertical') {
        this.$position.prop('checked', true);
      }
    }

    if (this.$startValue && this.$endValue && this.$slider) {
      const sliderValues = (this.$slider as any).myPlugin('value');

      if (sliderValues.length > 1) {
        this.$startValue.val(sliderValues[0]);
        this.$endValue.val(sliderValues[1]);
      } else {
        this.$startValue.val(sliderValues[0]);
      }
    }
  }

  private addHandlesForValues(): void {
    if (this.$startValue && this.$endValue) {
      this.$startValue.on(`change.startValue${this.index}`, this.handleValueChange.bind(this));
      this.$endValue.on(`change.endValue${this.index}`, this.handleValueChange.bind(this));
    }

    if (this.$min) {
      this.$min.on(`change.min${this.index}`, this.handleMinChange.bind(this));
    }

    if (this.$max) {
      this.$max.on(`change.max${this.index}`, this.handleMaxChange.bind(this));
    }

    if (this.$step) {
      this.$step.on(`change.step${this.index}`, this.handleStepChange.bind(this));
    }

    if (this.$range) {
      this.$range.on(`change.range${this.index}`, this.handleRangeChange.bind(this));
    }

    if (this.$tooltip) {
      this.$tooltip.on(`change.tooltip${this.index}`, this.handleTooltipChange.bind(this));
    }

    if (this.$position) {
      this.$position.on(`change.position${this.index}`, this.handlePositionChange.bind(this));
    }
  }

  private handleValueChange() {
    if (this.$startValue && this.$endValue) {
      const startValue = this.$startValue.val();
      const endValue2 = this.$endValue.val();

      if (typeof startValue === 'string' && typeof endValue2 === 'string') {
        (this.$slider as any).myPlugin(
          'value',
          [
            Math.floor(Number.parseFloat(startValue)),
            Math.floor(Number.parseFloat(endValue2)),
          ],
        );
      }
    }
  }

  private updateValueInOptions() {
    if (this.$startValue && this.$endValue) {
      const startValue = this.$startValue.val();
      const endValue2 = this.$endValue.val();

      if (typeof startValue === 'string' && typeof endValue2 === 'string') {
        this.options.values = [
          Math.floor(Number.parseFloat(startValue)),
          Math.floor(Number.parseFloat(endValue2)),
        ];
      }
    }
  }

  private handleMinChange() {
    if (this.$min) {
      const min = this.$min.val();

      if (typeof min === 'string') {
        this.options.min = Math.floor(Number.parseFloat(min));
      }
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handleMaxChange() {
    if (this.$max) {
      const max = this.$max.val();

      if (typeof max === 'string') {
        this.options.max = Math.floor(Number.parseFloat(max));
      }
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handleStepChange() {
    if (this.$step) {
      const step = this.$step.val();

      if (typeof step === 'string') {
        this.options.step = Math.floor(Number.parseFloat(step));
      }
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handleRangeChange() {
    if (this.$range) {
      this.options.range = this.$range.prop('checked');
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handleTooltipChange() {
    if (this.$tooltip) {
      this.options.tooltip = this.$tooltip.prop('checked');
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handlePositionChange() {
    if (this.$position) {
      const position = this.$position.prop('checked');

      if (position) {
        this.options.position = 'vertical';
      } else {
        this.options.position = 'horizontal';
      }
    }

    this.updateValueInOptions();
    this.createSlider();
  }
}

export { ToolbarOptions };

import '../plugin/Slider.ts';

class RangeSlider {
  private $rangeSlider: JQuery<HTMLElement>;
  private $startValue: JQuery<HTMLElement> | undefined;
  private $endValue: JQuery<HTMLElement> | undefined;
  private $slider: JQuery<HTMLElement> | undefined;
  private $min: JQuery<HTMLElement> | undefined;
  private $max: JQuery<HTMLElement> | undefined;
  private $step: JQuery<HTMLElement> | undefined;
  private $range: JQuery<HTMLElement> | undefined;
  private $tooltip: JQuery<HTMLElement> | undefined;
  private $position: JQuery<HTMLElement> | undefined;

  private options: {
    min: number,
    max: number,
    step: number,
    position: string,
    range: boolean,
    tooltip: boolean,
    value: number[],
    slide(num: number[]): void,
  };

  constructor(rangeSlider: JQuery<HTMLElement>) {
    this.$rangeSlider = rangeSlider;
    this.options = rangeSlider.data('options');
    this.initSlider();
  }

  private initSlider(): void {
    this.$startValue = this.$rangeSlider.find('.js-range-slider__start-value');
    this.$endValue = this.$rangeSlider.find('.js-range-slider__end-value');
    this.$slider = this.$rangeSlider.find('.js-range-slider__slider');
    this.$min = this.$rangeSlider.find('.js-range-slider__min');
    this.$max = this.$rangeSlider.find('.js-range-slider__max');
    this.$step = this.$rangeSlider.find('.js-range-slider__step');
    this.$range = this.$rangeSlider.find('.js-range-slider__range');
    this.$tooltip = this.$rangeSlider.find('.js-range-slider__tooltip');
    this.$position = this.$rangeSlider.find('.js-range-slider__position');

    this.options.slide = (num: number[]): void => {
      if (num.length > 1) {
        if (this.$startValue && this.$endValue) {
          this.$startValue.val(num[0]);
          this.$endValue.val(num[1]);
        }
      } else {
        if (this.$startValue) {
          this.$startValue.val(num[0]);
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
      this.$startValue.on('change', this.handleValueChange.bind(this));
      this.$endValue.on('change', this.handleValueChange.bind(this));
    }

    if (this.$min) {
      this.$min.on('change', this.handleMinChange.bind(this));
    }

    if (this.$max) {
      this.$max.on('change', this.handleMaxChange.bind(this));
    }

    if (this.$step) {
      this.$step.on('change', this.handleStepChange.bind(this));
    }

    if (this.$range) {
      this.$range.on('change', this.handleRangeChange.bind(this));
    }

    if (this.$tooltip) {
      this.$tooltip.on('change', this.handleTooltipChange.bind(this));
    }

    if (this.$position) {
      this.$position.on('change', this.handlePositionChange.bind(this));
    }
  }

  private handleValueChange() {
    if (this.$startValue && this.$endValue) {
      const startValue = this.$startValue.val();
      const endValue2 = this.$endValue.val();

      if (typeof startValue === 'string' && typeof endValue2 === 'string') {
        (this.$slider as any).myPlugin('value', [Number.parseInt(startValue, 10), Number.parseInt(endValue2, 10)]);
      }
    }
  }

  private updateValueInOptions() {
    if (this.$startValue && this.$endValue) {
      const startValue = this.$startValue.val();
      const endValue2 = this.$endValue.val();

      if (typeof startValue === 'string' && typeof endValue2 === 'string') {
        this.options.value = [Number.parseInt(startValue, 10), Number.parseInt(endValue2, 10)];
      }
    }
  }

  private handleMinChange() {
    if (this.$min) {
      const min = this.$min.val();

      if (typeof min === 'string') {
        this.options.min = Number.parseInt(min, 10);
      }
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handleMaxChange() {
    if (this.$max) {
      const max = this.$max.val();

      if (typeof max === 'string') {
        this.options.max = Number.parseInt(max, 10);
      }
    }

    this.updateValueInOptions();
    this.createSlider();
  }

  private handleStepChange() {
    if (this.$step) {
      const step = this.$step.val();

      if (typeof step === 'string') {
        this.options.step = Number.parseInt(step, 10);
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

export { RangeSlider };

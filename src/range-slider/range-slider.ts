import '../Slider.ts';

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
  private $button: JQuery<HTMLElement> | undefined;

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
    this.$button = this.$rangeSlider.find('.js-range-slider__button');

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
  }

  private addHandlesForValues(): void {
    if (this.$startValue && this.$endValue) {
      this.$startValue.on('change', this.handleValueChange.bind(this));
      this.$endValue.on('change', this.handleValueChange.bind(this));
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
}

const slider = $('.js-range-slider');
if (slider) {
  new RangeSlider(slider);
}

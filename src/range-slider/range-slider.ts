import '../Slider.ts';

class RangeSlider {
  private $rangeSlider: JQuery<HTMLElement>;
  private startValue: JQuery<HTMLElement> | undefined;
  private endValue: JQuery<HTMLElement> | undefined;
  private slider: JQuery<HTMLElement> | undefined;
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
    this.createSlider();
  }

  private createSlider() {
    this.startValue = this.$rangeSlider.find('.js-range-slider__start-value');
    this.endValue = this.$rangeSlider.find('.js-range-slider__end-value');

    this.options.slide = (num: number[]): void => {
      if (num.length > 1) {
        if (this.startValue && this.endValue) {
          this.startValue.val(num[0]);
          this.endValue.val(num[1]);
        }
      } else {
        if (this.startValue) {
          this.startValue.val(num[0]);
        }
      }
    };

    this.slider = this.$rangeSlider.find('.js-range-slider__slider');

    if (this.slider) {
      this.options = (this.slider as any).myPlugin(this.options);
    }
  }
}

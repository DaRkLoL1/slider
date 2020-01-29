import { Observer } from '../observer/Observer';
import { ViewThumb } from './View-thumb';
import { ViewTooltip } from './View-tooltip';

class View extends Observer {
  private $item: JQuery<HTMLElement>;
  private sliderIndex: number;
  private interval: number | undefined;
  private thumb: ViewThumb[] = [];
  private tooltip: ViewTooltip[] = [];
  private position: string | undefined;

  constructor($item: JQuery<HTMLElement>, sliderIndex: number) {
    super();
    this.$item = $item;
    this.sliderIndex = sliderIndex;
  }

  public createSlider(obj: {
    min: number,
    max: number,
    step: number,
    values: number[],
    tooltip: boolean,
    range: boolean,
    position: string}): void {
    this.position = obj.position;

    let width: number | undefined;
    if (this.position === 'vertical') {
      this.$item.html('<div class="slider slider_vertical"><div class="slider__field js-slider__field slider__field_vertical"></div></div>');
      width  = this.$item.height();
    } else {
      this.$item.html('<div class="slider"><div class="slider__field js-slider__field"></div></div>');
      width  = this.$item.width();
    }

    if (typeof width === 'number') {
      this.createSliderThumbs(width, obj);

      if (obj.tooltip) {
        this.createSliderTooltips(width, obj);
      }

      if (obj.range) {
        this.checkPositionThumb(width);
      }
    }
  }

  public createSliderThumbs(width: number, obj: {
    max: number,
    min: number,
    range: boolean,
    step: number,
    values: number[],
  }) {
    this.interval = width / (obj.max - obj.min) * obj.step;
    let index: number = 1;
    if (obj.range) {
      index = 2;
    }

    for (let count = 0; count < index; count += 1) {
      if (this.position === 'vertical') {
        this.$item.find('.js-slider__field')
          .append(
            '<div class="slider__thumb js-slider__thumb slider__thumb_vertical"></div>',
          );
        this.thumb[count] = new ViewThumb(
          this.$item.find('.js-slider__thumb').eq(count),
          count,
          this.sliderIndex,
        );
      } else {
        this.$item.find('.js-slider__field')
          .append('<div class="slider__thumb js-slider__thumb"></div>');
        this.thumb[count] = new ViewThumb(this.$item.find('.js-slider__thumb').eq(count), count, this.sliderIndex);
      }
      this.thumb[count].installValue( width / (obj.max - obj.min) * (obj.values[count] - obj.min), this.interval );
      this.thumb[count].addSubscribers('moveThumb', this.updateValue.bind(this));
    }
  }

  public createSliderTooltips(width: number, obj: {
    max: number,
    min: number,
    range: boolean,
    step: number,
    values: number[],
  }) {
    let index: number = 1;
    if (obj.range) {
      index = 2;
    }
    for (let count = 0; count < index; count += 1) {
      if (this.position === 'vertical') {
        this.$item.find('.js-slider__field')
          .append($('<div class="slider__tooltip slider__tooltip_vertical js-slider__tooltip"></div>'));
        this.tooltip[count] = new ViewTooltip($(this.$item.find('.js-slider__tooltip')[count]));
      } else {
        this.$item.find('.js-slider__field').append($('<div class="slider__tooltip js-slider__tooltip"></div>'));
        this.tooltip[count] = new ViewTooltip($(this.$item.find('.js-slider__tooltip')[count]));
      }

      this.tooltip[count].setTooltip(width / (obj.max - obj.min) * (obj.values[count] - obj.min), obj.values[count]);
    }
  }

  public checkPositionThumb(width: number) {
    let positionLeftThumb: number;
    const $field: JQuery<HTMLElement> = this.$item.find('.js-slider__field');
    const $leftThumb: JQuery<HTMLElement> = this.thumb[0].$thumb;

    if ($leftThumb.hasClass('slider__thumb_vertical')) {
      positionLeftThumb = $leftThumb.position().top;

      if (width - positionLeftThumb > positionLeftThumb) {
        this.addBack($field, $leftThumb);
      } else {
        this.addForward($field, $leftThumb);
      }
    } else {
      positionLeftThumb = $leftThumb.position().left;

      if (width - positionLeftThumb < positionLeftThumb) {
        this.addBack($field, $leftThumb);
      } else {
        this.addForward($field, $leftThumb);
      }
    }
  }

  public addBack($field: JQuery<HTMLElement>, $leftThumb: JQuery<HTMLElement>) {
    $field.append($leftThumb);

    if (this.tooltip.length > 0) {
      $field.append(this.tooltip[0].$tooltip);
    }
  }

  public addForward($field: JQuery<HTMLElement>, $leftThumb: JQuery<HTMLElement>) {
    $field.prepend($leftThumb);

    if (this.tooltip.length > 0) {
      $field.prepend(this.tooltip[0].$tooltip);
    }
  }

  public updateView(obj: {min: number, max: number, values: number[], step: number}): void {
    let width: number | undefined;

    if (this.position === 'vertical') {
      width = this.$item.height();
    } else {
      width = this.$item.width();
    }

    this.thumb.forEach((item, index) => {
      if (typeof width === 'number' && typeof this.thumb && typeof this.interval === 'number') {
        this.interval = width / (obj.max - obj.min) * obj.step;

        this.thumb[index].updateThumb( width / (obj.max - obj.min) * (obj.values[index] - obj.min), this.interval );

        if (this.tooltip.length > 0) {
          this.tooltip[index].setTooltip(width / (obj.max - obj.min) * (obj.values[index] - obj.min),
            obj.values[index]);
        }

        this.checkPositionThumb(width);
      }
    });
  }

  public updateValue(options: {symbolMinusOrPlus: string, counter: number, index: number}): void {
    this.notifySubscribers('changeView', options);
  }
}

export { View };

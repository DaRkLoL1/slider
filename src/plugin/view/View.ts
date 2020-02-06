import autobind from 'autobind-decorator';
import { Observer } from '../observer/Observer';
import { ViewThumb } from './View-thumb';
import { ViewTooltip } from './View-tooltip';

@autobind
class View extends Observer {
  private $item: JQuery<HTMLElement>;
  private interval: number | undefined;
  private thumb: ViewThumb[] = [];
  private tooltip: ViewTooltip[] = [];
  private position: string | undefined;

  constructor($item: JQuery<HTMLElement>) {
    super();
    this.$item = $item;
  }

  public createSlider({
    max = 100,
    min = 0,
    step = 10,
    values = [50],
    tooltip = false,
    range = false,
    position = 'horizontal'} = {}): void {
    this.position = position;

    let width: number | undefined;
    if (this.position === 'vertical') {
      this.$item.html('<div class="slider slider_vertical"><div class="slider__field js-slider__field slider__field_vertical"></div></div>');
      width  = this.$item.height();
    } else {
      this.$item.html('<div class="slider"><div class="slider__field js-slider__field"></div></div>');
      width  = this.$item.width();
    }

    if (typeof width === 'number') {
      this.createSliderThumbs(width, {max, min, range, step, values});

      if (tooltip) {
        this.createSliderTooltips(width, {max, min, range, step, values});
      }

      if (range) {
        this.checkPositionThumb(width);
      }
    }
  }

  public updateView({min = 0, max = 100, values = [50], step = 1} = {}): void {
    let width: number | undefined;

    if (this.position === 'vertical') {
      width = this.$item.height();
    } else {
      width = this.$item.width();
    }

    this.thumb.forEach((item, index) => {
      if (typeof width === 'number' && typeof this.thumb && typeof this.interval === 'number') {
        this.interval = width / (max - min) * step;

        this.thumb[index].updateThumb( width / (max - min) * (values[index] - min), this.interval );

        if (this.tooltip.length > 0) {
          this.tooltip[index].setTooltip(width / (max - min) * (values[index] - min), values[index]);
        }

        this.checkPositionThumb(width);
      }
    });
  }

  private createSliderThumbs(width: number, {
    max = 100,
    min = 0,
    range = false,
    step = 10,
    values = [50],
  } = {}) {
    this.interval = width / (max - min) * step;
    let index: number = 1;
    if (range) {
      index = 2;
    }

    for (let count = 0; count < index; count += 1) {
      if (this.position === 'vertical') {
        this.$item.find('.js-slider__field')
          .append(
            '<div class="slider__thumb js-slider__thumb slider__thumb_vertical"></div>',
          );
        this.thumb[count] = new ViewThumb(this.$item.find('.js-slider__thumb').eq(count), count);
      } else {
        this.$item.find('.js-slider__field')
          .append('<div class="slider__thumb js-slider__thumb"></div>');
        this.thumb[count] = new ViewThumb(this.$item.find('.js-slider__thumb').eq(count), count);
      }
      this.thumb[count].installValue( width / (max - min) * (values[count] - min), this.interval );
      this.thumb[count].addSubscribers('moveThumb', this.updateValue);
    }
  }

  private createSliderTooltips(width: number, {
    max = 100,
    min = 0,
    range = false,
    step = 10,
    values = [50],
  } = {}) {
    let index: number = 1;
    if (range) {
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

      this.tooltip[count].setTooltip(width / (max - min) * (values[count] - min), values[count]);
    }
  }

  private checkPositionThumb(width: number) {
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

  private addBack($field: JQuery<HTMLElement>, $leftThumb: JQuery<HTMLElement>) {
    $field.append($leftThumb);

    if (this.tooltip.length > 0) {
      $field.append(this.tooltip[0].$tooltip);
    }
  }

  private addForward($field: JQuery<HTMLElement>, $leftThumb: JQuery<HTMLElement>) {
    $field.prepend($leftThumb);

    if (this.tooltip.length > 0) {
      $field.prepend(this.tooltip[0].$tooltip);
    }
  }

  private updateValue(options: {symbolMinusOrPlus: string, counter: number, index: number}): void {
    this.notifySubscribers('changeView', options);
  }
}

export { View };

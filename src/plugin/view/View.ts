import { Observer } from '../observer/Observer';
import { ViewThumb } from './ViewThumb';
import { ViewTooltip } from './ViewTooltip';

class View extends Observer {
  private item: JQuery<HTMLElement>;
  private interval: number | undefined;
  private thumb: ViewThumb[] = [];
  private tooltip: ViewTooltip[] = [];
  private position: string | undefined;

  constructor(item: JQuery<HTMLElement>) {
    super();
    this.item = item;
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
      $(this.item).html('<div class="slider slider_vertical"><div class="slider__field slider__field_vertical"></div></div>');
      width  = $(this.item).height();
    } else {
      $(this.item).html('<div class="slider"><div class="slider__field"></div></div>');
      width  = $(this.item).width();
    }

    if (typeof width === 'number') {
      this.createSliderThumbs(width, obj);

      if (obj.tooltip) {
        this.createSliderTooltips(width, obj);
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
        $(this.item).find('.slider__field_vertical')
          .append('<div class="slider__thumb slider__thumb_vertical"></div>');
        this.thumb[count] = new ViewThumb($(this.item.find('.slider__thumb_vertical')[count]), count);
      } else {
        $(this.item).find('.slider__field')
          .append('<div class="slider__thumb"></div>');
        this.thumb[count] = new ViewThumb($(this.item.find('.slider__thumb')[count]), count);
      }
      this.thumb[count].installValue( width / (obj.max - obj.min) * (obj.values[count] - obj.min), this.interval );
      this.thumb[count].addSubscribers('moveThumb', this.updateView.bind(this));
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
        $(this.item).find('.slider__field_vertical')
          .append($('<div class="slider__tooltip slider__tooltip_vertical"></div>'));
        this.tooltip[count] = new ViewTooltip($(this.item.find('.slider__tooltip_vertical')[count]));
      } else {
        $(this.item).find('.slider__field').append($('<div class="slider__tooltip"></div>'));
        this.tooltip[count] = new ViewTooltip($(this.item.find('.slider__tooltip')[count]));
      }

      this.tooltip[count].setTooltip(width / (obj.max - obj.min) * (obj.values[count] - obj.min), obj.values[count]);
    }
  }

  public update(obj: {min: number, max: number, values: number[], step: number}): void {
    let width: number | undefined;

    if (this.position === 'vertical') {
      width = $(this.item).height();
    } else {
      width = $(this.item).width();
    }

    this.thumb.forEach((item, index) => {
      if (typeof width === 'number' && typeof this.thumb === 'object' && typeof this.interval === 'number') {
        this.interval = width / (obj.max - obj.min) * obj.step;

        this.thumb[index].update( width / (obj.max - obj.min) * (obj.values[index] - obj.min), this.interval );

        if (this.tooltip.length > 0) {
          this.tooltip[index].setTooltip(width / (obj.max - obj.min) * (obj.values[index] - obj.min),
            obj.values[index]);
        }
      }
    });
  }

  public updateView(options: {symbolMinusOrPlus: string, counter: number, index: number}): void {
    this.notifySubscribers('changeView', options);
  }
}

export { View };

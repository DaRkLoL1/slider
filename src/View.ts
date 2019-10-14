import {ViewScale} from './ViewScale';
import {ViewThumb} from './ViewThumb';
import {ViewTooltip} from './ViewTooltip';

interface ISubjectView {
  addObserverView(o: IObserverView): void;
  notifyObserverView(): void;
}

interface IObserverView {
  updateView(symbol: string): void;
}

export class View implements IObserverView, ISubjectView {
  private item: JQuery<HTMLElement>;
  private interval: number | undefined;
  private thumb: ViewThumb | undefined;
  private observer: IObserverView | undefined;
  private symbol: string | undefined;
  private tooltip: ViewTooltip | undefined;
  private scale: ViewScale | undefined;
  private position: string | undefined;

  constructor(item: JQuery<HTMLElement>) {
    this.item = item;
  }

  public createSlider(obj: {
    min: number,
    max: number,
    step: number,
    value: number,
    tooltip: boolean,
    interval: boolean,
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
      this.interval = width / (obj.max - obj.min) * obj.step;

      if (this.position === 'vertical') {
        $(this.item).find('.slider__field_vertical')
          .html('<div class="slider__line slider__line_vertical"></div><div class="slider__thumb slider__thumb_vertical"></div>');
        this.thumb = new ViewThumb(this.item.find('.slider__thumb_vertical'), this.item.find('.slider__line_vertical'));
      } else {
        $(this.item).find('.slider__field').html('<div class="slider__line"></div><div class="slider__thumb"></div>');
        this.thumb = new ViewThumb(this.item.find('.slider__thumb'), this.item.find('.slider__line'));
      }

      this.thumb.installValue( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );
      this.thumb.addObserverView(this);

      if (obj.tooltip) {
        if (this.position === 'vertical') {
          $(this.item).find('.slider__field_vertical')
            .prepend($('<div class="slider__tooltip slider__tooltip_vertical"></div>'));
          this.tooltip = new ViewTooltip(this.item.find('.slider__tooltip_vertical'));
        } else {
          $(this.item).find('.slider__field').prepend($('<div class="slider__tooltip"></div>'));
          this.tooltip = new ViewTooltip(this.item.find('.slider__tooltip'));
        }

        this.tooltip.setTooltip(width / (obj.max - obj.min) * (obj.value - obj.min), obj.value);
      }

      if (obj.interval) {
        if (this.position === 'vertical') {
          $(this.item).find('.slider_vertical')
            .append($('<div class="slider__numbers slider__numbers_vertical"></div>'));
          this.scale = new ViewScale(this.item.find('.slider__numbers_vertical'));
        } else {
          $(this.item).find('.slider').append($('<div class="slider__numbers"></div>'));
          this.scale = new ViewScale(this.item.find('.slider__numbers'));
        }
        this.scale.setNumbers({min: obj.min, max: obj.max, step: obj.step});
        this.scale.addObserverView(this);

      }
    }
  }

  public update(obj: {min: number, max: number, value: number, step: number}): void {
    let width: number | undefined;

    if (this.position === 'vertical') {
      width = $(this.item).height();
    } else {
      width = $(this.item).width();
    }

    if (typeof width === 'number' && typeof this.thumb === 'object' && typeof this.interval === 'number') {
      this.interval = width / (obj.max - obj.min) * obj.step;

      this.thumb.update( width / (obj.max - obj.min) * (obj.value - obj.min), this.interval );

      if (typeof this.tooltip === 'object') {
        this.tooltip.setTooltip(width / (obj.max - obj.min) * (obj.value - obj.min), obj.value);
      }
    }
  }

  public updateView(symbol: string): void {
    this.symbol = symbol;
    this.notifyObserverView();
  }

  public addObserverView(o: IObserverView): void {
    this.observer = o;
  }

  public notifyObserverView(): void {
    if (typeof this.observer !== 'undefined' && typeof this.symbol === 'string') {
      this.observer.updateView(this.symbol);
    }
  }
}

import {ViewThumb} from './ViewThumb';
import {ViewTooltip} from './ViewTooltip';

interface ISubjectViewControler {
  addObserverViewControler(o: IObserverViewControler): void;
  notifyObserverViewControler(): void;
}

interface IObserverViewControler {
  updateViewControler(symbol: string[]): void;
}

interface IObserverView {
  updateView(): void;
}

export class View implements IObserverView, ISubjectViewControler {
  private item: JQuery<HTMLElement>;
  private interval: number | undefined;
  private thumb: ViewThumb[] = [];
  private observer: IObserverViewControler | undefined;
  private symbol: string[] = [];
  private tooltip: ViewTooltip[] = [];
  private position: string | undefined;

  constructor(item: JQuery<HTMLElement>) {
    this.item = item;
  }

  public createSlider(obj: {
    min: number,
    max: number,
    step: number,
    value: number[],
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
      this.interval = width / (obj.max - obj.min) * obj.step;
      let index: number = 1;
      if (obj.range) {
        index = 2;
      }
      for (let i = 0; i < index; i += 1) {
        if (this.position === 'vertical') {
          $(this.item).find('.slider__field_vertical')
            .append('<div class="slider__thumb slider__thumb_vertical"></div>');
          this.thumb[i] = new ViewThumb($(this.item.find('.slider__thumb_vertical')[i]));
        } else {
          $(this.item).find('.slider__field')
            .append('<div class="slider__thumb"></div>');
          this.thumb[i] = new ViewThumb($(this.item.find('.slider__thumb')[i]));
        }
        this.thumb[i].installValue( width / (obj.max - obj.min) * (obj.value[i] - obj.min), this.interval );
        this.thumb[i].addObserverView(this);
      }

      if (obj.tooltip) {
        let index: number = 1;
        if (obj.range) {
          index = 2;
        }
        for (let i = 0; i < index; i += 1) {
          if (this.position === 'vertical') {
            $(this.item).find('.slider__field_vertical')
              .append($('<div class="slider__tooltip slider__tooltip_vertical"></div>'));
            this.tooltip[i] = new ViewTooltip($(this.item.find('.slider__tooltip_vertical')[i]));
          } else {
            $(this.item).find('.slider__field').append($('<div class="slider__tooltip"></div>'));
            this.tooltip[i] = new ViewTooltip($(this.item.find('.slider__tooltip')[i]));
        }

          this.tooltip[i].setTooltip(width / (obj.max - obj.min) * (obj.value[i] - obj.min), obj.value[i]);
        }
      }
    }
  }

  public update(obj: {min: number, max: number, value: number[], step: number}): void {
    let width: number | undefined;

    if (this.position === 'vertical') {
      width = $(this.item).height();
    } else {
      width = $(this.item).width();
    }

    this.thumb.forEach((val, i) => {
      if (typeof width === 'number' && typeof this.thumb === 'object' && typeof this.interval === 'number') {
        this.interval = width / (obj.max - obj.min) * obj.step;

        this.thumb[i].update( width / (obj.max - obj.min) * (obj.value[i] - obj.min), this.interval );

        if (this.tooltip.length > 0) {
          this.tooltip[i].setTooltip(width / (obj.max - obj.min) * (obj.value[i] - obj.min), obj.value[i]);
        }
      }
    });
  }

  public updateView(): void {
    this.thumb.forEach((val) => {
     this.symbol.push(val.getSymbol());
    });

    this.notifyObserverViewControler();
  }

  public addObserverViewControler(o: IObserverViewControler): void {
    this.observer = o;
  }

  public notifyObserverViewControler(): void {
    if (typeof this.observer !== 'undefined') {
      this.observer.updateViewControler(this.symbol);
      this.symbol = [];
    }
  }
}

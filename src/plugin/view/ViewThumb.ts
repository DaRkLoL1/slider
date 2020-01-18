import { Observer } from '../observer/Observer';

class ViewThumb extends Observer {
  private symbol: string = '';
  private interval: number | undefined;
  private index: number;
  private target: Element | undefined;
  private width: number | undefined;

  constructor(private thumb: JQuery<HTMLElement>, index: number) {
    super();
    this.index = index;
  }

  public installValue(value: number, interval: number): void {
    this.interval = interval;

    if (this.thumb.hasClass('slider__thumb_vertical')) {
      this.width  = $(this.thumb).height();
    } else {
      this.width  = $(this.thumb).width();
    }

    if (typeof this.width === 'number') {
      const left: string = value - this.width / 2 + 'px';

      if (this.thumb.hasClass('slider__thumb_vertical')) {
        this.thumb.css('bottom', left);
      } else {
        this.thumb.css('left', left);
      }

      this.addHandlersEvents();
    }
  }

  public addHandlersEvents() {
    this.thumb.on('dragstart', this.handleThumbDragStart);
    $(document).on('selectstart', this.handleThumbDragStart);
    this.thumb.on('mousedown', this.handleThumbMouseDown.bind(this));
  }

  public handleThumbDragStart() {
    return false;
  }

  public handleThumbMouseDown(event: Event) {
    this.target = (event.currentTarget as Element);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp.bind(this));
  }

  public handleDocumentMouseMove(event: MouseEvent) {
    let x: number;
    if (this.thumb.hasClass('slider__thumb_vertical')) {
      x =  event.clientY;
    } else {
      x =  event.clientX;
    }

    let thumbLeft: number;
    if (typeof this.width === 'number' && typeof this.interval === 'number' && this.target) {
      if (this.thumb.hasClass('slider__thumb_vertical')) {
        thumbLeft = this.target.getBoundingClientRect().top + this.width / 2;
      } else {
        thumbLeft = this.target.getBoundingClientRect().left + this.width / 2;
      }

      this.increasePositionThumb(x, thumbLeft);
      this.reducePositionThumb(x, thumbLeft);
    }
  }

  public increasePositionThumb(x: number, thumbLeft: number) {
    if (this.interval) {
      if ( x >= (thumbLeft + this.interval / 2 ) ) {
        let symbol: string = '';
        if (this.thumb.hasClass('slider__thumb_vertical')) {
          symbol = '-';
        } else {
          symbol = '+';
        }
        let i = x - thumbLeft;
        let counter = 0;
        while (i > 0) {
          if (i - this.interval >= 0) {
            i -= this.interval;
            counter += 1;
          } else if (i - this.interval / 2 >= 0) {
            i -= this.interval / 2;
            counter += 1;
          } else {
            i = 0;
          }
        }
        this.notifySubscribers('moveThumb', {symbol, counter, index: this.index});
      }
    }
  }

  public reducePositionThumb(x: number, thumbLeft: number) {
    if (this.interval) {
      if (x <= (thumbLeft - this.interval / 2 )) {
        let symbol: string = '';
        if (this.thumb.hasClass('slider__thumb_vertical')) {
          symbol = '+';
        } else {
          symbol = '-';
        }
        let i = thumbLeft - x;
        let counter = 0;
        while (i > 0) {
          if (i - this.interval >= 0) {
            i -= this.interval;
            counter += 1;
          } else if (i - this.interval / 2 >= 0) {
            i -= this.interval / 2;
            counter += 1;
          } else {
            i = 0;
          }
        }
        this.notifySubscribers('moveThumb', {symbol, counter, index: this.index});
      }
    }
  }

  public handleDocumentMouseUp() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  public getSymbol(): string {
     return this.symbol;
  }

  public update(value: number, interval: number): void {
    this.interval = interval;

    let width: number | undefined;

    if (this.thumb.hasClass('slider__thumb_vertical')) {
      width  = $(this.thumb).height();
    } else {
      width  = $(this.thumb).width();
    }

    if (typeof width === 'number') {
      const left: string = value - width / 2 + 'px';

      if (this.thumb.hasClass('slider__thumb_vertical')) {
         this.thumb.css('bottom', left);
      } else {
        this.thumb.css('left', left);
      }
    }
  }
}

export { ViewThumb };

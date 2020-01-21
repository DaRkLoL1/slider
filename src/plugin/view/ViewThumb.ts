import { Observer } from '../observer/Observer';

class ViewThumb extends Observer {
  private interval: number | undefined;
  private index: number;
  private sliderIndex: number;
  private target: Element | undefined;
  private width: number | undefined;

  constructor(private thumb: JQuery<HTMLElement>, index: number, sliderIndex: number) {
    super();
    this.index = index;
    this.sliderIndex = sliderIndex;
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
    this.thumb.on(`dragstart.thumb${this.sliderIndex}`, this.handleThumbDragStart);
    $(document).on(`selectstart.document${this.sliderIndex}`, this.handleThumbDragStart);
    this.thumb.on(`mousedown.thumb${this.sliderIndex}`, this.handleThumbMouseDown.bind(this));
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
    let coordinate: number;
    if (this.thumb.hasClass('slider__thumb_vertical')) {
      coordinate =  event.clientY;
    } else {
      coordinate =  event.clientX;
    }

    let thumbLeft: number;
    if (typeof this.width === 'number' && typeof this.interval === 'number' && this.target) {
      if (this.thumb.hasClass('slider__thumb_vertical')) {
        thumbLeft = this.target.getBoundingClientRect().top + this.width / 2;
      } else {
        thumbLeft = this.target.getBoundingClientRect().left + this.width / 2;
      }

      this.increasePositionThumb(coordinate, thumbLeft);
      this.reducePositionThumb(coordinate, thumbLeft);
    }
  }

  public increasePositionThumb(coordinate: number, thumbLeft: number) {
    if (this.interval) {
      if (coordinate >= (thumbLeft + this.interval / 2)) {
        let symbolMinusOrPlus: string = '';
        if (this.thumb.hasClass('slider__thumb_vertical')) {
          symbolMinusOrPlus = '-';
        } else {
          symbolMinusOrPlus = '+';
        }
        let index = coordinate - thumbLeft;
        let counter = 0;
        while (index > 0) {
          if (index - this.interval >= 0) {
            index -= this.interval;
            counter += 1;
          } else if (index - this.interval / 2 >= 0) {
            index -= this.interval / 2;
            counter += 1;
          } else {
            index = 0;
          }
        }
        this.notifySubscribers('moveThumb', {symbolMinusOrPlus, counter, index: this.index});
      }
    }
  }

  public reducePositionThumb(coordinate: number, thumbLeft: number) {
    if (this.interval) {
      if (coordinate <= (thumbLeft - this.interval / 2)) {
        let symbolMinusOrPlus: string = '';
        if (this.thumb.hasClass('slider__thumb_vertical')) {
          symbolMinusOrPlus = '+';
        } else {
          symbolMinusOrPlus = '-';
        }
        let index = thumbLeft - coordinate;
        let counter = 0;
        while (index > 0) {
          if (index - this.interval >= 0) {
            index -= this.interval;
            counter += 1;
          } else if (index - this.interval / 2 >= 0) {
            index -= this.interval / 2;
            counter += 1;
          } else {
            index = 0;
          }
        }
        this.notifySubscribers('moveThumb', {symbolMinusOrPlus, counter, index: this.index});
      }
    }
  }

  public handleDocumentMouseUp() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
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

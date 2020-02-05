import autobind from 'autobind-decorator';
import { Observer } from '../observer/Observer';

@autobind
class ViewThumb extends Observer {
  private interval: number | undefined;
  private index: number;
  private target: Element | undefined;
  private width: number | undefined;

  constructor(public $thumb: JQuery<HTMLElement>, index: number) {
    super();
    this.index = index;
  }

  public installValue(value: number, interval: number): void {
    this.interval = interval;

    if (this.$thumb.hasClass('slider__thumb_vertical')) {
      this.width  = this.$thumb.height();
    } else {
      this.width  = this.$thumb.width();
    }

    if (typeof this.width === 'number') {
      const left: string = value - this.width / 2 + 'px';

      if (this.$thumb.hasClass('slider__thumb_vertical')) {
        this.$thumb.css('bottom', left);
      } else {
        this.$thumb.css('left', left);
      }

      this.addHandlersEvents();
    }
  }

  private addHandlersEvents() {
    this.$thumb.on('dragstart.thumb', this.handleThumbDragStart);
    $(document).on('selectstart.document', this.handleThumbDragStart);
    this.$thumb.on('mousedown.thumb', this.handleThumbMouseDown);
  }

  private handleThumbDragStart() {
    return false;
  }

  private handleThumbMouseDown(event: Event) {
    this.target = (event.currentTarget as Element);
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove(event: MouseEvent) {
    let coordinate: number;
    if (this.$thumb.hasClass('slider__thumb_vertical')) {
      coordinate =  event.clientY;
    } else {
      coordinate =  event.clientX;
    }

    let thumbLeft: number;
    if (typeof this.width === 'number' && typeof this.interval === 'number' && this.target) {
      if (this.$thumb.hasClass('slider__thumb_vertical')) {
        thumbLeft = this.target.getBoundingClientRect().top + this.width / 2;
      } else {
        thumbLeft = this.target.getBoundingClientRect().left + this.width / 2;
      }

      this.increasePositionThumb(coordinate, thumbLeft);
      this.reducePositionThumb(coordinate, thumbLeft);
    }
  }

  private increasePositionThumb(coordinate: number, thumbLeft: number) {
    if (this.interval) {
      if (coordinate >= (thumbLeft + this.interval / 2)) {
        let symbolMinusOrPlus: string = '';
        if (this.$thumb.hasClass('slider__thumb_vertical')) {
          symbolMinusOrPlus = '-';
        } else {
          symbolMinusOrPlus = '+';
        }

        const width = coordinate - thumbLeft;
        let counter = 0;
        counter += Math.floor(width / this.interval);
        counter += Math.floor((width - counter * this.interval) / (this.interval / 2));

        this.notifySubscribers('moveThumb', {symbolMinusOrPlus, counter, index: this.index});
      }
    }
  }

  private reducePositionThumb(coordinate: number, thumbLeft: number) {
    if (this.interval) {
      if (coordinate <= (thumbLeft - this.interval / 2)) {
        let symbolMinusOrPlus: string = '';
        if (this.$thumb.hasClass('slider__thumb_vertical')) {
          symbolMinusOrPlus = '+';
        } else {
          symbolMinusOrPlus = '-';
        }
        const width = thumbLeft - coordinate;
        let counter = 0;
        counter += Math.floor(width / this.interval);
        counter += Math.floor((width - counter * this.interval) / (this.interval / 2));

        this.notifySubscribers('moveThumb', {symbolMinusOrPlus, counter, index: this.index});
      }
    }
  }

  private handleDocumentMouseUp() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  public updateThumb(value: number, interval: number): void {
    this.interval = interval;

    let width: number | undefined;

    if (this.$thumb.hasClass('slider__thumb_vertical')) {
      width  = this.$thumb.height();
    } else {
      width  = this.$thumb.width();
    }

    if (typeof width === 'number') {
      const left: string = value - width / 2 + 'px';

      if (this.$thumb.hasClass('slider__thumb_vertical')) {
         this.$thumb.css('bottom', left);
      } else {
        this.$thumb.css('left', left);
      }
    }
  }
}

export { ViewThumb };

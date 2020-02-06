import autobind from 'autobind-decorator';
import { Observer } from '../observer/Observer';

@autobind
class ViewThumb extends Observer {
  private interval: number | undefined;
  private index: number;
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

  private addHandlersEvents() {
    this.$thumb.on('dragstart.thumb', this.handleThumbDragStart);
    $(document).on('selectstart.document', this.handleThumbDragStart);
    this.$thumb.on('mousedown.thumb', this.handleThumbMouseDown);
  }

  private handleThumbDragStart() {
    return false;
  }

  private handleThumbMouseDown() {
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove(event: MouseEvent) {
    let coordinate: number;
    if (this.$thumb.hasClass('slider__thumb_vertical')) {
      coordinate =  event.pageY;
    } else {
      coordinate =  event.pageX;
    }

    const distanceToPage = this.calculateDistance();
    if (distanceToPage) {
      this.increasePositionThumb(coordinate, distanceToPage);
      this.reducePositionThumb(coordinate, distanceToPage);
    }
  }

  public calculateDistance(): number | undefined {
    const distances = this.$thumb.offset();
    let distanceToPage: number | undefined;

    if (this.width && distances) {
      if (this.$thumb.hasClass('slider__thumb_vertical')) {
        distanceToPage = distances.top + this.width / 2;
      } else {
        distanceToPage = distances.left + this.width / 2;
      }
    }

    return distanceToPage
  }

  public increasePositionThumb(coordinate: number, distanceToPage: number) {
    if (this.interval) {
      if (coordinate >= (distanceToPage + this.interval / 2)) {
        let symbolMinusOrPlus: string = '';
        if (this.$thumb.hasClass('slider__thumb_vertical')) {
          symbolMinusOrPlus = '-';
        } else {
          symbolMinusOrPlus = '+';
        }

        const width = coordinate - distanceToPage;
        let counter = 0;
        counter += Math.floor(width / this.interval);
        counter += Math.floor((width - counter * this.interval) / (this.interval / 2));

        this.notifySubscribers('moveThumb', {symbolMinusOrPlus, counter, index: this.index});
      }
    }
  }

  public reducePositionThumb(coordinate: number, distanceToPage: number) {
    if (this.interval) {
      if (coordinate <= (distanceToPage - this.interval / 2)) {
        let symbolMinusOrPlus: string = '';
        if (this.$thumb.hasClass('slider__thumb_vertical')) {
          symbolMinusOrPlus = '+';
        } else {
          symbolMinusOrPlus = '-';
        }

        const width = distanceToPage - coordinate;
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
}

export { ViewThumb };

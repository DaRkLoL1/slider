import { Observer } from '../observer/Observer';

class ViewThumb extends Observer {
  private symbol: string = '';
  private interval: number | undefined;
  private index: number;

  constructor(private thumb: JQuery<HTMLElement>, index: number) {
    super();
    this.index = index;
  }

  public installValue(value: number, interval: number): void {
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

      $(this.thumb).on('dragstart',  () => {
        return false;
      });

      $(document).on('selectstart', () => {
        return false;
      });

      $(this.thumb).on('mousedown', (event) => {
        const target: Element = event.currentTarget;

        const onMouseMove =  (event: MouseEvent) => {
          let x: number;
          if (this.thumb.hasClass('slider__thumb_vertical')) {
            x =  event.clientY;
          } else {
            x =  event.clientX;
          }

          let thumbLeft: number;
          if (typeof width === 'number' && typeof this.interval === 'number') {
            if (this.thumb.hasClass('slider__thumb_vertical')) {
              thumbLeft = target.getBoundingClientRect().top + width / 2;
            } else {
              thumbLeft = target.getBoundingClientRect().left + width / 2;
            }

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
        };
        document.addEventListener('mousemove', onMouseMove);

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mouseup', onMouseUp);
      });
    }
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

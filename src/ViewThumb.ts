interface SubjectView {
  addObserverView(o : ObserverView) : void;
  notifyObserverView() : void;
}

interface ObserverView {
  updateView(symbol : string) : void
}

export class ViewThumb implements SubjectView {
  private observer : ObserverView | undefined;
  private symbol : string | undefined;
  private interval : number | undefined;

  constructor(private thumb : JQuery<HTMLElement>, private line : JQuery<HTMLElement>) {}

  installValue(value: number, interval : number) {
    this.interval = interval;

    let width : number | undefined;

    if(this.thumb.hasClass('slider__thumb_vertical')) {
      width  = $(this.thumb).height();
      
    } else {
      width  = $(this.thumb).width();
    }
    
    if(typeof width === 'number') {
      let left : string = value - width / 2 + 'px';
      
      if(this.thumb.hasClass('slider__thumb_vertical')) {
        this.thumb.css('bottom', left);
        this.line.css('height', left);
      } else {
        this.thumb.css('left', left);
        this.line.css('width', left);
      }
      
      let that : ViewThumb = this;

      $(this.thumb).on('dragstart', function () {
        return false;
      });

      $(this.thumb).on('mousedown', function (event) {
        let target : Element = event.currentTarget;

        let onMouseMove = function (event : MouseEvent) {
            
          let x : number;
          if(that.thumb.hasClass('slider__thumb_vertical')) {
            x =  event.clientY;
          } else {
            x =  event.clientX;
          }
          
            
          let thumbLeft : number;
          if(typeof width === 'number' && typeof that.interval === 'number') {
            if(that.thumb.hasClass('slider__thumb_vertical')) {
              thumbLeft = target.getBoundingClientRect().top + width / 2
            } else {
              thumbLeft = target.getBoundingClientRect().left + width / 2
            }
            
            if( x >= (thumbLeft + that.interval / 2 ) ) {

              if(that.thumb.hasClass('slider__thumb_vertical')) {
                that.symbol = '-';
              } else {
                that.symbol = '+';
              }
              
              that.changed()

            } 
            if(x <= (thumbLeft - that.interval / 2 )) {
              if(that.thumb.hasClass('slider__thumb_vertical')) {
                that.symbol = '+';
              } else {
                that.symbol = '-';
              }
              that.changed()
            }
          }
        }
        document.addEventListener('mousemove', onMouseMove);

        let onMouseUp = function () {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }
        document.addEventListener('mouseup', onMouseUp);
            
      });
    }
    
  }

  update(value : number, interval : number) {
    this.interval = interval;

    let width : number | undefined;

    if(this.thumb.hasClass('slider__thumb_vertical')) {
      width  = $(this.thumb).height();
    } else {
      width  = $(this.thumb).width();
    }

    if(typeof width === 'number') {
      let left : string = value - width / 2 + 'px';

      if(this.thumb.hasClass('slider__thumb_vertical')) {
         this.thumb.css('bottom', left);
        this.line.css('height', left);
      } else {
        this.thumb.css('left', left);
        this.line.css('width', left);
      }
    }
  }

  changed() {
    this.notifyObserverView()
  }

  addObserverView(o : ObserverView) {
    this.observer = o;
  }

  notifyObserverView() {
    if(typeof this.observer !== 'undefined' && typeof this.symbol === 'string') {
      this.observer.updateView(this.symbol)
    }
  }
}
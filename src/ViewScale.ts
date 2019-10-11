interface SubjectView {
  addObserverView(o : ObserverView) : void;
  notifyObserverView() : void;
}

interface ObserverView {
  updateView(symbol : string) : void
}

export class ViewScale implements SubjectView {
  private observer : ObserverView | undefined;
  private num : string | undefined;

  constructor(private scale : JQuery<HTMLElement>) {};

  setNumbers(obj : {min : number, max : number, step : number}) {
    
    for(let i = obj.min; i <= obj.max; i += obj.step) {
      this.scale.append($('<span>' + i + '</span>'));
    }

    let that = this;
    this.scale.on('click', function (event) {
      let target = $(event.target);
      
      if(target.prop('tagName') !== 'SPAN') return;
      
      that.num = target.text();
      that.notifyObserverView();
      return false;
    });
  }

  addObserverView (o : ObserverView) {
    this.observer = o;
  }

  notifyObserverView () {

    if(typeof this.observer === 'object' && typeof this.num === 'string') {
      this.observer.updateView(this.num);
    }

  }

}
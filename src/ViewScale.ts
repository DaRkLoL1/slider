interface ISubjectView {
  addObserverView(o: IObserverView): void;
  notifyObserverView(): void;
}

interface IObserverView {
  updateView(symbol: string): void;
}

export class ViewScale implements ISubjectView {
  private observer: IObserverView | undefined;
  private num: string | undefined;

  constructor(private scale: JQuery<HTMLElement>) {}

  public setNumbers(obj: {min: number, max: number, step: number}): void {

    for (let i = obj.min; i <= obj.max; i += obj.step) {
      this.scale.append($('<span>' + i + '</span>'));
    }

    this.scale.on('click', (event) => {
      const $target = $(event.target);
      if ($target.prop('tagName') !== 'SPAN') {
        return;
      }

      this.num = $target.text();
      this.notifyObserverView();
      return false;
    });
  }

  public addObserverView(o: IObserverView): void {
    this.observer = o;
  }

  public notifyObserverView(): void {

    if (typeof this.observer === 'object' && typeof this.num === 'string') {
      this.observer.updateView(this.num);
    }
  }
}

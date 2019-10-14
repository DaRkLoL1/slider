export class ViewTooltip {
  constructor(private tooltip: JQuery<HTMLElement>) {}

  public setTooltip(position: number, value: number): void {
    let width: number | undefined;

    if (this.tooltip.hasClass('slider__tooltip_vertical')) {
      width = this.tooltip.height();
    } else {
      width = this.tooltip.width();
    }

    if (typeof width === 'number') {
      const left: string = position  - width / 2 + 'px';

      if (this.tooltip.hasClass('slider__tooltip_vertical')) {
        this.tooltip.css('bottom', left);
      } else {
        this.tooltip.css('left', left);
      }
    }
    this.tooltip.text(value);
  }
}

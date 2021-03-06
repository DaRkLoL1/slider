class ViewTooltip {
  constructor(public $tooltip: JQuery<HTMLElement>) {}

  public setTooltip(position: number, value: number): void {
    let width: number | undefined;
    this.$tooltip.text(value);
    if (this.$tooltip.hasClass('slider__tooltip_vertical')) {
      width = this.$tooltip.innerHeight();
    } else {
      width = this.$tooltip.innerWidth();
    }

    if (typeof width === 'number') {
      const left: string = position  - width / 2 + 'px';

      if (this.$tooltip.hasClass('slider__tooltip_vertical')) {
        this.$tooltip.css('bottom', left);
      } else {
        this.$tooltip.css('left', left);
      }
    }
  }
}

export { ViewTooltip };

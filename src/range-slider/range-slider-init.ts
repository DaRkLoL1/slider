import { RangeSlider } from './range-slider';

const slider = document.querySelectorAll<HTMLElement>('.js-range-slider');

if (slider) {
  slider.forEach((val) => {
    new RangeSlider($(val));
  });
}

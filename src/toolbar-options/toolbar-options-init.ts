import { ToolbarOptions } from './Toolbar-options';

const slider = document.querySelectorAll<HTMLElement>('.js-toolbar-options');

if (slider) {
  slider.forEach((item, index) => {
    new ToolbarOptions($(item), index);
  });
}

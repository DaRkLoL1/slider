import { DemoPlugin } from './Demo-plugin';

const demoPlugins = document.querySelectorAll<HTMLElement>('.js-demo-plugin');

if (demoPlugins) {
  demoPlugins.forEach((item, index) => {
    new DemoPlugin($(item), index);
  });
}
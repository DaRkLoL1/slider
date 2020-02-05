import { ViewThumb } from '../../../src/plugin/view/View-thumb';

const css = (window as any).__FIXTURES__['test/style.css'];

describe('ViewThumb', () => {
  let thumb: ViewThumb;
  let count: string;
  beforeEach(() => {
    setFixtures('<div class="slider__thumb"></div>');
    setStyleFixtures(css);
    thumb = new ViewThumb($('.slider__thumb'), 0);
    thumb.installValue(250, 5);
    thumb.addSubscribers('moveThumb', (options) => {
      count = options.symbolMinusOrPlus;
    });
  });
});

describe('ViewThumb вертикальный вид', () => {
  let thumb: ViewThumb;
  let count: string;
  beforeEach(() => {
    setFixtures('<div class="slider__thumb slider__thumb_vertical"></div>');
    setStyleFixtures(css);
    thumb = new ViewThumb($('.slider__thumb'), 0);
    thumb.installValue(250, 5);
    thumb.addSubscribers('moveThumb', (options) => {
      count = options.symbolMinusOrPlus;
    });
  });
});

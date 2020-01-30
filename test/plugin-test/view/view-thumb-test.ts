import { ViewThumb } from '../../../src/plugin/view/View-thumb';

const css = (window as any).__FIXTURES__['test/style.css'];

describe('ViewThumb', () => {
  let thumb: ViewThumb;
  let count: string;
  beforeEach(() => {
    setFixtures('<div class="slider__thumb"></div>');
    setStyleFixtures(css);
    thumb = new ViewThumb($('.slider__thumb'), 0, 0);
    thumb.installValue(250, 5);
    thumb.addSubscribers('moveThumb', (options) => {
      count = options.symbolMinusOrPlus;
    });
  });

  it('отменить dragstart', () => {
    const isTrue: boolean = thumb.handleThumbDragStart();
    expect(isTrue).toBeFalsy();
  });

  it('увеличить значение', () => {
    thumb.increasePositionThumb(100, 20);
    expect(count).toEqual('+');
  });

  it('уменьшить значение', () => {
    thumb.reducePositionThumb(10, 200);
    expect(count).toEqual('-');
  });
});

describe('ViewThumb вертикальный вид', () => {
  let thumb: ViewThumb;
  let count: string;
  beforeEach(() => {
    setFixtures('<div class="slider__thumb slider__thumb_vertical"></div>');
    setStyleFixtures(css);
    thumb = new ViewThumb($('.slider__thumb'), 0, 0);
    thumb.installValue(250, 5);
    thumb.addSubscribers('moveThumb', (options) => {
      count = options.symbolMinusOrPlus;
    });
  });

  it('увеличить значение', () => {
    thumb.increasePositionThumb(100, 20);
    expect(count).toEqual('-');
  });

  it('уменьшить значение', () => {
    thumb.reducePositionThumb(10, 200);
    expect(count).toEqual('+');
  });

  it('вызвать handleDocumentMouseMove', () => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    thumb.handleDocumentMouseMove(event);
  });
});

import { ViewThumb } from '../../../src/plugin/view/View-thumb';

const css = (window as any).__FIXTURES__['test/style.css'];

describe('ViewThumb', () => {
  let thumb: ViewThumb;

  beforeEach(() => {
    setFixtures('<div class="slider__thumb"></div>');
    setStyleFixtures(css);
    thumb = new ViewThumb($('.slider__thumb'), 0, 0);
    thumb.installValue(250, 5);
    thumb.addSubscribers('moveThumb', () => {
      return true;
    });
  });

  it('отменить dragstart', () => {
    thumb.handleThumbDragStart();
  });

  it('увеличить значение', () => {
    thumb.increasePositionThumb(100, 20);
  });

  it('уменьшить значение', () => {
    thumb.reducePositionThumb(10, 200);
  });

  it('вызвать handleMouseDown', () => {
    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    thumb.handleDocumentMouseMove(event);
  });
});

describe('ViewThumb вертикальный вид', () => {
  let thumb: ViewThumb;

  beforeEach(() => {
    setFixtures('<div class="slider__thumb slider__thumb_vertical"></div>');
    setStyleFixtures(css);
    thumb = new ViewThumb($('.slider__thumb'), 0, 0);
    thumb.installValue(250, 5);
    thumb.addSubscribers('moveThumb', () => {
      return true;
    });
  });

  it('увеличить значение', () => {
    thumb.increasePositionThumb(100, 20);
  });

  it('уменьшить значение', () => {
    thumb.reducePositionThumb(10, 200);
  });

  it('вызвать handleMouseDown', () => {
    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    thumb.handleDocumentMouseMove(event);
  });
});

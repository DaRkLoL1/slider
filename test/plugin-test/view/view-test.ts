import { View } from '../../../src/plugin/view/View';

const css = (window as any).__FIXTURES__['test/style.css'];

describe('view',  () => {
  let $item: JQuery<HTMLElement>;
  let dom: View;
  beforeEach(() => {
    setFixtures('<div class="root"></div>');
    setStyleFixtures(css);

    $item  = $('.root');
    $item.css('width', 500);
    dom = new View($item, 0);
    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: false, range: false, position: 'horizontal'});
  });

  it('добавить бегунок', () => {
    expect($('.slider__thumb')).toExist();
  });

  it('добавить значения', ()  => {
    expect($('.slider__thumb').css('left')).toEqual('240px');
  });

  it('добавить подсказку', () => {
    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: true, range: false, position: 'horizontal'});
    const tooltip = $('.slider__tooltip');

    expect(tooltip).toExist();
    expect(tooltip.css('left')).toEqual('235px');
    expect(tooltip.text()).toEqual('50');
  });

  it('updateView', () => {
    dom.updateView({min: 0, max: 100, values: [40], step: 1});
    expect($('.slider__thumb').css('left')).toEqual('190px');
  });

  it('updateValue', () => {
    dom.addSubscribers('changeView', () => {
      return true;
    });

    dom.notifySubscribers('changeView', {});
  });
});

describe('viewVertical', () => {
  let $item: JQuery<HTMLElement>;
  let dom: View;
  beforeEach(() => {
    setFixtures('<div class="root"></div>');
    setStyleFixtures(css);
    $item  = $('.root');
    $item.css('height', 500);
    dom = new View($item, 0);
    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: false, range: false, position: 'vertical'});
  });

  it('добавить бегунок', () => {
    expect($('.slider__thumb_vertical')).toExist();
  });

  it('добавить значения', () =>  {
    expect($('.slider__thumb_vertical').css('bottom')).toEqual('240px');
  });

  it('добавить подсказку', () => {
    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: true, range: false, position: 'vertical'});
    const tooltip = $('.slider__tooltip_vertical');

    expect(tooltip).toExist();
    expect(tooltip.css('bottom')).toEqual('235px');
    expect(tooltip.text()).toEqual('50');
  });

  it('updateView', () => {
    dom.updateView({min: 0, max: 100, values: [40], step: 1});
    expect($('.slider__thumb').css('bottom')).toEqual('190px');
  });

  it('updateView c подсказкой' , () => {
    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: true, range: false, position: 'vertical'});
    const tooltip = $('.slider__tooltip_vertical');
    dom.updateView({min: 0, max: 100, values: [40], step: 1});

    expect($('.slider__thumb').css('bottom')).toEqual('190px');
    expect(tooltip).toExist();
    expect(tooltip.css('bottom')).toEqual('185px');
    expect(tooltip.text()).toEqual('40');
  });
});

describe('view',  () => {
  let $item: JQuery<HTMLElement>;
  let dom: View;
  beforeEach(() => {
    setFixtures('<div class="root"></div>');
    setStyleFixtures(css);

    $item  = $('.root');
    $item.css('width', 500);
    dom = new View($item, 0);
    dom.createSlider(
      {
        max: 100,
        min: 0,
        position: 'horizontal',
        range: true,
        step: 10,
        tooltip: false,
        values: [10, 60],
      },
    );
  });

  it('добавить 2 бегунка с последним значением снизу', () => {
    dom.createSlider(
      {
        max: 100,
        min: 0,
        position: 'horizontal',
        range: true,
        step: 10,
        tooltip: false,
        values: [90, 100],
      },
    );
    expect($('.slider__thumb').length).toEqual(2);
  });

  it('добавить 2 бегунка с подсказками', () => {
    dom.createSlider(
      {
        max: 100,
        min: 0,
        position: 'horizontal',
        range: true,
        step: 10,
        tooltip: true,
        values: [90, 100],
      },
    );
    expect($('.slider__thumb').length).toEqual(2);
  });
});

describe('viewVertical c 2 значениями', () => {
  let $item: JQuery<HTMLElement>;
  let dom: View;
  beforeEach(() => {
    setFixtures('<div class="root"></div>');
    setStyleFixtures(css);
    $item  = $('.root');
    $item.css('height', 500);
    dom = new View($item, 0);
    dom.createSlider(
      {
        max: 100,
        min: 0,
        position: 'vertical',
        range: true,
        step: 10,
        tooltip: false,
        values: [10, 60],
      },
    );
  });

  it('добавить 2 бегунка с последним значением снизу', () => {
    dom.createSlider(
      {
        max: 100,
        min: 0,
        position: 'vertical',
        range: true,
        step: 10,
        tooltip: false,
        values: [90, 100],
      },
    );
    expect($('.slider__thumb').length).toEqual(2);
  });

  it('добавить 2 бегунка с подсказками', () => {
    dom.createSlider(
      {
        max: 100,
        min: 0,
        position: 'vertical',
        range: true,
        step: 10,
        tooltip: true,
        values: [90, 100],
      },
    );
    expect($('.slider__thumb').length).toEqual(2);
  });
});

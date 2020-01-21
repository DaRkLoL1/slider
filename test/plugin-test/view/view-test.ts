import {View} from '../../../src/plugin/view/View';

describe('view',  () => {
  let $item: JQuery<HTMLElement>;

  beforeEach(() => {
    setFixtures('<div class="root"></div>');
    setStyleFixtures(`.root {
      width: 500px;
      margin-top: 50px; }
      .root__version2 {
        width: 200px;
        height: 500px; }
        .slider {
          display: flex;
          flex-direction: column;
          width: 100%; }
          .slider_vertical {
            flex-direction: row-reverse;
            justify-content: flex-end;
            height: 100%; }
          .slider__tooltip {
            position: relative;
            width: 30px;
            height: 30px;
            margin-bottom: 20px;
            margin-left: 235px;
            background-color: red;
            border-radius: 5px;
            line-height: 30px;
            font-size: 20px;
            color: white;
            text-align: center; }
            .slider__tooltip_vertical {
              margin-left: 20px;
              margin-top: auto;
              margin-bottom: 235px; }
          .slider__field {
            display: flex;
            position: relative;
            margin: auto;
            border-radius: 5px;
            background-color: silver;
            width: 100%;
            height: 5px; }
            .slider__field_vertical {
              align-self: center;
              height: 100%;
              width: 5px;
              margin: 0; }
          .slider__thumb {
            position: absolute;
            top: -7.5px;
            left: 240px;
            width: 20px;
            height: 20px;
            background-color: green;
            border-radius: 10px;
            cursor: pointer; }
            .slider__thumb_vertical {
              top: auto;
              bottom: 240px;
              left: -7.5px; }`);
    $item  = $('.root');

    $item.css('width', 500);

    const dom = new View($item, 0);

    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: true, range: false, position: 'horizontal'});
  });

  it('добавить бегунок', () => {
    expect($('.slider__thumb')).toExist();
  });

  it('добавить значения', ()  => {
    expect($('.slider__thumb').css('left')).toEqual('240px');
  });

  it('уменьшить, увеличить  значение', () => {
    const spyon = spyOnEvent('.slider__thumb', 'click');
    $('.slider__thumb').click();
    expect('click').toHaveBeenTriggeredOn('.slider__thumb');
    expect(spyon).toHaveBeenTriggered();
  });

  it('добавить подсказку', () => {
    const tooltip = $('.slider__tooltip');

    expect(tooltip).toExist();
    expect(tooltip.css('left')).toEqual('235px');
    expect(tooltip.text()).toEqual('50');
  });
});

describe('viewVertical', () => {
  let $item: JQuery<HTMLElement>;

  beforeEach(() => {
    setFixtures('<div class="root"></div>');
    setStyleFixtures(`.root {
      width: 500px;
      margin-top: 50px; }
      .root__version2 {
        width: 200px;
        height: 500px; }
    .slider {
      display: flex;
      flex-direction: column;
      width: 100%; }
      .slider_vertical {
        flex-direction: row-reverse;
        justify-content: flex-end;
        height: 100%; }
      .slider__tooltip {
        position: relative;
        width: 30px;
        height: 30px;
        margin-bottom: 20px;
        margin-left: 235px;
        background-color: red;
        border-radius: 5px;
        line-height: 30px;
        font-size: 20px;
        color: white;
        text-align: center; }
        .slider__tooltip_vertical {
          margin-left: 20px;
          margin-top: auto;
          margin-bottom: 235px; }
      .slider__field {
        display: flex;
        position: relative;
        margin: auto;
        border-radius: 5px;
        background-color: silver;
        width: 100%;
        height: 5px; }
        .slider__field_vertical {
          align-self: center;
          height: 100%;
          width: 5px;
          margin: 0; }
      .slider__thumb {
        position: absolute;
        top: -7.5px;
        left: 240px;
        width: 20px;
        height: 20px;
        background-color: green;
        border-radius: 10px;
        cursor: pointer; }
        .slider__thumb_vertical {
          top: auto;
          bottom: 240px;
          left: -7.5px; }`);
    $item  = $('.root');
    $item.css('height', 500);
    const dom = new View($item, 0);

    dom.createSlider({min: 0, max: 100, step: 10, values: [50], tooltip: true, range: false, position: 'vertical'});
  });

  it('добавить бегунок', () => {
    expect($('.slider__thumb_vertical')).toExist();
  });

  it('добавить значения', () =>  {
    expect($('.slider__thumb_vertical').css('bottom')).toEqual('240px');
  });

  it('уменьшить, увеличить  значение', () => {
    const spyon = spyOnEvent('.slider__thumb_vertical', 'click');
    $('.slider__thumb_vertical').click();
    expect('click').toHaveBeenTriggeredOn('.slider__thumb_vertical');
    expect(spyon).toHaveBeenTriggered();
  });

  it('добавить подсказку', () => {
    const tooltip = $('.slider__tooltip_vertical');

    expect(tooltip).toExist();
    expect(tooltip.css('bottom')).toEqual('235px');
    expect(tooltip.text()).toEqual('50');
  });
});

import {Model} from '../src/Model';
import {ModelHandle} from '../src/ModelHandle';
import {View} from '../src/View';

describe('Model', () => {
  let model: Model;

  beforeEach(() => {
    model = new Model({min: 0, max: 100, step: 1, handle: [new ModelHandle(0)]});
  });

  it('создать конструктор для присвоения min max и вернуть их', () => {
    const min = model.getMin();
    const max = model.getMax();
    expect(min).toEqual(0);
    expect(max).toEqual(100);
  });

  it('создать конструктор для присвоения min max и вернуть их', () => {
    const model: Model = new Model({min: 20, max: 50, step: 1, handle: [new ModelHandle(0)]});
    const min = model.getMin();
    const max = model.getMax();
    expect(min).toEqual(20);
    expect(max).toEqual(50);
  });

  it('получить значение шага', () => {
    const step: number = model.getStep();

    expect(step).toEqual(1);
  });

});

describe('model handle', () => {

  let handle: ModelHandle;

  beforeEach(() => {
     handle = new ModelHandle(0);
  });

  it('создать ручку и получить значение', () => {
    const handle: ModelHandle = new ModelHandle(50);
    const value: number = handle.getValue();
    expect(value).toEqual(50);
  });

  it('увеличить значение на step', () => {
    handle.increaseValue({max: 100, step: 1});
    expect(handle.getValue()).toEqual(1);
  });

  it('увеличить значение на 110', () => {
    handle.increaseValue({max: 100, step: 110});
    expect(handle.getValue()).toEqual(100);
  });

  it('уменьшить значение на 10', () => {
    handle.setValue({value: 40, min: 0, max: 100});
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(30);
  });

  it('уменьшить значение на 10', () => {
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(0);
  });

  it('изменить значение ручки больше мах значения', () => {
    handle.setValue({value: 200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(100);
  });

  it('изменить значение ручки меньше мin значения', () => {
    handle.setValue({value: -200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(0);
  });

  it('изменить значение ручки', () => {
    handle.setValue({value: 50, min: 0, max: 100});
    expect(handle.getValue()).toEqual(50);
  });

});

describe('изменить, увеличивать и уменьшать значения из Model',  () => {

  it('изменить значение из Model',  () => {
    const handle = new ModelHandle(0);
    const model = new Model({min: 0, max: 100, step: 1, handle: [handle]});

    model.setValue([30]);
    expect(model.getValue()).toEqual([30]);
  });

  it('увеличить значение из Model',  () => {
    const handle = new ModelHandle(50);
    const model = new Model({min: 0, max: 100, step: 10, handle: [handle]});

    model.increaseValue(0);
    expect(model.getValue()).toEqual([60]);
  });

  it('уменьшить значение из Model',  () => {
    const handle = new ModelHandle(50);
    const model = new Model({min: 0, max: 100, step: 10, handle: [handle]});

    model.reduceValue(0);
    expect(model.getValue()).toEqual([40]);
  });
});

describe('view',  () => {
  let item: JQuery<HTMLElement>;

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
        .slider__tooltip::before {
          content: '';
          position: absolute;
          border: 5px solid red;
          border-bottom: 0px;
          border-left-color: transparent;
          border-right-color: transparent;
          left: 10px;
          top: 30px; }
        .slider__tooltip_vertical {
          margin-left: 20px;
          margin-top: auto;
          margin-bottom: 235px; }
          .slider__tooltip_vertical::before {
            border-bottom: 5px solid transparent;
            border-top-color: transparent;
            border-left: 0;
            border-right-color: red;
            top: 10px;
            left: -5px; }
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
          left: -7.5px; }
      .slider__line {
        width: 240px;
        height: 5px;
        background-color: green;
        border-radius: 5px; }
        .slider__line_vertical {
          align-self: flex-end;
          height: 240px;
          width: 5px; }
      .slider__numbers {
        display: flex;
        justify-content: space-between;
        margin-top: 10px; }
        .slider__numbers span {
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          font-size: 18px;
          color: silver; }
        .slider__numbers_vertical {
          flex-direction: column-reverse;
          margin-top: 0;
          margin-right: 10px; }
          .slider__numbers_vertical span {
            width: auto;
            text-align: center;
            margin: 0; }`);
    item  = $('.root');

    item.css('width', 500);

    const dom = new View(item);

    dom.createSlider({min: 0, max: 100, step: 10, value: [50], tooltip: true, range: 1, position: 'horizontal'});
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
  let item: JQuery<HTMLElement>;

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
        .slider__tooltip::before {
          content: '';
          position: absolute;
          border: 5px solid red;
          border-bottom: 0px;
          border-left-color: transparent;
          border-right-color: transparent;
          left: 10px;
          top: 30px; }
        .slider__tooltip_vertical {
          margin-left: 20px;
          margin-top: auto;
          margin-bottom: 235px; }
          .slider__tooltip_vertical::before {
            border-bottom: 5px solid transparent;
            border-top-color: transparent;
            border-left: 0;
            border-right-color: red;
            top: 10px;
            left: -5px; }
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
          left: -7.5px; }
      .slider__line {
        width: 240px;
        height: 5px;
        background-color: green;
        border-radius: 5px; }
        .slider__line_vertical {
          align-self: flex-end;
          height: 240px;
          width: 5px; }
      .slider__numbers {
        display: flex;
        justify-content: space-between;
        margin-top: 10px; }
        .slider__numbers span {
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          font-size: 18px;
          color: silver; }
        .slider__numbers_vertical {
          flex-direction: column-reverse;
          margin-top: 0;
          margin-right: 10px; }
          .slider__numbers_vertical span {
            width: auto;
            text-align: center;
            margin: 0; }`);
    item  = $('.root');
    item.css('height', 500);
    const dom = new View(item);

    dom.createSlider({min: 0, max: 100, step: 10, value: [50], tooltip: true, range: 1, position: 'vertical'});
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

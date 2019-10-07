import {MainModel} from '../src/index';
import {ModelHandle} from '../src/index';
import {View} from '../src/index';


describe('Model', function () {
  
  let model : MainModel;

  beforeEach(function () {
    model = new MainModel();
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    
    let min = model.getMin();
    let max = model.getMax();
    expect(min).toEqual(0);
    expect(max).toEqual(100);
  });

  it('создать конструктор для присвоения min max и вернуть их', function () {
    let model : MainModel = new MainModel({min: 20, max: 50});
    let min = model.getMin();
    let max = model.getMax();
    expect(min).toEqual(20);
    expect(max).toEqual(50);
  });

  it('получить значение шага', function (){
    let step : number = model.getStep();

    expect(step).toEqual(1);
  });

});

describe('model handle', function () {

  let handle : ModelHandle; 

  beforeEach(function () {
     handle = new ModelHandle();
  });
  
  it('создать ручку и получить значение', function (){
    let handle : ModelHandle = new ModelHandle(50);
    let value : number = handle.getValue();
    expect(value).toEqual(50);
  });

  it('увеличить значение на step', function () {
    handle.increaseValue({max: 100, step: 1});
    expect(handle.getValue()).toEqual(1);
  });

  it('увеличить значение на 110', function () {
    handle.increaseValue({max: 100, step: 110});
    expect(handle.getValue()).toEqual(100);
  });

  it('уменьшить значение на 10', function () {
    handle.setValue({value: 40, min: 0, max: 100});
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(30);
  });

  it('уменьшить значение на 10', function () {
    handle.reduceValue({min: 0, step: 10});
    expect(handle.getValue()).toEqual(0);
  });

  it('изменить значение ручки больше мах значения', function () {
    handle.setValue({value: 200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(100)
  });

  it('изменить значение ручки меньше мin значения', function () {
    handle.setValue({value: -200, min: 0, max: 100});
    expect(handle.getValue()).toEqual(0)
  });

  it('изменить значение ручки', function () {
    handle.setValue({value: 50, min: 0, max: 100})
    expect(handle.getValue()).toEqual(50)
  });

});

describe('изменить, увеличивать и уменьшать значения из MainModel', function () {

  
  it('изменить значение из MainModel', function () {
    let handle = new ModelHandle();
    let model = new MainModel({handle: handle});

    model.setValue(30);
    expect(model.getValue()).toEqual(30);
  });

  it('увеличить значение из MainModel', function () {
    let handle = new ModelHandle(50);
    let model = new MainModel({step: 10, handle: handle});

    model.increaseValue();
    expect(model.getValue()).toEqual(60);
  });

  it('уменьшить значение из MainModel', function () {
    let handle = new ModelHandle(50);
    let model = new MainModel({step: 10, handle: handle});

    model.reduceValue();
    expect(model.getValue()).toEqual(40);
  });
});

describe('view', function (){

  beforeEach(function () {
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
      .slider__button {
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
        .slider__button::before {
          content: '';
          position: absolute;
          border: 5px solid red;
          border-bottom: 0px;
          border-left-color: transparent;
          border-right-color: transparent;
          left: 10px;
          top: 30px; }
        .slider__button_vertical {
          margin-left: 20px;
          margin-top: auto;
          margin-bottom: 235px; }
          .slider__button_vertical::before {
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
    let item : HTMLElement | null = document.querySelector('.root');
    if(item !== null) {
      item.style.width = '500px';
    }
    let dom = new View(item);

    dom.createSlider({min: 0, max: 100, step: 10, value: 50});
  });

  it('добавить бегунок', function (){
    expect($('.slider__thumb')).toExist();
    expect($('.slider__line')).toExist();
  });
  

  it('добавить значения', function () {
    expect($('.slider__thumb').css('left')).toEqual('240px');
    expect($('.slider__line').css('width')).toEqual('240px');
  });
});
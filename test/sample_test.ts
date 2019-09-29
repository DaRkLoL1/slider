import { Car } from '../src/Car';

describe('Car', () => {
  it('can create', () => {
    const car: Car = new Car();
    expect(car).not.toBe(null);
  });

  it('go() works', () => {
    const car: Car = new Car();
    const returnValue = car.go('vroom');
    expect(returnValue).toEqual('vroom');
  });
});

describe("click event tests", () => {
  it("should trigger an onclick DOM event", () =>{
    setFixtures(`<script>
      function handle_my_click_div_clicked() {
      // do nothing at this time
      }
      </script>
      <div id='my_click_div'
      onclick='handle_my_click_div_clicked()'>Click Here</div>`);
    var clickEventSpy = spyOnEvent('#my_click_div', 'click');
    $('#my_click_div').click();
    expect(clickEventSpy).toHaveBeenTriggered();
  });
});
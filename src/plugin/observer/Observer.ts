class Observer {
  private subscribers: { [key: string]: Array<(data: {
    min: number,
    max: number,
    step: number,
    value: number[],
   } | string[]) => void>} = {};

  public addSubscribers(eventName: string, func: (data: {
    min: number,
    max: number,
    step: number,
    value: number[],
   } | string[]) => void) {
    if (!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(func);
  }

  private notifySubscribers(eventName: string, data: {
    min: number,
    max: number,
    step: number,
    value: number[],
   } | string[]) {
    this.subscribers[eventName].forEach((item) => {
      item(data);
    });
  }
}

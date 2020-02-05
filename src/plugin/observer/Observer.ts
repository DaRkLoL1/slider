class Observer {
  private subscribers: { [key: string]: Array<(data: any) => void>} = {};

  public addSubscribers(eventName: string, func: (data: any) => void) {
    const has = Object.prototype.hasOwnProperty;
    if (!has.call(this.subscribers, eventName)) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(func);
  }

  protected notifySubscribers(eventName: string, data: any) {
    this.subscribers[eventName].forEach((item) => {
      item(data);
    });
  }
}

export { Observer };

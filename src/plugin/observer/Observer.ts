class Observer {
  private subscribers: { [key: string]: Array<(data: any) => void>} = {};

  public addSubscribers(eventName: string, func: (data: any) => void) {
    if (!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(func);
  }

  public notifySubscribers(eventName: string, data: any) {
    this.subscribers[eventName].forEach((item) => {
      item(data);
    });
  }
}

export { Observer };

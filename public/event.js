class Events {
  constructor() {
    this._listener = new Set;
  }

  listen(name, callback) {
    this._listener.add({
      name,
      callback,
    });
  }

  emit(name, ...data) {
    this._listener.forEach(listener => {
      if (listener.name === name) {
        listener.callback(...data);
      }
    });
  }
}
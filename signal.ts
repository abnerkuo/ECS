/**
 * 信号发射器
 *
 * Abner.Guo
 */
export default class Signal {
  private _listeners: Function[];
  constructor() {
    this._listeners = [];
  }

  /**
   * 向信号实例增加一个监听器
   * @param listener
   */
  add(listener: Function) {
    this._listeners.push(listener);
  }

  /**
   * 从信号实例删除一个监听器
   * @param listener
   */
  remove(listener: Function): boolean {
    let listeners = this._listeners;

    for (let i = 0, len = listeners.length; i < len; ++i) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * 触发所有监听器的回调
   * @param listener
   */
  emit(...messages: any[]) {
    let listeners = this._listeners;

    for (let i = 0, len = listeners.length; i < len; ++i) {
      listeners[i].apply(null, messages);
    }
  }
}

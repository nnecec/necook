class EventBus {
  events: Map<any, any>

  constructor() {
    this.events = this.events || new Map()
  }

  /**
   * 添加监听方法
   * 
   * @param {any} type 
   * @param {Function} func 
   * @memberof EventBus
   */
  add(type, func: Function) {
    const listeners = this.events.get(type)
    if (listeners && listeners.length) {
      this.events.set(type, [...listeners, func])
    } else {
      this.events.set(type, [func])
    }
  }

  /**
   * 触发监听
   * 
   * @param {*} type 
   * @param {object} args 
   * @memberof EventBus
   */
  emit(type: any, args?: Array<object>) {
    const listeners = this.events.get(type)
    if (listeners && listeners.length) {
      listeners.forEach(listener => {
        listener.apply(this, args)
      });
      return
    }
    return false
  }

  /**
   * 移除某个监听方法
   * 
   * @param {any} type 
   * @param {Function} func 
   * @memberof EventBus
   */
  remove(type, func: Function) {
    const listeners = this.events.get(type)

    if (listeners && listeners.length) {
      const newListeners = listeners.filter(listener => listener !== func)
      this.events.set(type, newListeners)
    }
  }

  /**
   * 清空监听方法
   * 
   * @param {any} type 
   * @memberof EventBus
   */
  clear(type) {
    this.events.set(type, undefined)
  }
}

export default EventBus
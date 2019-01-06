var utils = require('../utils')
var internal = require('../internal')
var SubscriberItem = require('../subscriber')

/**
 * 返回新的 Promise 类型的对象
 *
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 * @returns {Promise} promise
 */
function then(onFulfilled, onRejected) {
  // 检验对应的状态需要执行的 onFulfilled/onRejected 是否是 function
  if ((!utils.isFunction(onFulfilled) && this._state === internal.FULFILLED) ||
    (!utils.isFunction(onRejected) && this._state === internal.REJECTED)) {
    return this
  }

  // 在 then 中新建一个内部 promise 用于返回
  var _promise = new this.constructor(internal.noop)

  // 判断 promise 状态
  if (this._state !== internal.PENDING) { // 如果状态不是 pending 则执行对应状态的方法
    var resolver = this._state === internal.FULFILLED ? onFulfilled : onRejected
    internal.unwrap(_promise, resolver, this._value)
  } else {
    // 如果状态是 pending
    this._subscribers.push(new SubscriberItem(_promise, onFulfilled, onRejected));
  }

  return _promise
}

module.exports = then
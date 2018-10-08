var utils = require('../utils')
var internal = require('../internal')
var SubscriberItem = require('../subscriber')

/**
 * 当 promise 状态变为 FULFILLED 调用
 * 当 promise 状态变为 REJECTED 调用
 * 返回新的 Promise 类型的对象
 *
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 * @returns {Promise} promise
 */
function then(onFulfilled, onRejected) {
  if ((!utils.isFunction(onFulfilled) && this._state === internal.FULFILLED) ||
    (!utils.isFunction(onRejected) && this._state === internal.REJECTED)) {
    return this
  }

  // 在 then 中新建一个内部 promise
  var _promise = new this.constructor(internal.noop)

  // 判断 promise 状态
  if (this._state !== internal.PENDING) { // 如果状态不是 pending 则执行对应状态的方法
    var resolver = this._state === internal.FULFILLED ? onFulfilled : onRejected
    internal.unwrap(_promise, resolver, this._outcome)
  } else { // 如果状态是 pending 则将 promise 加入队列
    this._subscribers.push(new SubscriberItem(_promise, onFulfilled, onRejected));
  }

  return _promise
}

module.exports = then
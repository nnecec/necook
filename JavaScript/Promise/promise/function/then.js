var utils = require('../utils')
var internal = require('../internal')

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

  if (this._state !== internal.PENDING) {
    var resolver = this._state === internal.FULFILLED ? onFulfilled : onRejected
  } else {
    subscribe(this, _promise, onFulfilled, onRejected)
  }
}

module.exports = then
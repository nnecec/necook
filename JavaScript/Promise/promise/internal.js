
/**
 * 添加到
 *
 * @param {*} parent
 * @param {*} child
 * @param {*} onFulfillment
 * @param {*} onRejection
 */
function subscribe(parent, child, onFulfilled, onRejected) {

}

module.exports = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
  noop: function () { },
  subscribe: subscribe
}
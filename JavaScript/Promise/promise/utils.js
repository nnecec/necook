function isFunction(x) {
  return typeof x === 'function'
}

function isArray(x) {
  return Object.prototype.toString.call(x) === '[object Array]'
}

module.exports = {
  isFunction: isFunction,
  isArray: isArray,
}

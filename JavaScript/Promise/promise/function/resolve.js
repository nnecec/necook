var internal = require('../internal')

function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return internal.handlers.resolve(new this(internal.noop), value);
}

module.exports = resolve
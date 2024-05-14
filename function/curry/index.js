/**
 *
 * @param {Function} func
 * @description 函数柯里化
 */
function curry(func) {
  const expectArgsLength = func.length;
  const that = this;
  const args = [];
  function _curry(x) {
    args.push(x);
    if (args.length === expectArgsLength) {
      return func.apply(that, args);
    }
    return _curry;
  }
  return _curry;
}

/**
 * bind实现
 */
function curry1(func) {
  return function _func(...args) {
    if (func.length === args.length) {
      return func.apply(this, args);
    }
    return _func.bind(this, ...args);
  };
}
exports.curry = curry1;

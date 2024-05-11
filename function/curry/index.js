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

exports.curry = curry;

/**
 *
 * @param {Function} func
 * @param {Object} context
 */
function bind(func, context, ...args) {
  context = context || globalThis;
  return function (..._args) {
    const finalArgs = args.concat(_args);
    const result = func.call(context, ...finalArgs);
    return result;
  };
}

exports.bind = bind;

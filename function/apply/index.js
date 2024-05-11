/**
 *
 * @param {Function} func
 * @param {Object} context
 * @param {Array} args
 */
function apply(func, context, args) {
  context = context || globalThis
  context.func = func;
  args = args || [];
  const result = context.func(...args);
  delete context.func;
  return result;
}

exports.apply = apply;

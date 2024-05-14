/**
 *
 * @param {Object} context
 * @param  {...any} args
 */
function bind(context, ...args) {
  context = context || globalThis;
  return (..._args) => {
    const funcKey = Symbol.for("func");
    context[funcKey] = this;
    const res = context[funcKey](...args.concat(_args));
    delete context[funcKey];
    return res;
  };
}

exports.bind = bind;

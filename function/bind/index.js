/**
 *
 * @param {Object} context
 * @param  {...any} args
 */
function bind(context, ...args) {
  const func = this;
  context = context || globalThis;
  return function () {
    const finalArgs = args.concat(Array.from(arguments));
    return func.apply(context, finalArgs);
  };
}

exports.bind = bind;

function call(func, context, ...args) {
  context = context || {};
  context.func = func;
  const result = context.func(...args);
  delete context.func;
  return result;
}

exports.call = call;

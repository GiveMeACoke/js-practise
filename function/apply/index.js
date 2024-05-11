function apply(context, args) {
  const func = this;
  context = context || globalThis;
  context._func = func;
  args = args || [];
  const result = context._func(...args);
  delete context._func;
  return result;
}

exports.apply = apply;

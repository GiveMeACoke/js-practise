function call(context, ...args) {
  context = context || globalThis;
  const funcKey = Symbol.for("func");
  context[funcKey] = this;
  const res = context[funcKey](...args);
  delete context[funcKey];
  return res;
}

exports.call = call;

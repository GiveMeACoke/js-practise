function apply(ctx, args) {
  ctx = ctx || globalThis;
  args = args || [];
  const funcKey = Symbol.for("func");
  ctx[funcKey] = this;
  const result = ctx[funcKey](...args)
  delete ctx[funcKey]
  return result
}
exports.apply = apply;

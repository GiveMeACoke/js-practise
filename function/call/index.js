function call(context, ...args) {
  const func = this
  context = context || globalThis
  context.func = func
  const result = context.func(...args)
  delete context.func
  return result
}

exports.call = call;

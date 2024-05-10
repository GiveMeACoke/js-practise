
/**
 * newObj函数，复刻new操作符的功能
 */
 function newObj(Func, ...args) {
  const obj = {};
  Func.prototype.constructor = Func;
  Object.setPrototypeOf(obj, Func.prototype);

  const result = Func.apply(obj, args);
  return result instanceof Object ? result : obj;
}


exports.newObj = newObj;
/**
 * newObj函数，复刻new操作符的功能
 */
function newObj(Func, ...args) {
  // 创建新的对象
  const obj = {};
  // 指定原型
  Object.setPrototypeOf(obj, Func.prototype);
  // 绑定构造函数
  Func.prototype.constructor = Func;
  // 执行构造函数
  const res = Func.call(obj, ...args);
  // 返回结果或者新对象
  return res instanceof Object ? res : obj;
}

// 使用Object.create模拟new操作符的功能
function newObj1(Func, ...args) {
  const obj = Object.create(Func.prototype);
  // 执行构造函数
  const res = Func.call(obj, ...args);
  // 返回结果或者新对象
  return res instanceof Object ? res : obj;
}

exports.newObj = newObj;

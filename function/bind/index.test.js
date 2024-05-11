const { bind } = require("./index");

describe("bind function", () => {
  test("should store bound parameters and apply them when calling the bound function", () => {
    function greet(greeting, punctuation) {
      return greeting + ", " + this.name + punctuation;
    }

    const context = { name: "Alice" };

    const temp = Function.prototype.bind;
    Function.prototype.bind = bind;
    // 使用 Function.prototype.bind 创建绑定函数
    const boundFunction = greet.bind(context, "Hello", "!");
    Function.prototype.bind = temp;
    // 调用绑定函数
    const result = boundFunction();

    expect(result).toBe("Hello, Alice!");
  });

  test("should bind the correct context and concatenate all arguments", () => {
    "use strict"; // 防止 `this` 被封装到到包装对象中
    // 定义 log 函数
    function log(...args) {
      console.log(this, ...args);
    }

    const consoleSpy = jest.spyOn(console, "log");
    const temp = Function.prototype.bind;
    Function.prototype.bind = bind;
    // 使用 bind 创建第一个绑定函数
    const boundLog = log.bind("this value", 1, 2);
    // 使用 bind 创建第二个绑定函数
    const boundLog2 = boundLog.bind("new this value", 3, 4);
    Function.prototype.bind = temp;
    // 调用绑定函数，并传入新的参数
    boundLog2(5, 6);

    // 期望结果与代码中的输出一致
    expect(consoleSpy).toHaveBeenCalledWith("this value", 1, 2, 3, 4, 5, 6);
    consoleSpy.mockRestore();
  });
});

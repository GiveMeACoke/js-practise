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
});

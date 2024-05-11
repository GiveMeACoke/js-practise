const { call } = require("./index");

describe("call function", () => {
  test("should call the function with the provided context and arguments", () => {
    const obj = {
      value: 42,
      getValue: function () {
        return this.value;
      },
    };

    // 使用Function.prototype.call调用函数
    const result1 = obj.getValue.call({ value: 100 });
    // 使用你提供的call函数调用函数
    const result2 = call(obj.getValue, { value: 100 });

    expect(result1).toBe(100);
    expect(result2).toBe(100);
  });

  test("should return the result of the called function", () => {
    function add(a, b) {
      return a + b;
    }

    // 使用Function.prototype.call调用函数
    const result1 = add.call(null, 2, 3);
    // 使用你提供的call函数调用函数
    const result2 = call(add, null, 2, 3);

    expect(result1).toBe(5);
    expect(result2).toBe(5);
  });

  test("should handle function with no arguments", () => {
    function sayHello() {
      return "Hello";
    }

    // 使用Function.prototype.call调用函数
    const result1 = sayHello.call();
    // 使用你提供的call函数调用函数
    const result2 = call(sayHello);

    expect(result1).toBe("Hello");
    expect(result2).toBe("Hello");
  });

  test("should use globalThis as default context if context is not provided", () => {
    function greet() {
      return `Hello, ${this.name}!`;
    }

    globalThis.name = "World";

    // 使用 Function.prototype.apply 调用函数
    const result1 = greet.call();
    // 使用你提供的 apply 函数调用函数
    const result2 = call(greet, undefined);

    expect(result1).toBe("Hello, World!");
    expect(result2).toBe("Hello, World!");
  });
});

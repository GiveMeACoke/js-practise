const { apply } = require("./index.js");

describe("apply function", () => {
  test("should call the function with the provided context and arguments array", () => {
    const obj = {
      value: 42,
      add: function (a, b) {
        return this.value + a + b;
      },
    };

    // 使用 Function.prototype.apply 调用函数
    const result1 = obj.add.apply({ value: 100 }, [2, 3]);
    // 使用你提供的 apply 函数调用函数
    const result2 = apply(obj.add, { value: 100 }, [2, 3]);

    expect(result1).toBe(105);
    expect(result2).toBe(105);
  });

  test("should return the result of the called function", () => {
    function multiply(a, b) {
      return a * b;
    }

    // 使用 Function.prototype.apply 调用函数
    const result1 = multiply.apply(null, [2, 3]);
    // 使用你提供的 apply 函数调用函数
    const result2 = apply(multiply, null, [2, 3]);

    expect(result1).toBe(6);
    expect(result2).toBe(6);
  });

  test("should handle function with no arguments", () => {
    function sayHello() {
      return "Hello";
    }

    // 使用 Function.prototype.apply 调用函数
    const result1 = sayHello.apply(null);
    // 使用你提供的 apply 函数调用函数
    const result2 = apply(sayHello, null, []);

    expect(result1).toBe("Hello");
    expect(result2).toBe("Hello");
  });

  test("should use globalThis as default context if context is not provided", () => {
    function greet() {
      return `Hello, ${this.name}!`;
    }

    globalThis.name = "World";

    // 使用 Function.prototype.apply 调用函数
    const result1 = greet.apply();
    // 使用你提供的 apply 函数调用函数
    const result2 = apply(greet, undefined, []);

    expect(result1).toBe("Hello, World!");
    expect(result2).toBe("Hello, World!");
  });
});

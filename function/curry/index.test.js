const { curry } = require("./index.js");

describe("curry function", () => {
  it("should curry a function correctly", () => {
    const add = (a, b, c) => a + b + c;
    const curriedAdd = curry(add);
    const add1 = curriedAdd(1);
    const add2 = add1(2);
    const result = add2(3);
    expect(result).toBe(6);
  });
});

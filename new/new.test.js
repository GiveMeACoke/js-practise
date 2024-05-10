const newObj = require('./index.js').newObj;

describe('newObj function', () => {
  it('should create a new object with the given constructor and arguments', () => {
    function TestFunc(name, age) {
      this.name = name;
      this.age = age;
    }

    const name = 'Alice';
    const age = 25;
    const obj = newObj(TestFunc, name, age);

    expect(obj).toBeInstanceOf(TestFunc);
    expect(obj.name).toBe(name);
    expect(obj.age).toBe(age);
  });

  it('should return the result if the constructor returns an object', () => {
    function TestFuncReturnsObject() {
      return { returned: true };
    }

    const obj = newObj(TestFuncReturnsObject);
    expect(obj).toEqual({ returned: true });
  });
});
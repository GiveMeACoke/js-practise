const promiseAPlusTest = require("promises-aplus-tests");
const Promise = require("./promise.js");

promiseAPlusTest(
  {
    resovled: (value) => new Promise((resolve) => resolve(value)),
    rejected: (reason) => new Promise((resolve, reject) => reject(reason)),
    deferred: () => {
      const obj = {};
      obj.promise = new Promise((resolve, reject) => {
        obj.resolve = resolve;
        obj.reject = reject;
      });
      return obj;
    },
  },
  {
    reportor: "spec",
    bail: true,
  }
);

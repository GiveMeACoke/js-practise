const MyPromise = require("./promise.js");

const promisesAplusTests = require("promises-aplus-tests");

promisesAplusTests(
  {
    deferred: MyPromise.deferred,
    resolved: MyPromise.resolved,
    rejected: MyPromise.rejected,
  },
  {
    bail: true,
  },
  (err) => {
    console.error("err", err);
  }
);

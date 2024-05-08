const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  state;
  value;
  reason;

  onFulfilledHandlers = [];
  onRejectedHandlers = [];

  constructor(excutor) {
    // 初始化一个Promise，状态为pending
    this.state = PENDING;
    // 直接执行excutor函数，传入resolve和reject方法, 防止this的引用错误，用bind绑定this
    excutor(this.resolve.bind(this), this.reject.bind(this));
  }

  /**
   * resolve接收一个value，这个value可以是undefined，promise或者其他类型
   */
  resolve = (value) => {
    // 将状态更改为fulfilled，并且不允许再次更改
    if (this.state !== PENDING) {
      return;
    }
    this.state = FULFILLED;
    this.value = value;
    // 执行一下挂起的处理函数
    this.onFulfilledHandlers.forEach((func) => {
      func(this.value);
    });
    this.onFulfilledHandlers = [];
    this.onRejectedHandlers = [];
  };

  /**
   * reject接收一个reason，表示拒绝原因，可以是任意类型
   */
  reject = (reason) => {
    if (this.state !== PENDING) {
      return;
    }
    this.state = REJECTED;
    this.reason = reason;
    // 执行一下挂起的处理函数
    this.onRejectedHandlers.forEach((func) => {
      func(this.reason);
    });
    this.onRejectedHandlers = [];
    this.onFulfilledHandlers = [];
  };

  /**
   * 实现一个then方法，接收两个参数，onFulfilled和onRejected,分别处理，resolve和reject后的工作
   */
  then = (onFulfilled, onRejected) => {
    const thenPromise = new Promise((resolve, reject) => {
      onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (r) => {
              throw r;
            };

      if (this.state === PENDING) {
        // 异步处理
        this.onFulfilledHandlers.push((v) => {
          setTimeout(() => {
            try {
              const x = onFulfilled(v);
              resolvePromise(thenPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedHandlers.push((r) => {
          setTimeout(() => {
            try {
              const x = onRejected(r);
              resolvePromise(thenPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(thenPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(thenPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
    return thenPromise;
  };
}

const resolvePromise = (thenPromise, x, resolve, reject) => {
  if (Object.is(thenPromise, x)) {
    throw new TypeError("不允许循环引用promise");
  }
  const isPromise = x instanceof Promise;
  if (isPromise) {
    return x.then((y) => {
      resolvePromise(thenPromise, y, resolve, reject);
    }, reject);
  }

  if (x === null || (typeof x !== "object" && typeof x !== "function")) {
    return resolve(x);
  }
  // 这里如果x是undefined或者null的话，会报错
  try {
    const then = x.then;
    if (typeof then === "function") {
      let called = false;
      try {
        // 这里如果x是一个原型为null的对象的话，会报错
        then.call(
          x,
          function onFulfilled(y) {
            if (called) return;
            called = true;
            resolvePromise(thenPromise, y, resolve, reject);
          },
          function onRejected(r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  } catch (error) {
    reject(error);
  }
};

Promise.deferred = function () {
  const obj = {};
  const promise = new Promise((resolve, reject) => {
    obj.resolve = resolve;
    obj.reject = reject;
  });
  return {
    ...obj,
    promise,
  };
};

Promise.resolved = (value) => {
  return new Promise((resolve) => resolve(value));
};

Promise.rejected = (reason) => {
  return new Promise((resolve, reject) => reject(reason));
};
module.exports = Promise;

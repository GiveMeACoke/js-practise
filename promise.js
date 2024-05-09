const STATE = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class Promise {
  state;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];
  value;
  reason;
  constructor(excutor) {
    this.state = STATE.PENDING;
    excutor(this.resolve, this.reject);
  }

  _resolve = (value) => {
    if (this.state !== STATE.PENDING) {
      return;
    }
    this.state = STATE.FULFILLED;
    this.value = value;
    this.onFulfilledCallbacks.forEach((func) => {
      func(value);
    });
  };

  resolve = (x) => {
    resolvePromise(this, x, this._resolve, this.reject);
  };

  reject = (reason) => {
    if (this.state !== STATE.PENDING) {
      return;
    }
    this.state = STATE.REJECTED;
    this.reason = reason;
    this.onRejectedCallbacks.forEach((func) => {
      func(reason);
    });
  };

  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (r) => {
            throw r;
          };

    const thenPromise = new Promise((resolve, reject) => {
      const onFulfilledCallback = (value) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(value);
            resolvePromise(thenPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const onRejectedCallback = (reason) => {
        setTimeout(() => {
          try {
            const x = onRejected(reason);
            resolvePromise(thenPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.state === STATE.PENDING) {
        this.onFulfilledCallbacks.push(onFulfilledCallback);
        this.onRejectedCallbacks.push(onRejectedCallback);
        return;
      }
      if (this.state === STATE.FULFILLED) {
        onFulfilledCallback(this.value);
        return;
      }
      if (this.state === STATE.REJECTED) {
        onRejectedCallback(this.reason);
        return;
      }
    });
    return thenPromise;
  };
}

function resolvePromise(promise, x, resolve, reject) {
  if (Object.is(promise, x)) {
    throw new TypeError("循环引用错误");
  }
  if (x === null) {
    return resolve(x);
  }
  if (typeof x !== "function" && typeof x !== "object") {
    return resolve(x);
  }
  try {
    const then = x.then;
    if (typeof then !== "function") {
      return resolve(x);
    }
    let called = false;
    try {
      then.call(
        x,
        (v) => {
          if (called) return;
          called = true;
          resolvePromise(promise, v, resolve, reject);
        },
        (r) => {
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
  } catch (error) {
    reject(error);
  }
}

module.exports = Promise;

new Promise((resolve) =>
  resolve({
    then: () => "thenable",
  })
).then((res) => console.log("res", res));

const PENDING = "pending";

const FULFILLED = "fulfilled";

const REJECTED = "rejected";

class Promise {
  state;
  onFulFilledCallbacks = [];
  onRejectedCallbacks = [];
  value;
  reason;
  constructor(excutor) {
    this.state = PENDING;
    excutor(this.resolve, this.reject);
  }

  resolveDirectly = (value) => {
    if (!PENDING) return;
    this.value = value;
    this.state = FULFILLED;
    this.onFulFilledCallbacks.forEach((func) => {
      func(value);
    });
  };

  resolve = (value) => {
    if (this === value) {
      throw new TypeError("循环引用问题");
    }
    if (value === null) {
      return this.resolveDirectly(value);
    }
    if (typeof value !== "object" && typeof value !== "function") {
      return this.resolveDirectly(value);
    }
    // thabled
    let then;
    try {
      then = value.then;
    } catch (error) {
      this.reject(error);
    }
    if (typeof then === "function") {
      let flag = false;
      try {
        then.call(
          value,
          (v) => {
            if (flag) return;
            flag = true;
            this.resolve(v);
          },
          (r) => {
            if (flag) return;
            flag = true;
            this.reject(r);
          }
        );
      } catch (error) {
        if (flag) return;
        flag = true;
        this.reject(error);
      }
    } else {
      this.resolveDirectly(value);
    }
  };

  reject = (reason) => {
    if (!PENDING) return;
    this.state = REJECTED;
    this.reason = reason;
    this.onRejectedCallbacks.forEach((func) => {
      func(reason);
    });
  };

  then = (onFulFilled, onRejected) => {
    return new Promise((resolve, reject) => {
      const onFulFilledCallback = (value) => {
        setTimeout(() => {
          try {
            if (typeof onFulFilled === "function") {
              const x = onFulFilled(value);
              resolve(x);
            } else {
              resolve(value);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      const onRejectedCallback = (reason) => {
        setTimeout(() => {
          try {
            if (typeof onRejected === "function") {
              const x = onRejected(reason);
              resolve(x);
            } else {
              reject(reason);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      if (this.state === PENDING) {
        this.onFulFilledCallbacks.push(onFulFilledCallback);
        this.onRejectedCallbacks.push(onRejectedCallback);
      }
      if (this.state === FULFILLED) {
        onFulFilledCallback(this.value);
      }
      if (this.state === REJECTED) {
        onRejectedCallback(this.reason);
      }
    });
  };
}

module.exports = Promise;

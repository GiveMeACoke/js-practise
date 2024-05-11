const PENDING = "pending";
const FULFILLED = "FULFILLED";
const REJECTED = "rejected";

class Promise {
  state;
  onResolvedCallback = [];
  onRejectedCallback = [];
  value;
  reason;
  constructor(excutor) {
    this.state = PENDING;
    excutor(this.resolve, this.reject);
  }

  resolveDirectly = (value) => {
    if (this.state !== PENDING) {
      return;
    }
    this.state = FULFILLED;
    this.value = value;
    this.onResolvedCallback.forEach((func) => func(value));
  };

  resolve = (value) => {
    if (this === value) {
      throw new TypeError("死循环了！");
    }
    if (value === null) return this.resolveDirectly(value);
    if (typeof value !== "function" && typeof value !== "object")
      return this.resolveDirectly(value);
    let then;
    try {
      then = value.then;
    } catch (error) {
      return this.reject(error);
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
    if (this.state !== PENDING) {
      return;
    }
    this.state = REJECTED;
    this.reason = reason;
    this.onRejectedCallback.forEach((func) => func(reason));
  };

  then = (onFulfilled, onRejected) => {
    return new Promise((resolve, reject) => {
      onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (reason) => {
              throw reason;
            };
      const onFulfilledCallback = (value) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      };
      const onRejectedCallback = (reason) => {
        setTimeout(() => {
          try {
            const x = onRejected(reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.state === PENDING) {
        this.onResolvedCallback.push(onFulfilledCallback);
        this.onRejectedCallback.push(onRejectedCallback);
      }
      if (this.state === FULFILLED) {
        onFulfilledCallback(this.value);
      }
      if (this.state === REJECTED) {
        onRejectedCallback(this.reason);
      }
    });
  };
}

Promise.prototype.all = (promises = []) => {
  if (!Array.isArray(promises)) {
    throw new TypeError("参数必须是一个promise数组");
  }
  const result = Array.from({
    length: promises.length,
  });
  let finishedCount = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((p, index, arr) => {
      p.then(
        (res) => {
          finishedCount += 1;
          result[index] = res;
          if (finishedCount === arr.length) {
            resolve(result);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};

Promise.prototype.race = (promises) => {
  if (!Array.isArray(promises)) {
    throw new TypeError("参数必须是一个promise数组");
  }

  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      p.then(
        (res) => {
          resolve(res);
        },
        (r) => {
          reject(r);
        }
      );
    });
  });
};

module.exports = Promise;

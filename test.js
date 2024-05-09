// new Promise((resolve) => resolve(new Promise((resolve) => resolve(11)))).then(
//   (res) => {
//     return console.log("res", res);
//   }
// );

new Promise((resolve) => {
  resolve({
    then: (onFulfilled, onRejected) => {
      onFulfilled("thenable");
    },
  });
}).then(
  (res) => console.log("res", res),
  (reason) => console.log("reason", reason)
);

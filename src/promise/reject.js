define(["./core"], function(PromiseA) {
  PromiseA.reject = function(reason) {
    return new PromiseA(function(resolve, reject) {
      reject(reason);
    });
  };
  
  return PromiseA.reject;
});
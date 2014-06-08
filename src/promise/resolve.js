define(["./core"], function(PromiseA) {
  PromiseA.resolve = function(value) {
    if(value && value.constructor === PromiseA) {//it's already a promise
      return value;
    }
    return new PromiseA(function(resolve) {
      resolve(value);
    });
  };
  
  return PromiseA.resolve;
});
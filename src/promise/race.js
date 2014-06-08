define(["./core"], function(PromiseA) {
  PromiseA.race = function(promises) {
    if(!promises || !promises.length) {
      throw new TypeError("should provide an array of promises");
    }
    return new PromiseA(function(resolve, reject) {
      promises.forEach(function(p) {
        if(p && typeof p.then === "function") {
          p.then(resolve, reject);
        } else {//or directly resolve as a simple value
          resolve(p);
        }
      });
    });
  };
});
define(["./core"], function(PromiseA) {
  
  PromiseA.all = function(promises) {
    if(!promises) {
      throw new TypeError("should provide an array of promises");
    }
    return new Promise(function(resolve, reject) {
      var results = [], _resolve, i = 0;
      if(!promises.length) {
        return resolve(results);
      }
      
      _resolve = function(value) {
        i++;
        results.push(value);
      };
      promises.forEach(function(p) {
        if(p && typeof p.then === "function") {
          p.then(_resolve, reject);
        } else {//resolve as an simple value
          _resolve(p);
        }
      });
    });
  };
  
});
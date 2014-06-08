define(["../core", "./core", "./reject", "./resolve", "./race"], function(boost, PromiseA) {
  boost.Promise = PromiseA;
  
  
  // This is not a ES6 API, but very and useful and popular among other promise libraries.
  boost.deferred = function() {
    var deferred = {};
    
    deferred.promise = new PromiseA(function(resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    
    return deferred;
  };
  
  return boost.Promise;
});
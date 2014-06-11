define(function() {
  
  return function(obj) {
    if(Object.create) {
      return Object.create(obj);
    }
    var F = function() {};
    F.prototype = obj;
    return new F();
  };
  
});
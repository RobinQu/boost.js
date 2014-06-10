/* Array subclass */

define(["core"], function(boost) {
  
  Array.extend = function(props) {
    
    XArray = function() {
      // initialized the returned object
      var arr = [];
      arr.push.apply(arr, arguments);
      arr._proto__ = XArray.prototype;
      return arr;
    };
  
    //get all methods from `Array.prototype`
    XArray.prototype = [];
  
    //extension methods
    if(props) {
      boost.mixin(XArray.prototype, props);
    }
  };
  
  boost.Array = Array.extend();
  
  return boost.Array;
});
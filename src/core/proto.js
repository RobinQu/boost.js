define(function() {
  
  //https://code.google.com/p/phantomjs/issues/detail?id=522
  if(!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
      var slice = Array.prototype.slice,
          fn = this,
          args = slice.call(arguments, 1);

      if (args.length) {
        return function() {
            return arguments.length ? fn.apply(context, args.concat(slice.call(arguments))) : fn.apply(context, args);
        };
      }
      return function() {
        return arguments.length ? fn.apply(context, arguments) : fn.call(context);
      };
    };
  }
  
  //Space triming
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  
  if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, context) {
      var i,len;
      for(i=0,len=this.length; i<len; i++) {
        fn.call(context || null, this[i], i, this);
      }
    };
  }
  
  return {};
  
});
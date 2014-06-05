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
  
});
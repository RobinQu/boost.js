define(function() {
  var context = {
    win: window,
    undefined: undefined,
    doc: window.document,
    noop: function() {}
  };
  //https://code.google.com/p/phantomjs/issues/detail?id=522
  context.bind = function(fn, context) {
    var slice = Array.prototype.slice,
        args = slice.call(arguments, 2);
    if(Function.prototype.bind) {
      args.unshift(context);
      return fn.bind.apply(fn, args);
    }
    
    if (args.length) {
      return function() {
          return arguments.length
              ? fn.apply(context, args.concat(slice.call(arguments)))
              : fn.apply(context, args);
      };
    }
    return function() {
      return arguments.length
          ? fn.apply(context, arguments)
          : fn.call(context);
    };
  };
  context.slice = context.bind(Array.prototype.slice.call, Array.prototype.slice);
  
  context.mixin = function mixin() {
    var args = context.slice(arguments),
        target = args.shift(),
        ret;
    if(!target) {return;}
    if(!args.length) { return mixin(context, target);}
    ret = args.reduce(function(prev, props) {
      Object.keys(props).forEach(function(k) {
        prev[k] = props[k];
      });
      return prev;
    }, target);
    return ret;
  };
  return context;
});
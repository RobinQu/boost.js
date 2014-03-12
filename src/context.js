define(function() {
  var slice = Array.prototype.slice.call.bind(Array.prototype.slice),
  context = {
    win: window,
    undefined: undefined,
    doc: window.document,
    slice: slice,
    noop: function() {}
  };
  context.mixin = function mixin() {
    var args = slice(arguments),
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
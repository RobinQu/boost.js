define(function() {
  return function mixin() {
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
});
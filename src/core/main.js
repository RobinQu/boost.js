define([
  "./mixin",
  "./misc",
  "./guid",
  "./log",
  "./beget",
  "./access",
  "./proto"
], function(mixin) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift({mixin:mixin});
  return mixin.apply(null, args);
});
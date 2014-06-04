define([
  "./mixin",
  "./misc",
  "./guid",
  "./proto"
], function(mixin, misc, guid) {
  return mixin({}, misc, guid);
});
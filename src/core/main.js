define([
  "./mixin",
  "./misc",
  "./guid",
  "./proto"
], function(mixin, misc, guid) {
  return mixin({mixin:mixin}, misc, guid);
});
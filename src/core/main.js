define([
  "./mixin",
  "./misc",
  "./guid",
  "./log",
  "./proto"
], function(mixin, misc, guid, log) {
  return mixin({mixin:mixin}, misc, guid, log);
});
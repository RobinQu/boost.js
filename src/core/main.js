define([
  "./mixin",
  "./misc",
  "./guid",
  "./log",
  "./proto",
  "./beget"
], function(mixin, misc, guid, log) {
  return mixin({mixin:mixin}, misc, guid, log);
});
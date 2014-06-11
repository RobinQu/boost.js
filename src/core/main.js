define([
  "./mixin",
  "./misc",
  "./guid",
  "./log",
  "./beget",
  "./proto"
], function(mixin, misc, guid, log, beget) {
  return mixin({mixin:mixin}, misc, guid, log, beget);
});
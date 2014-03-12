define(["./context"], function(boost) {
  var Events = {};
  Events.on = function() {};
  Events.off = function() {};
  Events.once = function() {};
  boost.mixin(Events);
  return Events;
});
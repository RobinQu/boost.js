define(["./event", "./closest"], function(Event, closest) {
  
  var delegation = {};
  
  delegation.bind = function(el, eventType, fn, capture) {
    return Event.add(el, eventType, function(e) {
      e.delegateTarget = closest(e.target, selector, true, el);
      if(e.delegateTarget) {
        fn.call(el, e);
      }
    }, capture);
  };
  
  delegation.unbind = Event.remove;
  
  return delegation;
  
});
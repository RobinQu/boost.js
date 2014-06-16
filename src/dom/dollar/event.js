define(["../event", "../delegation"], function(Event, delegation) {
  
  var events = {};
  
  events.on = function(eventType, selector, fn, capture) {
    if(typeof selector === "string") {//do delegation
      return this.forEach(function(el) {
        delegation.bind(el, eventType, selector, fn, capture);
      });
    }
    
    capture = fn;
    fn = selector;
    
    return this.forEach(function(el) {
      Event.add(eventType, el, fn, capture);
    });
  };
  
  events.off = function(eventType, selector, fn, capture) {
    if(typeof selector === "string") {
      return this.forEach(function(el) {
        delegation.unbind(el, eventType, fn._delegate, capture);
      });
    }
    capture = fn;
    fn = selector;
    
    return this.forEach(function(el) {
      Event.remove(el, eventType, fn, capture);
    });
  };
  
  return events;
  
});
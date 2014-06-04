define(["./context", "./data"], function(boost, $data) {
  var Events = {}, addEvent, removeEvent, normalizeEvent, NO_BUBBLES;
  
  NO_BUBBLES = ["focus", "change", "submit"];
  
  addEvent = function(elem, type, capture) {
    var listener = $data(elem, "_listener");
    
    if(!listener) {
      listener = $data(elem, "_listener", function() {
        return Events.handle(elem, arguments);
      });
    }
    
    if(elem.addEventListener) {
      elem.addEventListner(type, listener, !!capture);
    } else {
      elem.attachEvent("on" + type.toLowerCase(), listener);
    }
  };
  
  removeEvent = function(elem, type) {
    var listener = $data(elem, "_listener");
    if(listener) {
      if(elem.removeEventListener) {
        elem.removeEventListener(type, method);
      } else {
        elem.detachEvent("on" + type.toLoserCase(), method);
      }
    }
  };
  
  normalizeEvent = function(event) {
    
  };
  
  Events.add = function(eventType, elem, hanlder, capture) {
    if(elem.length > 0) {
      elem.forEach(function(el) {
        Events.on(el, elem[i], handler);
      });
      return this;
    }
    
    var events, handlers, method;
    
    if(elem.nodeType === 3 || elem.nodeType === 8) { return this; }
    
    if(typeof handler === "function") {// a simple function
      method = handler;
      handler = {
        context: null,
        method: method
      };
    } else {
      method = handler.method;
    }
    events = $data(elem, "_events") || $data(elem, "_events", {});
    handlers = events[eventType];
    if(!handlers) {
      handlers = events[eventType] = {};
    }
    handlers[context.hashFor(handler.context, handler.method)] = handler;
    //disable capture by default
    addEvent(elem, type, method, false);
    return this;
  };
  
  //create a custom events
  Events.simulate = function(elem, eventType, attrs) {
    // mock an event object
    var event = {
      type: eventType,
      target: elem,
      preventDefault: function() {
        this.cancelled = true;
      },
      stopPropagation: function() {
        this.bubles = false;
      },
      timeStamp: Date.now(),
      cancelled: false,
      bubbles: NO_BUBBLES.indexOf(eventType) > -1
    };
    
    
    return event;
  };
  
  Events.remove = function(elem, eventType, handler) {
    if(elem.length > 0) {
      elem.forEach(function(el) {
        Events.remove(el, eventType, handler);
      });
      return this;
    }
    var handlers, events, k, clean;
    clean = false;
    events = $data(elem, "_events");
    if(eventType) {
      handlers = events[eventType];
      
      if(handler) {//remove specific event registeration
        // removeEvent(elem, eventType, handler.method || handler);
        delete handlers[context.hashFor(handler.context, handler.method)];
        k = null;
        for(k in handlers) {//check for other handlers
          break;
        }
        if(!key) {
          clean = true;
        }
      } else {//clean all handlers for this event
        clean = true;
      }
    } else {//remove events for this handler
      for(k in events) {
        Events.remove(elem, events[k]);
      }
    }
    if(clean) {
      delete events[eventType];
      removeEvent(elem, eventType);
    }
    
    // check if we need to clean `events`
    k = null;
    for(k in events) {
      break;
    }
    if(!key) {//no other events found, then cleanup stored data
      $data(elem, "_events", null);
      $data(elem, "_listener", null);
    }
    
    return this;
  };
  
  Events.trigger = function(elem, eventType, args) {
    var fn, event, current, ret;
    if(elem.length && elem.length > 0) {
      elem.forEach(function(el) {
        Events.trigger(el, eventType);
      });
      return this;
    }
    if(elem.nodeType === 3 || elem.nodeType === 8) {
      return this;
    }
    if(typeof elem[eventType] === "function") {//native event type
      fn = elem[eventType];
    }
    event = args[0];
    if(!event) {//when trigger a custom event, no acutal event is given
      event = Events.simulate(elem, eventType);
      args.unshift(event);
    }
    event.type = eventType;
    
    //trigger custom events; do bubbling until `document`
    current = elem;
    do {
      ret = Events.handle(current, event, args);
      current = (current === document) ? null : (current.parentNode || document);
    } while(!ret && event.bubbles && current);
    current = null;
    
    //it's not a native event, but has onxxx handlers
    if(!fn && elem["on" + eventType] && elem["on" + eventType].apply(elem, args) === false) {
      ret = false;
    }
    
    //trigger native events
    if(fn && ret !== false) {
      try {
        fn();
      } catch(e) {}
    }
    
    return ret;
  };
  
  Events.handle = function(elem, event, args) {
    var handlers, k, ret, val;
    // args = Array.prototype.slice.call(arguments, 0);
    // elem = args.shift();
    event = normalizeEvent(event || window.event);
    
    handlers = ($data(elem, "_events") || {})[event.type];
    if(!handlers) {
      return false;
    }
    
    args.unshift(event);
    for(k in handlers) {
      handler = handlers[k];
      ret = handler.method.apply(handler.context, args);
      if(ret === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      if(val !== false) {
        val = ret;
      }
    }
    //return the result of this event dispatch
    return val;
  };
  
  
  return Events;
});
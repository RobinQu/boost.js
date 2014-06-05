define(["core", "./data", "./ready"], function(boost, $data, $ready) {
  var addEvent, removeEvent, normalizeEvent, NO_BUBBLES;
  
  NO_BUBBLES = ["focus", "change", "submit"];
  
  boost.Event = function(originalEvent) {
    var i, len, k;
    if(originalEvent) {//copy attributes
      for(i=0,len=Event._props; i<len; i++) {
        k = Event._props[i];
        this[k] = originalEvent[k];
      }
    }
    
    var doc, body;
    this.timeStamp = this.timeStamp || Date.now();
    if(!this.target) {
      this.target = this.srcElement || document;
    }
    if(this.target.nodeType === 3) {
      this.target = this.target.parentNode;
    }
    if(!this.relatedTarget && this.fromElement) {
      this.relatedTarget = this.fromElement === this.target ? this.toElement : this.fromElement;
    }
    if(this.pageX === undefined && this.clientX !== undefined) {//IE
      doc = document.documentElement;
      body = document.body;
      this.pageX = this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
      this.pageY = this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
    }
    
    if(!this.which && (originalEvent.charCode === 0 ? this.charCode : this.keyCode)) {
      this.which = this.charCode || this.keyCode;
    }
    
    //TOOD: metakey, mousewheel, wheelDelta
    
  };
  
  boost.Event._props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view which touches targetTouches changedTouches animationName elapsedTime dataTransfer".split(" ");
  
  addEvent = function(elem, type, capture) {
    var listener = $data(elem, "_listener");
    
    if(!listener) {
      listener = $data(elem, "_listener", function() {//a shared handler that handles all event stored on the element
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
        elem.removeEventListener(type, method, false);
      } else {
        elem.detachEvent("on" + type.toLoserCase(), method);
      }
    }
  };
  
  normalizeEvent = function(event) {
    if(window.event === event) {
      return new boost.Event(event);
    }
    return event.normalized ? event : new boost.Event(event);
  };
  
  
  boost.mixin(boost.Event, {
    
    create: function(e) {
      return new boost.Event(e);
    },
    
    add: function(eventType, elem, hanlder, capture) {
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
    },
    
    simulate: function(elem, eventType, attrs) {
      // mock an event object
      var event = new E({
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
        bubbles: NO_BUBBLES.indexOf(eventType) > -1,
        normalized: true
      });
    
      if(attrs) {
        context.mixin(event, attrs);
      }
      return event;
    },
    
    remove: function(elem, eventType, handler) {
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
    }, 
    
    trigger: function(elem, eventType, args) {
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
    },
    
    handle: function(elem, event, args) {
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
    }
    
  });
  
  boost.Event.prototype = {
    
    preventDefault: function() {
      var event = this.originalEvent;
      if(event) {
        if(event.preventDefault) {
          event.preventDefault();
        } else {//IE
          event.returnValue = false;
        }
      }
      return this;
    },
    
    stopPropgation: function() {
      var event = this.originalEvent;
      if(event) {
        if(event.stopPropgation) {
          event.stopPropgation();
        } else {
          event.cancleBubble = true;
        }
      }
      return this;
    },
    
    normalized: true
    
  };
  
  return boost.Event;
});
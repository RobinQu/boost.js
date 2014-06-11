define(["runtime", "./observable"], function(boost, observable) {
  
  if(!window.WeakMap) {return;}
  
  var logger = boost.Logger.instrument("object_observer");
  
  // we store all objects reference in this map
  // `WeakMap` will reduce cycling refs
  // this weak map is shared by all `ObjectObserver`
  var observants = new WeakMap();
  
  // Weak ref to all observers
  var observers = new WeakMap();

  var ObjectObserver = boost.Object.extend({
    
    init: function(obj, filter) {
      logger.log("construct");
      // add target to map
      observants.set(this, obj);
      this._handler = this.handlerTemplate.bind(this);
      
      this.listeners = [];
      this.isObserving = false;
      this.filter = filter;
    },
    
    handlerTemplate: function(changes) {
      logger.log("handler", this.listeners.length);
      this.listeners.forEach(function(l) {
        l.call(this, changes);
      }, this);
    },
    
    connect: function(fn) {
      if(!fn) {
        return this;
      }
      logger.log("connect");
      var target = observants.get(this);
      if(!this.isObserving) {
        logger.log("observe", target);
        Object.observe(target, this._handler, this.filter);
      }
      this.listeners.push(fn);
      logger.log("add listener");
      return this;
    },
    
    disconnect: function(fn) {
      if(fn) {
        logger.log("remove listener");
        this.listeners.splice(this.listeners.indexOf(fn), 1);
      } else {//clean all
        logger.log("clear listener");
        this.listeners.length = 0;
      }
      if(!this.listeners.length) {//unboserve if we don't have any listeners
        logger.log("unobserve", obj);
        Object.unobserve(observants.get(this));
        this.isObserving = false;
      }
    },
    
    flush: function() {
      logger.log("flush");
      Object.deliverChangeRecords(this._handler);
    },
    
    isObjectObserver: true
    
  }, observable);
  
  ObjectObserver.create = function(obj) {
    logger.log("create");
    if(!observers.has(obj)) {
      observers.set(obj, new ObjectObserver(obj));
    }
    return observers.get(obj);
  };

  return ObjectObserver;
  
});
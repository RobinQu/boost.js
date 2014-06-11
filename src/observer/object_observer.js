define(["runtime", "./observable"], function(boost, observable) {
  
  if(!Object.observe) {return;}
  
  var logger = boost.Logger.instrument("object_observer");
  
  var ChangeTypes = ["add", "delete", "update", "splice"];
  
  // we store all objects reference in this map
  // `WeakMap` will reduce cycling refs
  // this weak map is shared by all `ObjectObserver`
  // var observants = new WeakMap();
  
  // Weak ref to all observers
  var observers = new WeakMap();

  var ObjectObserver = boost.Object.extend({
    
    init: function(obj, filter) {
      logger.log("construct");
      this.subject = obj;
      this.filter = filter;
      
    },
    
    connect: function(fn, filter) {
      if(!fn) {
        return this;
      }
      logger.log("connect");
      
      //store filter right on the function
      fn.filter = filter || this.filter;
      // var target = observants.get(this);
      
      if(!this.isObserving) {
        logger.log("observe", this.subject);
        this._handler = this.notifyChanges.bind(this);
        Object.observe(this.subject, this._handler);
      }
      if(this.listeners.indexOf(fn) === -1) {
        this.listeners.push(fn);
      }
      logger.log("add listener", this.listeners.length);
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
        // var obj = observants.get(this);
        logger.log("unobserve", this.subject);
        Object.unobserve(this.subject, this._handler);
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
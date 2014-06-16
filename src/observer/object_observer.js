define(["../runtime", "./observable"], function(boost, observable) {
  
  if(!Object.observe) {return;}
  
  var logger = boost.Logger.instrument("object_observer");
  
  var ChangeTypes = ["add", "delete", "update", "reconfigure", "setPrototype", "preventExtensions"];
  
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
      
      if(!this.isObserving) {
        logger.log("observe", this.subject);
        this._handler = this._notifyChanges.bind(this);
        Object.observe(this.subject, this._handler);
        this.isObserving = true;
      }
      this._addObserver(fn, filter);
      return this;
    },
    
    disconnect: function(fn) {
      this._removeObserver(fn);
      if(!this.listeners.length) {//unboserve if we don't have any listeners
        // var obj = observants.get(this);
        logger.log("unobserve", this.subject);
        Object.unobserve(this.subject, this._handler);
        this.isObserving = false;
      }
    },
    // 
    // flush: function() {
    //   logger.log("flush");
    //   Object.deliverChangeRecords(this._handler);
    // },
    
    // performChange: function(fn, type) {
    //   var notifier = Object.getNotifier(this.subject);
    //   
    //   // While it's nice to play with native API, we don't want to interfere all other observers
    //   // notifier.performChange(fn);
    //   this.isObserving = false;
    //   try { fn(); } catch(e) {
    //     logger.error(e.stack ? e.stack : e);
    //   }  finally {
    //     this.isObserving = true;
    //   }
    //   
    //   if(type) {
    //     this.notify({
    //       object: this.subject,
    //       type: type,
    //       synthetic: true
    //     });
    //   }
    //   return this;
    // },
    
    // setValue: function(key, value) {
    //   
    // },
    
    notify: function(notification) {
      var notifier = Object.getNotifier(this.subject);
      notifier.notify(notification);
      return this;
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
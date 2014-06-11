define(["runtime", "./observable"], function(boost, observable) {
  
  if(!Object.observe) {return;}
  
  var logger = boost.Logger.instrument("object_observer");
  
  var ChangeTypes = ["add", "delete", "update", "splice"];
  
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
      this.filter = filter;
      this.isObserving = false;
    },
    
    handlerTemplate: function(changes) {
      logger.log("handler, listeners %s, changes %s", this.listeners.length, changes.length);
      var sorted = {};
      changes.forEach(function(change) {
        var type = change.type;
        sorted[type] = sorted[type] || [];
        sorted[type].push(change);
      });
      this.listeners.forEach(function(l) {
        //default to accept all changes
        var wanted = changes;
        if(l.filter) {
          logger.log("apply filters", l.filter);
          wanted = l.filter.reduce(function(prev, cur, i) {
            // console.log(cur, sorted[cur], prev);
            return sorted[cur] ? prev.concat(sorted[cur]) : prev;
          }, []);
        }
        l.call(this, wanted);
      }, this);
    },
    
    connect: function(fn, filter) {
      if(!fn) {
        return this;
      }
      logger.log("connect");
      
      //store filter right on the function
      fn.filter = filter || this.filter;
      var target = observants.get(this);
      if(!this.isObserving) {
        logger.log("observe", target);
        Object.observe(target, this._handler);
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
        var obj = observants.get(this);
        logger.log("unobserve", obj);
        Object.unobserve(obj, this._handler);
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
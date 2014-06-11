define(["runtime", "./observable", "./object_observer"], function(boost, Observable, ObjectObserver) {
  
  var logger = boost.Logger.instrument("pathobserver");
  
  var paths = new WeakMap();
  
  var PathObserver = boost.Object.extend({
    
    init: function(obj, path) {
      this.listeners = new Set();
      this.isObserving = false;
      
      this._indirectHandler = this.indirectHandler.bind(this);
      this._directHandler = this.directHandler.bind(this);
    },
    
    _begin: function() {
      var self = this;
      boost.access(obj, path, function(current, key, prefix, end) {
        var ob, handler;
        logger.logger("setup", prefix, key);
        handler = end ? self._directHandler : self._indirectHandler;
        if(current === null || current === undefined) {
          //do nothing
          logger.logger("unreachabe");
        }
        if(typeof current === "object") {
          ob = ObjectObserver.create(current);
          ob.connect(handler);
        }
      });
    },
    
    _end: function() {
      var self = this;
      boost.access(obj, path, function(current, key, prefix, end) {
        var ob, handler;
        logger.logger("teardown", prefix, key);
        handler = end ? self._directHandler : self._indirectHandler;
        if(current === null || current === undefined) {
          //do nothing
          logger.logger("unreachabe");
        }
        if(typeof current === "object") {//array
          ob = ObjectObserver.create(current);
          ob.disconnect(handler);
        }
      });
    },
    
    _indirectHandler: function(changes) {},
    
    _directHandler: function(changes) {},
    
    connect: function(fn) {
      if(fn) {
        this.listeners.add(fn);
        if(!this.isObserving) {
          this._begin();
          this.isObserving = true;
        }
      }
    },
    
    disconnect: function(fn) {
      if(fn) {
        this.listeners.delete(fn);
      } else {
        this.listeners.clear();
      }
      if(!this.listeners.size) {
        this._end();
        this.isObserving = false;
      }
    }
    
  }, Observable);
  
  PathObserver.create = function(obj, path) {
    if(path === "") {//observe object itself
      return new ObjectObserver(obj);
    }
    if(boost.access(obj, path) === null) {
      throw new Error(path + " is unreachable");
    }
    
    //cache
    var obs = paths.get(obj) || {};
    if(!obs[path]) {
      obs[path] = new PathObserver(obj, path);
    }
    return obs[path];
  };
  
  
  return PathObserver;
  
});
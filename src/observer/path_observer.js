define(["runtime", "./observable", "./object_observer"], function(boost, Observable, ObjectObserver) {
  
  var logger = boost.Logger.instrument("path_observer");
  
  var paths = new WeakMap();
  
  var PathObserver = boost.Object.extend({
    
    init: function(obj, path) {
      logger.log("construct");
      this.segments = {};
      this.subject = obj;
      this.path = path;
    },
    
    _setup: function(pre, teardown) {
      var self = this,
          obj, path;
      
      
      obj = pre ? boost.access(this.subject, pre) : this.subject;
      path = pre ? this.path.slice(pre.length + 1) : this.path;
      logger.log(teardown ? "teardown" : "setup", obj, path);

      boost.access(obj, path, function(current, key, prefix, end) {
        var ob, handler;
        logger.log("access", prefix, key);
        if(current === null || current === undefined) {
          //do nothing
          logger.log("unreachabe");
        } else if(typeof current === "object") {
          if(teardown) {
            logger.log("remove", current, prefix);
            handler = self.segments[prefix];
            Object.unobserve(current, handler);
            delete self.segments[prefix];
          } else {
            logger.log("add", current, prefix);
            handler = self.segments[prefix] = self._createSegmentHandler(current, prefix);
            Object.observe(current, handler);
          }
        }
        
      });
    },
    
    _createSegmentHandler: function(subject, prefix) {
      var self = this;
      return function(changes) {
        logger.log("notify");
        changes.forEach(function(change) {
          var obj = change.object,
              type = change.type,
              name = change.name,
              value = obj[name];
          if(type === Observable.Types.ADD && value !== null && typeof value === "object") {//changed from `null|undefined` to an object
            self._setup(value, [prefix, name].join("."));
          } else if(type === Observable.Types.DELETE && typeof change.oldValue === "object") {
            self._setup(value, [prefix, name].join("."), true);
          }
          
          // `change` is sealed
          // change.path = (prefix ? [prefix, name].join(".") : name);
        });

        self.notifyChanges(changes);
      };
    },
    
    connect: function(fn) {
      if(!fn) {
        return this;
      }
      this._addObserver(fn);
      
      if(!this.isObserving) {
        this._setup();
        this.isObserving = true;
      }
      
      return this;
    },
    
    disconnect: function(fn) {
      this._removeObserver(fn);
      if(!this.listeners.length) {
        this._setup(null, true);
        this.isObserving = false;
      }
    }
    
  }, Observable);
  
  PathObserver.create = function(obj, path) {
    if(!obj) {
      throw new TypeError("Invalid object");
    }
    
    if(path === "") {//observe object itself
      return new ObjectObserver(obj);
    }
    
    //cache
    var obs = paths.get(obj) || {};
    if(!obs[path]) {
      obs[path] = new PathObserver(obj, path);
    }
    return obs[path];
  };
  
  boost.PathObserver = PathObserver;
  
  return PathObserver;
  
});
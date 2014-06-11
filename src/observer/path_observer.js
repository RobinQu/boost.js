define(["runtime", "./observable", "./object_observer"], function(boost, Observable, ObjectObserver) {
  
  var logger = boost.Logger.instrument("path_observer");
  
  var paths = new WeakMap();
  
  var PathObserver = boost.Object.extend({
    
    init: function(obj, path) {
      this.segments = {};
      this.subject = obj;
      this.path = path;
    },
    
    _setup: function(pre, teardown) {
      var self = this,
          obj, path;
      
      obj = pre ? boost.access(this.subject, pre) : this.subject;
      path = pre ? this.path.slice(pre.length + 1) : this.path;
      
      boost.access(obj, path, function(current, key, prefix, end) {
        var ob, handler;
        logger.logger("setup", prefix, key);
        if(current === null || current === undefined) {
          //do nothing
          logger.logger("unreachabe");
        } else {
          if(teardown) {
            delete self.segments[prefix];
          } else {
            self.segments[prefix] = self._createSegmentHandler(current, prefix);
          }
        }
        
      });
    },
    
    _createSegmentHandler: function(subject, prefix) {
      var self;
      return function(changes) {
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
          change.path = prefix ? [prefix, name].join(".") : name;
        });
        
        self.notifyChanges(changes);
      };
    },
    
    connect: function(fn) {
      if(fn && this.listeners.indexOf(fn) === -1) {
        this.listeners.push(fn);
        if(!this.isObserving) {
          this._setup();
          this.isObserving = true;
        }
      }
    },
    
    disconnect: function(fn) {
      if(fn) {
        this.listeners.splice(this.listeners.indexOf(fn), 1);
      } else {
        this.listeners.length = 0;
      }
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
  
  
  return PathObserver;
  
});
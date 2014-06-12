define(["runtime", "./observable", "./object_observer", "./change"], function(boost, Observable, ObjectObserver, Change) {
  
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
      
      if(pre) {
        path = this.path.slice(pre.length+1);
        obj =  boost.access(this.subject, pre);
      } else {
        obj = this.subject;
        path = this.path;
      }

      logger.log(teardown ? "teardown" : "setup", pre, path, obj);

      boost.access(obj, path, function(current, key, path, end) {
        var ob, handler;

        // console.log(pre, path);
        if(path) {
          path = pre ? [pre, path].join(".") : path;
        } else {//nested root
          path = pre;
        }

        logger.log("access", current, path, key);
        if(current === null || current === undefined) {
          //do nothing
          logger.log("not reachable");
        } else if(typeof current === "object") {
          if(teardown) {
            logger.log("remove", current, path);
            handler = self.segments[path];
            Object.unobserve(current, handler);
            delete self.segments[path];
          } else {
            logger.log("add", current, path);
            handler = self.segments[path] = self._createSegmentHandler(current, path);
            Object.observe(current, handler);
          }
        } else {
          logger.log("not observable");
        }
        
      });
    },
    
    _createSegmentHandler: function(subject, prefix) {
      var self = this;
      return function(changes) {
        logger.log("notify changes %s", changes.length);
        
        changes = changes.map(function(change) {
          // console.log(change.object);
          var obj = change.object,
              type = change.type,
              name = change.name,
              value = obj[name],
              path = prefix ? [prefix, name].join(".") : name;
            
        
          if(type === Observable.Types.ADD && value !== null && typeof value === "object") {//changed from `null|undefined` to an object
            self._setup(path);
          } else if(type === Observable.Types.DELETE && typeof change.oldValue === "object") {
            self._setup(path, true);
          }
        
          // `change` is sealed, so we create a new `Change`
          var c = new Change(change, path, self.path.slice(path.length + 1));
          console.log(c);
          return c;
        
        });
        
        self._notifyChanges(changes);
        
        
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
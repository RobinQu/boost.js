define(["../runtime"], function(boost) {
  
  var logger = boost.Logger.instrument("observable");
  
  return {
  
    isObservable: true,
  
    initMixin: function() {
      this.listeners = [];
      this.isObserving = false;
    },
  
    Types: {
      ADD: "add",
      UPDATE: "update",
      DELETE: "delete",
      SET_PROTOTYPE: "setPrototype",
      PREVEMT_EXTENSIONS: "preventExtensions",
      RECONFIGURE: "reconfigure"
    },
  
    _notifyChanges: function(changes) {
      logger.log("handler, listeners %s, changes %s", this.listeners.length, changes.length);
      
      if(!this.isObserving) {//skip notification if we are not observing
        return;
      }
      
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
        try {
          l.call(this, wanted);
        } catch(e) {
          logger.error(e.stack ? e.stack : e);
        }
        // console.log(wanted[0]);
        
      }, this);
    
    },
    
    _addObserver: function(fn, filter) {
      //store filter right on the function
      fn.filter = filter || this.filter;
      if(this.listeners.indexOf(fn) === -1) {
        this.listeners.push(fn);
      }
      logger.log("add listener", this.listeners.length);
      return this;
    },
    
    _removeObserver: function(fn) {
      if(fn) {
        logger.log("remove listener");
        this.listeners.splice(this.listeners.indexOf(fn), 1);
      } else {
        logger.log("clear listener");
        this.listeners.length = 0;
        
      }
    }
    
  
  };
  
});
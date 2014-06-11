define(["runtime"], function(boost) {
  
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
      DELETE: "delete"
    },
  
    notifyChanges: function(changes) {
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
    
    }
  
  };
  
});
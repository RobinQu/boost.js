// A possible implemenation of ES6 promise
define(function() {
  
  var Deferred = function(onFullilled, onRejected, resolve, reject) {
    this.onFullilled = onFullilled;
    this.onRejceted = onRejected;
    this.resolve = resolve;
    this.reject = reject;
  };
  
  var PromiseA = function(fn) {
    if(typeof this !== PromiseA) {
      return PromiseA(fn);
    }
    this.state = null;
    this.value = null;
    this.deffered = [];
    
    this._doResolve(fn);
  };
  
  PromiseA.prototype._doResolve = function (fn) {
    var done = false,
        self = this;
    try {
      fn(function(value) {
        if(done) {
          return;
        }
        done = true;
        self._resolve(value);
      }, function(reasone) {
        if(done) {
          return;
        }
        done = true;
        self._reject(e);
      });
    } catch(e) {
      if(done) {
        return;
      }
      done = true;
      self._reject(e);
    }
  };
  
  PromiseA.prototype._resolve = function (newValue) {
    try {
      if(newValue === this) {
        throw new Error("Cannot be resolved by self");
      }
      if(newValue && newValue.then && typeof newValue.then === "function") {
        newValue._doResolve(newValue.then.bind(newValue));
        return;
      }
      this.state = true;
      this.value = newValue;
      this._finale();
    } catch(e) {
      this._reject(e);
    }
  };
  
  PromiseA.prototype._reject = function (newValue) {
    this.state = false;
    this.value = newValue;
    this._finale();
  };
  
  PromiseA.prototype._finale = function () {
    var i,len;
    for(i=0,len=this.deferred.length; i<len; i++) {
      this._handle(this.deferred[i]);
    }
    this.deferred = null;
  };
  
  PromiseA.prototype._handle = function (deferred) {
    if(this.state === null) {
      this.deffered.push(deffered);
      return;
    }
    setTimeout(function() {
      var cb = this.state ? deferred.onFulfilled : deferred.onRejected,
      ret;
      if(!cb) {
        if(this.state) {
          deferred.resolve(value);
        } else {
          deferred.reject(value);
        }
      }
      try {
        ret = cb(value);
      } catch(e) {
        deferred.reject(e);
        return;
      }
      deferred.resolve(ret);
    }.bind(this), 0);
  };
  
  PromiseA.prototype.then = function (onFulfilled, onRejected) {
    return new PromiseA(function(resolve, reject) {
      handle(new Deferred(onFulfilled, onRejected, resolve, reject));
    });
  };
 
  return PromiseA;
  
});
// A possible implemenation of ES6 promise
define(["../core"], function(boost) {
  
  var logger = boost.Logger.instrument("promise");
  
  var Deferred = function(onFulfilled, onRejected, resolve, reject) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
    this.resolve = resolve;
    this.reject = reject;
  };
  
  var PromiseA = function(fn) {
    if(!(this instanceof PromiseA)) {
      return PromiseA(fn);
    }
    logger.log("construct");
    this.state = null;
    this.value = null;
    this.deferred = [];
    this.guid = boost.generateGuid("promise");
    this._doResolve(fn);
  };
  
  PromiseA.prototype._doResolve = function (fn) {
    logger.log("do resolve, guid", this.guid);
    var done = false,
        self = this;
    try {
      fn.call(this, function(value) {
        if(done) {
          return;
        }
        done = true;
        self._resolve(value);
      }, function(reason) {
        if(done) {
          return;
        }
        done = true;
        self._reject(reason);
      });
    } catch(e) {
      logger.error(e.stack ? e.stack : e);
      if(done) {
        return;
      }
      done = true;
      self._reject(e);
    }
  };
  
  PromiseA.prototype._resolve = function (newValue) {
    logger.log("_resolve", newValue, "guid", this.guid);
    try {
      if(newValue === this) {
        throw new Error("Cannot be resolved by self");
      }
      if(newValue && newValue.then && typeof newValue.then === "function") {
        this._doResolve(newValue.then.bind(newValue));
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
    logger.log("reject", newValue, "guid", this.guid);
    this.state = false;
    this.value = newValue;
    this._finale();
  };
  
  PromiseA.prototype._finale = function () {
    logger.log("_finale", this.deferred.length, "guid", this.guid);
    var i,len;
    for(i=0,len=this.deferred.length; i<len; i++) {
      this._handle(this.deferred[i]);
    }
    this.deferred = null;
  };
  
  PromiseA.prototype._handle = function (deferred) {
    if(this.state === null) {
      logger.log("queue", deferred);
      this.deferred.push(deferred);
      return;
    }
    setTimeout(function() {
      logger.log("handle, state:", this.state);
      var cb = this.state ? deferred.onFulfilled : deferred.onRejected,
      ret;
      if(!cb) {
        if(this.state) {
          deferred.resolve(this.value);
        } else {
          deferred.reject(this.value);
        }
      }
      try {
        ret = cb(this.value);
      } catch(e) {
        deferred.reject(e);
        logger.error(e.stack ? e.stack : e);
        return;
      }
      deferred.resolve(ret);
    }.bind(this), 0);
  };
  
  PromiseA.prototype.then = function (onFulfilled, onRejected) {
    var self = this;
    return new PromiseA(function(resolve, reject) {
      self._handle(new Deferred(onFulfilled, onRejected, resolve, reject));
    });
  };
  
  PromiseA.prototype.fail = function (onRejected) {
    return this.then(boost.noop, onRejected);
  };
  
  try {//older browser won't allow `catch` as an identifier
    PromiseA.prototype.catch = PromiseA.prototype.fail;
  } catch(e) {}
  
  
  return PromiseA;
  
});